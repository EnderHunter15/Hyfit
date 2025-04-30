import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const exerciseRouter = createTRPCRouter({
  getAllExercises: protectedProcedure.query(async () => {
    return await db.exercise.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),
});
