import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import pg from "pg";
import { type User, type InsertUser, type Booking, type InsertBooking, users, bookings } from "@shared/schema";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Booking methods
  getBookings(): Promise<Booking[]>;
  getBookingByDate(date: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(date: string, status: string): Promise<Booking | undefined>;
  deleteBooking(date: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Booking methods
  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings);
  }

  async getBookingByDate(date: string): Promise<Booking | undefined> {
    const result = await db.select().from(bookings).where(eq(bookings.date, date));
    return result[0];
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const result = await db.insert(bookings).values(booking).returning();
    return result[0];
  }

  async updateBooking(date: string, status: string): Promise<Booking | undefined> {
    const result = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.date, date))
      .returning();
    return result[0];
  }

  async deleteBooking(date: string): Promise<void> {
    await db.delete(bookings).where(eq(bookings.date, date));
  }
}

export const storage = new DatabaseStorage();
