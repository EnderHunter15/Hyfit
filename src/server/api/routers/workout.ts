import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const workoutRouter = createTRPCRouter({
  createWorkout: publicProcedure
    .input(
      z.object({
        duration: z.number(),
        exercises: z.array(
          z.object({
            exerciseId: z.string(),
            sets: z.array(
              z.object({
                kg: z.number(),
                reps: z.number(),
              }),
            ),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const workout = await ctx.db.workout.create({
        data: {
          duration: input.duration,
          exercises: {
            create: input.exercises.map((ex) => ({
              exercise: { connect: { id: ex.exerciseId } },
              sets: {
                create: ex.sets.map((set) => ({
                  kg: set.kg,
                  reps: set.reps,
                })),
              },
            })),
          },
        },
      });

      return workout;
    }),

  getStats: publicProcedure.query(async ({ ctx }) => {
    const workouts = await ctx.db.workout.findMany({
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: true,
          },
        },
      },
    });

    let totalKg = 0;
    let totalReps = 0;
    const muscleCount: Record<string, number> = {};

    workouts.forEach((workout) => {
      workout.exercises.forEach((we) => {
        we.sets.forEach((set) => {
          totalKg += set.kg * set.reps;
          totalReps += set.reps;
        });

        const muscle = we.exercise.muscleGroup ?? "Unknown";
        muscleCount[muscle] = (muscleCount[muscle] ?? 0) + 1;
      });
    });

    const mostWorked =
      Object.entries(muscleCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

    // Placeholder for streak for now
    const streak = 3;

    return {
      totalKg,
      totalReps,
      mostWorked,
      streak,
    };
  }),
});
