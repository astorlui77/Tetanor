import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Game sessions - stores individual game plays
 */
export const gameSessions = mysqlTable("game_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  hiddenCount: int("hiddenCount").notNull(), // Cantidad de números ocultos (dificultad)
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime"),
  timeElapsed: int("timeElapsed"), // seconds
  isCompleted: int("isCompleted").notNull().default(0), // 0 or 1 (boolean)
  isCorrect: int("isCorrect").notNull().default(0), // 0 or 1 (boolean)
  puzzleData: text("puzzleData"), // Store the puzzle as JSON string
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * User statistics - aggregated stats per user
 */
export const userStats = mysqlTable("user_stats", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  gamesPlayed: int("gamesPlayed").notNull().default(0),
  gamesCompleted: int("gamesCompleted").notNull().default(0),
  bestTimeEasy: int("bestTimeEasy"), // seconds
  bestTimeMedium: int("bestTimeMedium"),
  bestTimeHard: int("bestTimeHard"),
  averageTime: int("averageTime"), // seconds
  currentStreak: int("currentStreak").notNull().default(0),
  longestStreak: int("longestStreak").notNull().default(0),
  lastPlayedAt: timestamp("lastPlayedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GameSession = typeof gameSessions.$inferSelect;
export type InsertGameSession = typeof gameSessions.$inferInsert;
export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = typeof userStats.$inferInsert;

/**
 * Daily challenge completions - stores user times for daily puzzles
 */
export const dailyChallengeCompletions = mysqlTable("daily_challenge_completions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  challengeDate: varchar("challengeDate", { length: 10 }).notNull(), // YYYY-MM-DD
  timeElapsed: int("timeElapsed").notNull(), // seconds
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type DailyChallengeCompletion = typeof dailyChallengeCompletions.$inferSelect;
export type InsertDailyChallengeCompletion = typeof dailyChallengeCompletions.$inferInsert;
