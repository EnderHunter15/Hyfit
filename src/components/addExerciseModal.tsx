import { useState } from "react";
import { api } from "@/trpc/react";

export default function AddExerciseModal({
  onSelect,
}: {
  onSelect: (ex: any) => void;
}) {
  const { data: exercises = [], isLoading } =
    api.exercise.getAllExercises.useQuery();
  const [search, setSearch] = useState("");

  const filtered = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mt-4 flex flex-col gap-3 overflow-y-auto">
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground">No exercises found.</p>
      ) : (
        filtered.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => onSelect(exercise)}
            className="bg-muted/30 hover:bg-muted/50 flex items-center justify-start gap-4 rounded-xl p-3 transition"
          >
            {exercise.iconUrl ? (
              <img
                src={exercise.iconUrl}
                alt={exercise.name}
                className="bg-primary h-10 w-10 rounded-2xl object-contain"
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
          </button>
        ))
      )}
    </div>
  );
}
