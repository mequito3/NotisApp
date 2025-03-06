import { Request, Response } from 'express';
import { Category } from '../models';

// Obtener todas las categorías
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Obtener una categoría por ID
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Categoría no encontrada' });
    }
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Crear una nueva categoría
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    
    // Verificar si la categoría ya existe
    const categoryExists = await Category.findOne({ where: { name } });
    if (categoryExists) {
      res.status(400).json({ message: 'La categoría ya existe' });
      return;
    }
    
    const category = await Category.create({
      name,
      description,
    });
    
    res.status(201).json(category);
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Actualizar una categoría
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const category = await Category.findByPk(id);
    
    if (!category) {
      res.status(404).json({ message: 'Categoría no encontrada' });
      return;
    }
    
    // Actualizar la categoría
    await category.update({
      name,
      description,
    });
    
    res.json(category);
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Eliminar una categoría
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByPk(id);
    
    if (!category) {
      res.status(404).json({ message: 'Categoría no encontrada' });
      return;
    }
    
    await category.destroy();
    
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
}; 