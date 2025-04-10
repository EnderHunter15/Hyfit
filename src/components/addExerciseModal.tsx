import { useState } from "react";
import { api } from "@/trpc/react";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { Button } from "./ui/button";
import WorkoutLoading from "@/app/workout/workoutLoading";
import { ScrollArea } from "./ui/scroll-area";
import { useWorkoutContext } from "@/context/workoutContext";

export default function AddExerciseModal({
  setSheetOpen,
}: {
  setSheetOpen: (open: boolean) => void;
}) {
  const { addExercise } = useWorkoutContext();
  const { data: exercises = [], isLoading } =
    api.exercise.getAllExercises.useQuery();
  const [search, setSearch] = useState("");
  const filtered = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="flex flex-col items-center">
        <Input
          className="text-primary w-2/3 rounded-3xl p-4"
          placeholder="Search exercise"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Separator className="bg-primary mt-2 rounded-2xl p-[2px]" />
      </div>
      <ScrollArea className="h-[90vh] w-screen rounded-md border border-none p-4">
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
                    addExercise({
                      id: exercise.id,
                      name: exercise.name,
                      muscles: exercise.muscleGroup ?? "",
                      iconUrl: exercise.iconUrl ?? undefined,
                      sets: [],
                    });
                    setSheetOpen(false);
                  }}
                >
                  Add to workout
                </Button>
              </div>
            ))
          )}
          <Separator className="bg-primary mt-2 rounded-2xl p-[2px]" />
        </div>
      </ScrollArea>
    </>
  );
}
