import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  game: router({
    // Get user stats
    getStats: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return null;
      const { getUserStats } = await import("./db");
      return await getUserStats(ctx.user.id);
    }),
    
    // Get game history
    getHistory: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return [];
      const { getUserGameHistory } = await import("./db");
      return await getUserGameHistory(ctx.user.id, 20);
    }),
    
    // Save game result
    saveGame: publicProcedure
      .input((raw: any) => {
        const z = require("zod");
        return z.object({
          hiddenCount: z.number().min(0).max(15),
          timeElapsed: z.number(),
          isCompleted: z.boolean(),
          isCorrect: z.boolean(),
          puzzleData: z.string().optional(),
        }).parse(raw);
      })
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        
        const { createGameSession } = await import("./db");
        
        // Create game session
        await createGameSession({
          userId: ctx.user.id,
          hiddenCount: input.hiddenCount,
          startTime: new Date(),
          endTime: new Date(),
          timeElapsed: input.timeElapsed,
          isCompleted: input.isCompleted ? 1 : 0,
          isCorrect: input.isCorrect ? 1 : 0,
          puzzleData: input.puzzleData,
        });
        
        // Stats eliminadas - enfoque en juego puro
        
        return { success: true };
      }),
  }),

  dailyChallenge: router({
    // Get today's leaderboard
    getLeaderboard: publicProcedure
      .input((raw: any) => {
        const z = require("zod");
        return z.object({
          challengeDate: z.string(),
          limit: z.number().optional().default(100),
        }).parse(raw);
      })
      .query(async ({ input }) => {
        const { getDailyChallengeLeaderboard } = await import("./db");
        return await getDailyChallengeLeaderboard(input.challengeDate, input.limit);
      }),
    
    // Get user's rank
    getUserRank: publicProcedure
      .input((raw: any) => {
        const z = require("zod");
        return z.object({
          challengeDate: z.string(),
        }).parse(raw);
      })
      .query(async ({ ctx, input }) => {
        if (!ctx.user) return null;
        const { getUserDailyChallengeRank } = await import("./db");
        return await getUserDailyChallengeRank(ctx.user.id, input.challengeDate);
      }),
    
    // Save daily challenge completion
    saveCompletion: publicProcedure
      .input((raw: any) => {
        const z = require("zod");
        return z.object({
          challengeDate: z.string(),
          timeElapsed: z.number(),
        }).parse(raw);
      })
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        
        const { saveDailyChallengeCompletion } = await import("./db");
        const result = await saveDailyChallengeCompletion(
          ctx.user.id,
          input.challengeDate,
          input.timeElapsed
        );
        
        return result;
      }),
  }),
});

export type AppRouter = typeof appRouter;
