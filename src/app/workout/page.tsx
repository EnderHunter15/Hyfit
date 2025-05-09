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
import { useUser } from "@clerk/nextjs";

export default function WorkoutPage() {
  const { workoutExercises, setWorkoutExercises, clearWorkout } =
    useWorkoutContext();
  const [open, setOpen] = useState(false);
  const [workoutFinished, setWorkoutFinished] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const { user } = useUser();
  const { data: workouts = [], isLoading } = api.workout.getAllForUser.useQuery(
    {
      userId: user?.id ?? "",
    },
  );

  const createWorkout = api.workout.createWorkout.useMutation();

  const updateExerciseSets = (exerciseId: string, sets: SetRow[]) => {
    setWorkoutExercises((prev) =>
      prev.map((ex) => (ex.id === exerciseId ? { ...ex, sets } : ex)),
    );
  };

  const removeExercise = (exerciseId: string) => {
    setWorkoutExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
  };

  function formatDuration(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;

    if (hrs > 0) return `${hrs}h ${remainingMins}m`;
    return `${mins} min`;
  }

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
                  removeExercise={removeExercise}
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
      <Drawer open={historyOpen} onOpenChange={setHistoryOpen}>
        <DrawerTrigger asChild>
          <Button
            className="mt-4 w-3/4 rounded-2xl"
            onClick={() => setHistoryOpen(true)}
          >
            View Workout History
          </Button>
        </DrawerTrigger>

        <DrawerContent className="bg-background flex h-[90vh] p-4">
          <DrawerHeader className="flex flex-col items-center">
            <DrawerTitle>Workout History</DrawerTitle>
            <DrawerDescription>Your previous sessions</DrawerDescription>
            <Separator className="bg-primary mt-2 w-full rounded-2xl p-[2px]" />
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto">
            <ScrollArea className="h-full w-full space-y-4 pr-2">
              {isLoading ? (
                <div className="text-muted-foreground text-sm">
                  Loading workout history...
                </div>
              ) : workouts.length === 0 ? (
                <div className="text-muted-foreground text-sm">
                  No workouts yet.
                </div>
              ) : (
                workouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="border-muted bg-muted/10 rounded-xl border p-4 shadow-sm"
                  >
                    <div className="text-primary mb-2 flex items-center justify-between border-b pb-1 text-sm font-semibold">
                      <span>
                        {new Date(workout.createdAt).toLocaleDateString()}
                      </span>
                      <span>{formatDuration(workout.duration)}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {workout.exercises.map((we) => (
                        <div
                          key={we.id}
                          className="bg-background/70 rounded-md p-3 shadow"
                        >
                          <h4 className="text-md text-foreground font-semibold">
                            {we.exercise.name}
                          </h4>
                          <ul className="text-muted-foreground mt-1 ml-4 list-disc text-sm">
                            {we.sets.map((set, idx) => (
                              <li key={set.id}>
                                Set {idx + 1}: {set.reps} × {set.kg}kg
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
