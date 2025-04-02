import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const exerciseRouter = createTRPCRouter({
  getAllExercises: publicProcedure.query(async () => {
    return await db.exercise.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),
});
