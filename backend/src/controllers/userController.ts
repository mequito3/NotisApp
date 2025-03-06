import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserPreference, Category } from '../models';

// Función para generar un token JWT
const generateToken = (id: number): string => {
  const secret = process.env.JWT_SECRET || 'default_secret';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

// Registrar un nuevo usuario
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      res.status(400).json({ message: 'El usuario ya existe' });
      return;
    }

    // Crear el usuario
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Iniciar sesión
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Buscar el usuario por email
    const user = await User.findOne({ where: { email } });

    // Verificar si el usuario existe y la contraseña es correcta
    if (user && (await user.comparePassword(password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Obtener perfil de usuario
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore - El middleware de autenticación añade el usuario a la solicitud
    const userId = req.user.id;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Category,
          through: { attributes: [] },
        },
      ],
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Actualizar preferencias de usuario
export const updateUserPreferences = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore - El middleware de autenticación añade el usuario a la solicitud
    const userId = req.user.id;
    const { categoryIds } = req.body;

    // Eliminar preferencias existentes
    await UserPreference.destroy({ where: { userId } });

    // Crear nuevas preferencias
    const preferences = await Promise.all(
      categoryIds.map((categoryId: number) => 
        UserPreference.create({ userId, categoryId })
      )
    );

    res.status(200).json({ message: 'Preferencias actualizadas correctamente', preferences });
  } catch (error) {
    console.error('Error al actualizar preferencias:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
}; 