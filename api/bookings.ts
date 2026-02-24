import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { storage } from './storage.js';

const JWT_SECRET = process.env.JWT_SECRET || 'celebrate-cordoba-jwt-secret';

function verifyToken(req: VercelRequest): { userId: string } | null {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

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

  const { date } = req.query;

  // GET /api/bookings - Get all bookings (public)
  if (req.method === 'GET' && !date) {
    try {
      const bookings = await storage.getBookings();
      return res.json(bookings);
    } catch (error) {
      console.error("Error getting bookings:", error);
      return res.status(500).json({ message: "Error al obtener reservas" });
    }
  }

  // PUT /api/bookings/[date] - Update or create booking (requires auth)
  if (req.method === 'PUT' && date) {
    const user = verifyToken(req);
    if (!user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    try {
      const dateStr = Array.isArray(date) ? date[0] : date;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "Estado requerido" });
      }

      const existing = await storage.getBookingByDate(dateStr);
      
      let booking;
      if (existing) {
        booking = await storage.updateBooking(dateStr, status);
      } else {
        booking = await storage.createBooking({ date: dateStr, status });
      }

      return res.json(booking);
    } catch (error) {
      console.error("Error updating booking:", error);
      return res.status(500).json({ message: "Error al actualizar reserva" });
    }
  }

  // DELETE /api/bookings/[date] - Delete booking (requires auth)
  if (req.method === 'DELETE' && date) {
    const user = verifyToken(req);
    if (!user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    try {
      const dateStr = Array.isArray(date) ? date[0] : date;
      await storage.deleteBooking(dateStr);
      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting booking:", error);
      return res.status(500).json({ message: "Error al eliminar reserva" });
    }
  }

  return res.status(405).json({ message: "Método no permitido" });
}
