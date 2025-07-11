import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { exerciseRouter } from "./routers/exercise";
import { workoutRouter } from "./routers/workout";
import { heatmapRouter } from "./routers/heatmap";
import { nutritionGoalsRouter } from "./routers/nutritionGoals";
import { foodRouter } from "./routers/food";
import { workoutTemplateRouter } from "./routers/workoutTemplate";
import { chatRouter } from "./routers/chatRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  exercise: exerciseRouter,
  workout: workoutRouter,
  heatmap: heatmapRouter,
  nutritionGoals: nutritionGoalsRouter,
  food: foodRouter,
  workoutTemplate: workoutTemplateRouter,
  chat: chatRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
