import { Request, Response } from 'express';
import axios from 'axios';
import { News, Category, User, UserPreference } from '../models';
import { Op } from 'sequelize';

// Obtener noticias personalizadas para el usuario
export const getPersonalizedNews = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore - El middleware de autenticación añade el usuario a la solicitud
    const userId = req.user.id;
    
    // Obtener las preferencias del usuario
    const userPreferences = await UserPreference.findAll({
      where: { userId },
      include: [{ model: Category }],
    });
    
    if (userPreferences.length === 0) {
      res.status(200).json({ message: 'No tienes preferencias configuradas', news: [] });
      return;
    }
    
    // Extraer los IDs de categorías
    const categoryIds = userPreferences.map((pref: any) => pref.categoryId);
    
    // Buscar noticias en la base de datos que coincidan con las preferencias del usuario
    const news = await News.findAll({
      where: {
        categoryId: { [Op.in]: categoryIds },
      },
      include: [{ model: Category }],
      order: [['publishedAt', 'DESC']],
      limit: 20,
    });
    
    res.json(news);
  } catch (error) {
    console.error('Error al obtener noticias personalizadas:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Obtener noticias por categoría
export const getNewsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.params;
    
    const news = await News.findAll({
      where: { categoryId },
      include: [{ model: Category }],
      order: [['publishedAt', 'DESC']],
      limit: 20,
    });
    
    res.json(news);
  } catch (error) {
    console.error('Error al obtener noticias por categoría:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Buscar noticias
export const searchNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    
    if (!query) {
      res.status(400).json({ message: 'Se requiere un término de búsqueda' });
      return;
    }
    
    const news = await News.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
          { content: { [Op.like]: `%${query}%` } },
        ],
      },
      include: [{ model: Category }],
      order: [['publishedAt', 'DESC']],
      limit: 20,
    });
    
    res.json(news);
  } catch (error) {
    console.error('Error al buscar noticias:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Guardar una noticia para el usuario
export const saveNews = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore - El middleware de autenticación añade el usuario a la solicitud
    const userId = req.user.id;
    const { newsId } = req.params;
    
    const news = await News.findByPk(newsId);
    
    if (!news) {
      res.status(404).json({ message: 'Noticia no encontrada' });
      return;
    }
    
    // Crear una copia de la noticia para el usuario
    const savedNews = await News.create({
      title: news.title,
      description: news.description,
      content: news.content,
      imageUrl: news.imageUrl,
      sourceUrl: news.sourceUrl,
      sourceName: news.sourceName,
      publishedAt: news.publishedAt,
      categoryId: news.categoryId,
      userId,
      isSaved: true,
    });
    
    res.status(201).json(savedNews);
  } catch (error) {
    console.error('Error al guardar noticia:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Obtener noticias guardadas por el usuario
export const getSavedNews = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore - El middleware de autenticación añade el usuario a la solicitud
    const userId = req.user.id;
    
    const savedNews = await News.findAll({
      where: {
        userId,
        isSaved: true,
      },
      include: [{ model: Category }],
      order: [['createdAt', 'DESC']],
    });
    
    res.json(savedNews);
  } catch (error) {
    console.error('Error al obtener noticias guardadas:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Eliminar una noticia guardada
export const deleteSavedNews = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore - El middleware de autenticación añade el usuario a la solicitud
    const userId = req.user.id;
    const { newsId } = req.params;
    
    const news = await News.findOne({
      where: {
        id: newsId,
        userId,
        isSaved: true,
      },
    });
    
    if (!news) {
      res.status(404).json({ message: 'Noticia guardada no encontrada' });
      return;
    }
    
    await news.destroy();
    
    res.json({ message: 'Noticia eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar noticia guardada:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Obtener noticias desde una API externa y guardarlas en la base de datos
export const fetchAndStoreNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    
    if (!apiKey) {
      res.status(500).json({ message: 'API key no configurada' });
      return;
    }
    
    // Obtener todas las categorías
    const categories = await Category.findAll();
    
    if (categories.length === 0) {
      res.status(404).json({ message: 'No hay categorías disponibles' });
      return;
    }
    
    let totalNewsAdded = 0;
    
    // Para cada categoría, obtener noticias de la API
    for (const category of categories) {
      try {
        const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
          params: {
            apiKey,
            category: category.name.toLowerCase(),
            language: 'es',
            pageSize: 10,
          },
        });
        
        const articles = response.data.articles;
        
        // Guardar cada artículo en la base de datos
        for (const article of articles) {
          // Verificar si la noticia ya existe
          const existingNews = await News.findOne({
            where: {
              title: article.title,
              sourceUrl: article.url,
            },
          });
          
          if (!existingNews) {
            await News.create({
              title: article.title,
              description: article.description || 'Sin descripción',
              content: article.content || 'Sin contenido',
              imageUrl: article.urlToImage,
              sourceUrl: article.url,
              sourceName: article.source.name,
              publishedAt: new Date(article.publishedAt),
              categoryId: category.id,
            });
            
            totalNewsAdded++;
          }
        }
      } catch (error) {
        console.error(`Error al obtener noticias para la categoría ${category.name}:`, error);
      }
    }
    
    res.json({ message: `Se han añadido ${totalNewsAdded} noticias nuevas` });
  } catch (error) {
    console.error('Error al obtener y guardar noticias:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
}; 