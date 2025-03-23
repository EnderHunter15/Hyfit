'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import WorkoutTimer from '@/components/workoutTimer';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import Exercise from '@/components/exercise';
import { trpc } from '@/utils/trpc';

export default function WorkoutPage() {
  const [showSearchView, setShowSearchView] = useState(false);
  const { data: exercises, isLoading } = trpc.exercise.getAll.useQuery();

  return (
    <div className='flex flex-col items-center'>
      <Drawer>
        <DrawerTrigger asChild>
          <Button className='capitalize mt-10 rounded-2xl px-12 py-6'>start empty workout</Button>
        </DrawerTrigger>
        <DrawerContent className='h-full rounded-2xl flex items-center'>
          {showSearchView ? (
            <>
              <DrawerTitle className='p-2'>Search for an exercise to add to your workout</DrawerTitle>
              <Input type='search' placeholder='ex. bench press' className='w-2/3 rounded-2xl' />
              <Separator className='p-0.5 rounded-2xl mt-4' />
              {!exercises && <p className='text-center text-sm'>No exercises loaded.</p>}
              {exercises?.length === 0 && <p className='text-center text-sm'>No exercises found.</p>}
              {isLoading && <p className='text-center text-sm'>Loading...</p>}
              {exercises?.map((exercise: { id: string; name: string; category: string }) => {
                const { id, category } = exercise;
                return (
                  <div key={id}>
                    <Exercise exercise={exercise} />
                    <span>{category} </span>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              <DrawerHeader className='flex items-center'>
                <DrawerTitle className='capitalize '>
                  your workout: <WorkoutTimer />
                </DrawerTitle>
                <DrawerDescription>Keep track of your workout by adding exercises</DrawerDescription>
                <Separator className='p-0.5 rounded-2xl' />
              </DrawerHeader>
              <Button className=' w-1/2 rounded-2xl' onClick={() => setShowSearchView(!showSearchView)}>
                Add an Exercise
              </Button>
              <Separator className='p-0.5 rounded-2xl mt-2' />
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
