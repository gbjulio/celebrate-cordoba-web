import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { storage } from './storage.js';

const JWT_SECRET = process.env.JWT_SECRET || 'celebrate-cordoba-jwt-secret';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const path = req.url?.split('?')[0] || '';
  
  // Login endpoint
  if (path.endsWith('/login') && req.method === 'POST') {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Usuario y contraseña requeridos" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return res.json({ 
        success: true, 
        user: { id: user.id, username: user.username },
        token 
      });
    } catch (error) {
      console.error("Error en login:", error);
      return res.status(500).json({ message: "Error al iniciar sesión" });
    }
  }

  // Logout endpoint
  if (path.endsWith('/logout') && req.method === 'POST') {
    return res.json({ success: true });
  }

  // Me endpoint
  if (path.endsWith('/me') && req.method === 'GET') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string };

      const user = await storage.getUser(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: "Usuario no encontrado" });
      }

      return res.json({ user: { id: user.id, username: user.username } });
    } catch (error) {
      return res.status(401).json({ message: "Token inválido" });
    }
  }

  return res.status(404).json({ message: "Ruta no encontrada" });
}
