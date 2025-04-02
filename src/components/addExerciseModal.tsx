import { useState } from "react";
import { api } from "@/trpc/react";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { Button } from "./ui/button";
import type { WorkoutExercise } from "@/utils/types";
import WorkoutLoading from "@/app/workout/workoutLoading";
import { redirect } from "next/navigation";

export default function AddExerciseModal() {
  const { data: exercises = [], isLoading } =
    api.exercise.getAllExercises.useQuery();
  const [search, setSearch] = useState("");
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>(
    [],
  );
  const filtered = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div>
        <Input
          className="text-primary w-full rounded-3xl p-4"
          placeholder="Search exercise"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Separator className="bg-primary mt-2 rounded-2xl p-[2px]" />
      </div>
      <div className="mt-4 flex flex-col gap-3 overflow-y-auto">
        {isLoading ? (
          <WorkoutLoading />
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground">No exercises found.</p>
        ) : (
          filtered.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-muted/30 hover:bg-muted/50 flex items-center justify-start gap-4 rounded-xl p-3 transition"
            >
              {exercise.iconUrl ? (
                <Image
                  src={exercise.iconUrl}
                  alt={exercise.name}
                  width={64}
                  height={64}
                  className="bg-primary h-10 w-10 rounded-2xl"
                />
              ) : (
                <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-lg text-xs">
                  N/A
                </div>
              )}
              <div className="text-left">
                <p className="text-foreground text-sm font-medium">
                  {exercise.name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {exercise.muscleGroup}
                </p>
              </div>
              <Button
                className="ml-auto rounded-2xl"
                onClick={() => {
                  if (!workoutExercises.some((ex) => ex.id === exercise.id)) {
                    setWorkoutExercises((prev) => [
                      ...prev,
                      {
                        id: exercise.id,
                        name: exercise.name,
                        muscles: exercise.muscleGroup,
                        iconUrl: exercise.iconUrl ?? undefined,
                      },
                    ]);
                  }
                  redirect("/workout");
                }}
              >
                Add to workout
              </Button>
            </div>
          ))
        )}
      </div>
    </>
  );
}
