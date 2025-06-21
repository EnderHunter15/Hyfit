"use client";

import AddExerciseModal from "@/components/addExerciseModal";
import ExerciseLogCard from "@/components/exerciseLogCard";
import WorkoutTimer from "@/components/workoutTimer";
import TemplateEditorModal from "@/components/templateEditorModal";
import { useWorkoutContext } from "@/context/workoutContext";
import { api } from "@/trpc/react";
import type { SetRow, WorkoutExercise } from "@/utils/types";

import { useUser } from "@clerk/nextjs";
import { Send, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@radix-ui/react-separator";

export default function WorkoutPage() {
  const { workoutExercises, setWorkoutExercises, clearWorkout } =
    useWorkoutContext();
  const [open, setOpen] = useState(false);
  const [workoutFinished, setWorkoutFinished] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [templateSheetOpen, setTemplateSheetOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);

  const { user } = useUser();

  const utils = api.useUtils(); // ✅ Added to manually trigger refetch

  const { data: workouts = [], isLoading } = api.workout.getAllForUser.useQuery(
    {
      userId: user?.id ?? "",
    },
  );

  const { data: templates = [] } = api.workoutTemplate.getTemplates.useQuery();

  const createWorkout = api.workout.createWorkout.useMutation();

  const updateExerciseSets = (exerciseId: string, sets: SetRow[]) => {
    setWorkoutExercises((prev) =>
      prev.map((ex) => (ex.id === exerciseId ? { ...ex, sets } : ex)),
    );
  };

  const removeExercise = (exerciseId: string) => {
    setWorkoutExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
  };

  const loadTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    const newExercises: WorkoutExercise[] = template.exercises.map((te) => ({
      id: te.exercise.id,
      name: te.exercise.name,
      iconUrl: te.exercise.iconUrl ?? undefined,
      muscles: "",
      sets: [{ kg: "", reps: "", confirmed: false }],
    }));

    setWorkoutExercises(newExercises);
    setOpen(true);
    setTemplateSheetOpen(false);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return hrs > 0 ? `${hrs}h ${remainingMins}m` : `${mins} min`;
  };

  return (
    <div className="bg-background flex min-h-screen w-full flex-col items-center p-6">
      {/* START EMPTY WORKOUT */}
      <Drawer
        open={open}
        onOpenChange={(state) =>
          !state && !workoutFinished ? null : setOpen(state)
        }
      >
        <DrawerTrigger asChild>
          <Button className="w-3/4 rounded-2xl">Start empty workout</Button>
        </DrawerTrigger>
        <DrawerContent className="bg-background flex h-[90vh] p-4">
          <DrawerHeader className="flex flex-col items-center">
            <DrawerTitle>Current Session</DrawerTitle>
            <DrawerDescription>Add exercises to your workout</DrawerDescription>
            <WorkoutTimer seconds={seconds} setSeconds={setSeconds} />
            <Separator className="bg-primary mt-2 w-full rounded-2xl p-[2px]" />
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
              className="rounded-2xl"
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
                      clearWorkout();
                      setSeconds(0);
                      setOpen(false);
                      setWorkoutFinished(true);

                      void utils.workout.getAllForUser.invalidate();
                    },
                    onError: (error) =>
                      console.error("💥 Workout create error:", error),
                  },
                );
              }}
            >
              Complete workout <Send />
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* START PREDEFINED WORKOUT */}
      <Sheet open={templateSheetOpen} onOpenChange={setTemplateSheetOpen}>
        <SheetTrigger asChild>
          <Button className="mt-4 w-3/4 rounded-2xl">
            Start predefined workout
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[100vh] p-4">
          <SheetHeader>
            <SheetTitle>Select a workout template</SheetTitle>
          </SheetHeader>

          <div className="mt-4 flex flex-col gap-2">
            {templates.length === 0 ? (
              <p className="text-muted-foreground text-center text-sm">
                No templates yet. Create one below!
              </p>
            ) : (
              templates.map((template) => (
                <Button
                  key={template.id}
                  variant="outline"
                  onClick={() => loadTemplate(template.id)}
                >
                  {template.name}
                </Button>
              ))
            )}
            <Button
              variant="secondary"
              onClick={() => {
                setTemplateSheetOpen(false);
                setTemplateModalOpen(true);
              }}
              className="mt-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* WORKOUT HISTORY */}
      <Drawer open={historyOpen} onOpenChange={setHistoryOpen}>
        <DrawerTrigger asChild>
          <Button className="mt-4 w-3/4 rounded-2xl">
            View workout history
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

      {/* TEMPLATE EDITOR MODAL */}
      <TemplateEditorModal
        open={templateModalOpen}
        onClose={() => {
          setTemplateModalOpen(false);
          void utils.workoutTemplate.getTemplates.invalidate();
        }}
      />
    </div>
  );
}
