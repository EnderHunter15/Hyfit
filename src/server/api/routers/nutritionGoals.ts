import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const nutritionGoalsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.userId;
      if (!userId) return null;
      const goals = await db.userNutritionGoals.findUnique({
        where: { userId },
      });

      return (
        goals ?? {
          calories: 2000,
          protein: 100,
          carbs: 250,
          fat: 70,
        }
      );
    } catch (e) {
      console.error("Failed to fetch nutrition goals", e);
      throw new Error("Could not fetch goals");
    }
  }),

  update: protectedProcedure
    .input(
      z.object({
        calories: z.number().min(500).max(8000),
        protein: z.number().min(0),
        carbs: z.number().min(0),
        fat: z.number().min(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      return await db.userNutritionGoals.upsert({
        where: { userId },
        update: input,
        create: {
          userId,
          ...input,
        },
      });
    }),
});
