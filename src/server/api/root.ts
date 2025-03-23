import { createTRPCRouter } from './trpc';
import { exerciseRouter } from './routers/exercise';
export const appRouter = createTRPCRouter({
  exercise: exerciseRouter,
});

export type AppRouter = typeof appRouter;
