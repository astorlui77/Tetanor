import { and, asc, desc, eq, lt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  gameSessions, 
  InsertGameSession, 
  userStats, 
  InsertUserStats,
  dailyChallengeCompletions,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Game and stats queries

/**
 * Get or create user stats
 */
export async function getOrCreateUserStats(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  let stats = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);
  
  if (stats.length === 0) {
    await db.insert(userStats).values({
      userId,
      gamesPlayed: 0,
      gamesCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
    });
    stats = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);
  }
  
  return stats[0];
}

/**
 * Create a new game session
 */
export async function createGameSession(data: InsertGameSession) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(gameSessions).values(data);
  return result;
}

/**
 * Update a game session
 */
export async function updateGameSession(
  sessionId: number,
  data: Partial<InsertGameSession>
) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(gameSessions).set(data).where(eq(gameSessions.id, sessionId));
}

/**
 * Get user's game history
 */
export async function getUserGameHistory(userId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(gameSessions)
    .where(eq(gameSessions.userId, userId))
    .orderBy(desc(gameSessions.createdAt))
    .limit(limit);
}

/**
 * Update user statistics after completing a game
 * DEPRECATED: Stats eliminadas - enfoque en juego puro
 */
/*
export async function updateUserStatsAfterGame(
  userId: number,
  difficulty: "easy" | "medium" | "hard",
  timeElapsed: number,
  isCompleted: boolean
) {
  const db = await getDb();
  if (!db) return null;
  
  const stats = await getOrCreateUserStats(userId);
  if (!stats) return null;
  
  const updates: Partial<InsertUserStats> = {
    gamesPlayed: stats.gamesPlayed + 1,
    lastPlayedAt: new Date(),
  };
  
  if (isCompleted) {
    updates.gamesCompleted = stats.gamesCompleted + 1;
    updates.currentStreak = stats.currentStreak + 1;
    
    if (updates.currentStreak > stats.longestStreak) {
      updates.longestStreak = updates.currentStreak;
    }
    
    // Update best time for this difficulty
    const bestTimeField = `bestTime${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}` as keyof typeof stats;
    const currentBest = stats[bestTimeField] as number | null;
    
    if (!currentBest || timeElapsed < currentBest) {
      (updates as any)[bestTimeField] = timeElapsed;
    }
    
    // Calculate average time
    const completedGames = await db
      .select()
      .from(gameSessions)
      .where(
        and(
          eq(gameSessions.userId, userId),
          eq(gameSessions.isCompleted, 1)
        )
      );
    
    const totalTime = completedGames.reduce((sum, game) => sum + (game.timeElapsed || 0), 0) + timeElapsed;
    updates.averageTime = Math.floor(totalTime / (completedGames.length + 1));
  } else {
    updates.currentStreak = 0;
  }
  
  await db.update(userStats).set(updates).where(eq(userStats.userId, userId));
  
  return await getOrCreateUserStats(userId);
}
*/

/**
 * Get user statistics
 */
export async function getUserStats(userId: number) {
  return await getOrCreateUserStats(userId);
}

/**
 * Save daily challenge completion
 */
export async function saveDailyChallengeCompletion(
  userId: number,
  challengeDate: string,
  timeElapsed: number
) {
  const db = await getDb();
  if (!db) return null;
  
  // Check if user already completed this challenge
  const existing = await db
    .select()
    .from(dailyChallengeCompletions)
    .where(
      and(
        eq(dailyChallengeCompletions.userId, userId),
        eq(dailyChallengeCompletions.challengeDate, challengeDate)
      )
    )
    .limit(1);
  
  // Only save if this is a better time or first completion
  if (existing.length === 0) {
    await db.insert(dailyChallengeCompletions).values({
      userId,
      challengeDate,
      timeElapsed,
    });
    return { isNewRecord: true, previousTime: null };
  } else if (timeElapsed < existing[0].timeElapsed) {
    await db
      .update(dailyChallengeCompletions)
      .set({ timeElapsed, completedAt: new Date() })
      .where(eq(dailyChallengeCompletions.id, existing[0].id));
    return { isNewRecord: true, previousTime: existing[0].timeElapsed };
  }
  
  return { isNewRecord: false, previousTime: existing[0].timeElapsed };
}

/**
 * Get daily challenge leaderboard
 */
export async function getDailyChallengeLeaderboard(
  challengeDate: string,
  limit: number = 100
) {
  const db = await getDb();
  if (!db) return [];
  
  const results = await db
    .select({
      userId: dailyChallengeCompletions.userId,
      timeElapsed: dailyChallengeCompletions.timeElapsed,
      completedAt: dailyChallengeCompletions.completedAt,
      userName: users.name,
    })
    .from(dailyChallengeCompletions)
    .leftJoin(users, eq(dailyChallengeCompletions.userId, users.id))
    .where(eq(dailyChallengeCompletions.challengeDate, challengeDate))
    .orderBy(asc(dailyChallengeCompletions.timeElapsed))
    .limit(limit);
  
  return results.map((result, index) => ({
    rank: index + 1,
    userId: result.userId,
    userName: result.userName || "Anónimo",
    timeElapsed: result.timeElapsed,
    completedAt: result.completedAt,
  }));
}

/**
 * Get user's rank in daily challenge
 */
export async function getUserDailyChallengeRank(
  userId: number,
  challengeDate: string
) {
  const db = await getDb();
  if (!db) return null;
  
  const userCompletion = await db
    .select()
    .from(dailyChallengeCompletions)
    .where(
      and(
        eq(dailyChallengeCompletions.userId, userId),
        eq(dailyChallengeCompletions.challengeDate, challengeDate)
      )
    )
    .limit(1);
  
  if (userCompletion.length === 0) return null;
  
  const betterTimes = await db
    .select()
    .from(dailyChallengeCompletions)
    .where(
      and(
        eq(dailyChallengeCompletions.challengeDate, challengeDate),
        lt(dailyChallengeCompletions.timeElapsed, userCompletion[0].timeElapsed)
      )
    );
  
  return {
    rank: betterTimes.length + 1,
    timeElapsed: userCompletion[0].timeElapsed,
    completedAt: userCompletion[0].completedAt,
  };
}
