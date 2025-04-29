import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import type { SetRow } from "@/utils/types";
import type { ExerciseProps } from "@/utils/types";

interface Props {
  exercise: ExerciseProps;
  updateExerciseSets: (exerciseId: string, sets: SetRow[]) => void;
  removeExercise: (exerciseId: string) => void;
}

export default function ExerciseLogCard({
  exercise,
  updateExerciseSets,
  removeExercise,
}: Props) {
  const [sets, setSets] = useState<SetRow[]>([
    { kg: 0, reps: 0, confirmed: false },
  ]);

  const updateSet = (
    index: number,
    key: keyof Omit<SetRow, "confirmed">,
    value: string,
  ) => {
    const updated = [...sets];
    if (updated[index]) {
      updated[index] = {
        ...updated[index],
        [key]: Number(value),
      };
      setSets(updated);
    }
  };

  const toggleConfirm = (index: number) => {
    const updated = [...sets];
    if (updated[index]) {
      updated[index].confirmed = !updated[index].confirmed;
      setSets(updated);
    }
  };

  const addSet = () => {
    const updated = [...sets, { kg: 0, reps: 0, confirmed: false }];
    setSets(updated);
  };

  useEffect(() => {
    updateExerciseSets(exercise.id, sets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sets]);

  return (
    <div className="bg-muted/10 relative w-full max-w-md space-y-4 rounded-xl p-4 shadow">
      {/* Remove button */}
      <button
        onClick={() => removeExercise(exercise.id)}
        className="bg-muted-foreground/20 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground absolute top-2 right-2 rounded-full p-1 transition"
      >
        <X size={16} />
      </button>

      {/* Exercise Header */}
      <div className="flex items-center gap-4">
        {exercise.iconUrl ? (
          <Image
            src={exercise.iconUrl}
            alt={exercise.name}
            width={40}
            height={40}
            className="bg-primary rounded-2xl"
          />
        ) : (
          <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-lg text-xs">
            N/A
          </div>
        )}
        <h3 className="text-foreground text-lg font-semibold">
          {exercise.name}
        </h3>
      </div>

      {/* Sets header */}
      <div className="text-muted-foreground mb-2 grid grid-cols-4 text-xs font-semibold uppercase">
        <span>Set</span>
        <span className="text-center">+kg</span>
        <span className="text-center">Reps</span>
        <span className="text-end"></span>
      </div>

      {/* Sets */}
      {sets.map((set, index) => (
        <div
          key={index}
          className={`mb-2 grid grid-cols-4 items-center gap-2 rounded-xl p-2 ${
            set.confirmed ? "bg-primary/20" : "bg-muted"
          }`}
        >
          <span className="text-foreground text-center font-semibold">
            {index + 1}
          </span>
          <Input
            type="number"
            className="bg-background text-foreground w-full rounded-xl text-center"
            value={set.kg}
            placeholder="-"
            onChange={(e) => updateSet(index, "kg", e.target.value)}
          />
          <Input
            type="number"
            className="bg-background text-foreground w-full rounded-xl text-center"
            value={set.reps}
            placeholder="-"
            onChange={(e) => updateSet(index, "reps", e.target.value)}
          />
          <button
            className={`ml-auto flex h-8 w-8 items-center justify-center rounded-full transition ${
              set.confirmed
                ? "bg-primary text-background"
                : "bg-muted-foreground/20 text-muted-foreground"
            }`}
            onClick={() => toggleConfirm(index)}
          >
            <Check size={16} />
          </button>
        </div>
      ))}

      {/* Add Set Button */}
      <Button
        variant="outline"
        className="mt-2 w-full rounded-2xl text-sm"
        onClick={addSet}
      >
        + Add Set
      </Button>
    </div>
  );
}
