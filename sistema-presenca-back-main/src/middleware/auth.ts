import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../interfaces/user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET não está definido nas variáveis de ambiente');
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }

  jwt.verify(token, jwtSecret, (err: any, user: any) => {
    if (err) {
      console.error('Erro ao verificar token:', err);
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }
    
    req.user = user as IUser;
    next();
  });
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Acesso negado. Função ${req.user.role} não tem permissão.` 
      });
    }

    next();
  };
};
