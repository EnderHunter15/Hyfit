import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const workoutTemplateRouter = createTRPCRouter({
  getTemplates: protectedProcedure.query(({ ctx }) => {
    return ctx.db.workoutTemplate.findMany({
      where: { userId: ctx.userId },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });
  }),
  createTemplate: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        exercises: z.array(z.string()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db.workoutTemplate.create({
        data: {
          name: input.name,
          userId: ctx.userId,
          exercises: {
            create: input.exercises.map((id) => ({ exerciseId: id })),
          },
        },
      });
    }),

  deleteTemplate: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) =>
      ctx.db.workoutTemplate.delete({ where: { id: input } }),
    ),
});
