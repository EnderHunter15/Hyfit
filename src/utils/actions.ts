import prisma from './db';

export const getAllExercises = async () => {
  return await prisma.exercise.findMany({
    orderBy: {
      name: 'asc',
    },
  });
};
