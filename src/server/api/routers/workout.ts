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
});
