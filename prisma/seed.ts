import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const exercises = [
  {
    name: 'Bench Press',
    category: 'Push',
    muscles: ['Chest', 'Triceps'],
  },
  {
    name: 'Incline Dumbbell Press',
    category: 'Push',
    muscles: ['Chest', 'Front Delts'],
  },
  {
    name: 'Overhead Press',
    category: 'Push',
    muscles: ['Shoulders', 'Triceps'],
  },
  {
    name: 'Push-up',
    category: 'Push',
    muscles: ['Chest', 'Triceps', 'Core'],
  },
  {
    name: 'Cable Triceps Pushdown',
    category: 'Push',
    muscles: ['Triceps'],
  },
  {
    name: 'Pull-up',
    category: 'Pull',
    muscles: ['Lats', 'Biceps'],
  },
  {
    name: 'Barbell Row',
    category: 'Pull',
    muscles: ['Back', 'Biceps'],
  },
  {
    name: 'Face Pull',
    category: 'Pull',
    muscles: ['Rear Delts', 'Upper Back'],
  },
  {
    name: 'Bicep Curl',
    category: 'Pull',
    muscles: ['Biceps'],
  },
  {
    name: 'Hammer Curl',
    category: 'Pull',
    muscles: ['Biceps', 'Forearms'],
  },
  {
    name: 'Deadlift',
    category: 'Pull',
    muscles: ['Back', 'Hamstrings', 'Glutes'],
  },
  {
    name: 'Squat',
    category: 'Legs',
    muscles: ['Quads', 'Glutes'],
  },
  {
    name: 'Leg Press',
    category: 'Legs',
    muscles: ['Quads', 'Glutes'],
  },
  {
    name: 'Romanian Deadlift',
    category: 'Legs',
    muscles: ['Hamstrings', 'Glutes'],
  },
  {
    name: 'Calf Raise',
    category: 'Legs',
    muscles: ['Calves'],
  },
];

async function main() {
  console.log('🌱 Seeding exercises...');
  for (const ex of exercises) {
    await prisma.exercise.upsert({
      where: { name: ex.name },
      update: {},
      create: ex,
    });
  }
  console.log('✅ Done seeding.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
