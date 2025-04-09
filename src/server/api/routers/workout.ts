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
            name: z.string(),
            muscleGroup: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.workout.create({
        data: {
          duration: 100,
          exercises: {
            create: input.exercises.map((ex) => ({
              connect: { id: ex.exerciseId },
              name: ex.name,
            })),
          },
        },
      });
    }),
});
