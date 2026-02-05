import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";
import bcrypt from "bcryptjs";

const PgSession = connectPgSimple(session);

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup session middleware
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

  app.use(
    session({
      store: new PgSession({
        pool,
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "celebrate-cordoba-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      },
    })
  );

  // Middleware to check if user is authenticated
  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "No autorizado" });
    }
    next();
  };

  // Seed admin user on startup
  const ADMIN_USERNAME = "celebratecordobaadmin";
  const ADMIN_PASSWORD = "yEE5N!7hlfzHUk";

  (async () => {
    try {
      const existingAdmin = await storage.getUserByUsername(ADMIN_USERNAME);
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        await storage.createUser({ username: ADMIN_USERNAME, password: hashedPassword });
        console.log("Admin user created");
      }
    } catch (error) {
      console.error("Error seeding admin user:", error);
    }
  })();

  // Auth routes (registration disabled)
  app.post("/api/auth/login", async (req, res) => {
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

      req.session.userId = user.id;
      res.json({ success: true, user: { id: user.id, username: user.username } });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ message: "Error al iniciar sesión" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error al cerrar sesión" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    res.json({ user: { id: user.id, username: user.username } });
  });

  // Booking routes
  app.get("/api/bookings", async (_req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error getting bookings:", error);
      res.status(500).json({ message: "Error al obtener reservas" });
    }
  });

  app.put("/api/bookings/:date", requireAuth, async (req, res) => {
    try {
      const date = req.params.date as string;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "Estado requerido" });
      }

      const existing = await storage.getBookingByDate(date);
      
      let booking;
      if (existing) {
        booking = await storage.updateBooking(date, status);
      } else {
        booking = await storage.createBooking({ date, status });
      }

      res.json(booking);
    } catch (error) {
      console.error("Error updating booking:", error);
      res.status(500).json({ message: "Error al actualizar reserva" });
    }
  });

  app.delete("/api/bookings/:date", requireAuth, async (req, res) => {
    try {
      const date = req.params.date as string;
      await storage.deleteBooking(date);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting booking:", error);
      res.status(500).json({ message: "Error al eliminar reserva" });
    }
  });

  return httpServer;
}
