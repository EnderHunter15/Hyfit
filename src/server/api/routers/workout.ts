import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const workoutRouter = createTRPCRouter({
  createWorkout: protectedProcedure
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
      const userId = ctx.userId;

      if (!userId) throw new Error("Unauthorized");

      const workout = await ctx.db.workout.create({
        data: {
          duration: input.duration,
          userId,
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

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    if (!userId) throw new Error("Unauthorized");

    const workouts = await ctx.db.workout.findMany({
      where: { userId },
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

    const workoutDates = Array.from(
      new Set(
        workouts
          .map((w) => w.createdAt?.toISOString().split("T")[0])
          .filter((date): date is string => date !== undefined),
      ),
    ).sort((a, b) => (a > b ? -1 : 1));

    let streak = 0;
    const currentDate = new Date();

    for (const dateStr of workoutDates) {
      const workoutDate = new Date(dateStr);

      const currentMidnight = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
      );
      const workoutMidnight = new Date(
        workoutDate.getFullYear(),
        workoutDate.getMonth(),
        workoutDate.getDate(),
      );

      if (currentMidnight.getTime() === workoutMidnight.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    const totalDurationSeconds = workouts.reduce(
      (sum, w) => sum + (w.duration ?? 0),
      0,
    );

    function formatDuration(seconds: number) {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);

      if (days > 0) return `${days}d ${hours}h ${minutes}m`;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    }

    return {
      totalKg,
      totalReps,
      mostWorked,
      streak,
      totalDuration: formatDuration(totalDurationSeconds),
    };
  }),
});
