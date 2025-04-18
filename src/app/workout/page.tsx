"use client";

import AddExerciseModal from "@/components/addExerciseModal";
import { Send } from "lucide-react";
import { useState } from "react";
import WorkoutTimer from "@/components/workoutTimer";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useWorkoutContext } from "@/context/workoutContext";

import { Separator } from "@radix-ui/react-separator";
import ExerciseLogCard from "@/components/exerciseLogCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/trpc/react";
import type { SetRow } from "@/utils/types";

export default function WorkoutPage() {
  const { workoutExercises, setWorkoutExercises, clearWorkout } =
    useWorkoutContext();
  const [open, setOpen] = useState(false);
  const [workoutFinished, setWorkoutFinished] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const createWorkout = api.workout.createWorkout.useMutation();

  const updateExerciseSets = (exerciseId: string, sets: SetRow[]) => {
    setWorkoutExercises((prev) =>
      prev.map((ex) => (ex.id === exerciseId ? { ...ex, sets } : ex)),
    );
  };

  return (
    <div className="bg-background flex h-full min-h-screen w-full flex-col items-center p-6">
      <Drawer
        open={open}
        onOpenChange={(newState) => {
          if (!newState && !workoutFinished) return;
          setOpen(newState);
        }}
      >
        <DrawerTrigger asChild>
          <Button className="w-3/4 rounded-2xl" onClick={() => setOpen(true)}>
            Start empty workout
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-background flex h-[90vh] p-4">
          <DrawerHeader className="flex flex-col items-center">
            <DrawerTitle>Current Session</DrawerTitle>
            <DrawerDescription>Add exercises to your workout</DrawerDescription>
            <WorkoutTimer seconds={seconds} setSeconds={setSeconds} />

            <Separator
              className="bg-primary mt-2 w-full rounded-2xl p-[2px]"
              orientation="horizontal"
            />
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto">
            <ScrollArea className="h-full w-full space-y-4 pr-2">
              {workoutExercises.map((exercise) => (
                <ExerciseLogCard
                  key={exercise.id}
                  exercise={exercise}
                  updateExerciseSets={updateExerciseSets}
                />
              ))}
            </ScrollArea>
          </div>
          <div className="flex flex-col items-center">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button className="mt-4 w-1/2 rounded-2xl">
                  Add an exercise
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full">
                <SheetHeader className="flex items-center">
                  <SheetTitle>
                    <AddExerciseModal setSheetOpen={setSheetOpen} />
                  </SheetTitle>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>

          <DrawerFooter className="mt-auto pt-4">
            <Button
              onClick={() => {
                createWorkout.mutate(
                  {
                    duration: seconds,
                    exercises: workoutExercises.map((ex) => ({
                      exerciseId: ex.id,
                      sets: ex.sets.map((set) => ({
                        kg: Number(set.kg),
                        reps: Number(set.reps),
                      })),
                    })),
                  },
                  {
                    onSuccess: () => {
                      console.log("Workout saved!");
                      clearWorkout();
                      setSeconds(0);
                      setOpen(false);
                      setWorkoutFinished(true);
                    },
                    onError: (error) => {
                      console.error("💥 Workout create error:", error);
                    },
                  },
                );
              }}
              className="rounded-2xl"
            >
              Complete workout <Send />
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
