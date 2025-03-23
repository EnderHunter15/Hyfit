import { createTRPCRouter, publicProcedure } from '../trpc';
import { getAllExercises } from '@/utils/actions';

export const exerciseRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    return await getAllExercises();
  }),
});
