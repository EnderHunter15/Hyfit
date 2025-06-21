import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const foodRouter = createTRPCRouter({
  addFood: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        kcal: z.number(),
        protein: z.number(),
        carbs: z.number(),
        fat: z.number(),
        quantity: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db.foodEntry.create({
        data: {
          userId: ctx.userId,
          ...input,
        },
      });
    }),

  getTodayFoods: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    return ctx.db.foodEntry.findMany({
      where: {
        userId: ctx.userId,
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      orderBy: { date: "desc" },
    });
  }),

  // ✅ Get all distinct food log dates (formatted as YYYY-MM-DD)
  getAllDates: protectedProcedure.query(async ({ ctx }) => {
    const dates = await ctx.db.foodEntry.findMany({
      where: {
        userId: ctx.userId,
      },
      select: {
        date: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    const uniqueDates = Array.from(
      new Set(dates.map((entry) => entry.date.toISOString().split("T")[0])),
    );

    return uniqueDates;
  }),

  // ✅ Get all foods for a specific date
  getFoodsByDate: protectedProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ input, ctx }) => {
      const date = new Date(input.date);
      const startOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      return ctx.db.foodEntry.findMany({
        where: {
          userId: ctx.userId,
          date: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
        orderBy: { date: "desc" },
      });
    }),
  getAllFoods: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.foodEntry.findMany({
      where: { userId: ctx.userId },
      orderBy: { date: "desc" },
    });
  }),
});
