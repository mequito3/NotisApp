import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

interface JwtPayload {
  id: number;
}

// Middleware para proteger rutas
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  // Verificar si hay token en los headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtener el token del header
      token = req.headers.authorization.split(' ')[1];

      // Verificar el token
      const secret = process.env.JWT_SECRET || 'default_secret';
      const decoded = jwt.verify(token, secret) as JwtPayload;

      // Obtener el usuario del token
      // @ts-ignore - Añadir el usuario a la solicitud
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
      });

      next();
    } catch (error) {
      console.error('Error de autenticación:', error);
      res.status(401).json({ message: 'No autorizado, token inválido' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};

// Middleware para verificar si el usuario es administrador
export const admin = (req: Request, res: Response, next: NextFunction): void => {
  // @ts-ignore - El middleware protect añade el usuario a la solicitud
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'No autorizado como administrador' });
  }
}; 