import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const heatmapRouter = createTRPCRouter({
  getMuscleHeatmap: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const workouts = await ctx.db.workout.findMany({
        where: { userId: input.userId },
        select: {
          exercises: {
            select: {
              exercise: { select: { muscleGroup: true } },
              sets: { select: { kg: true, reps: true } },
            },
          },
        },
      });

      const volumeMap: Record<string, number> = {};

      workouts.forEach(({ exercises }) => {
        exercises.forEach(({ exercise, sets }) => {
          const muscle = exercise.muscleGroup?.toLowerCase().trim();
          if (!muscle) return;
          const volume = sets.reduce((acc, s) => acc + s.kg * s.reps, 0);
          volumeMap[muscle] = (volumeMap[muscle] ?? 0) + volume;
        });
      });

      return volumeMap;
    }),
});
