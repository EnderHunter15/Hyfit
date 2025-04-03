"use client";

import { createContext, useContext, useState } from "react";
import type { WorkoutExercise } from "@/utils/types";

type WorkoutContextType = {
  workoutExercises: WorkoutExercise[];
  addExercise: (exercise: WorkoutExercise) => void;
  setWorkoutExercises: React.Dispatch<React.SetStateAction<WorkoutExercise[]>>;
};

const WorkoutContext = createContext<WorkoutContextType | null>(null);

export const WorkoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>(
    [],
  );

  const addExercise = (exercise: WorkoutExercise) => {
    setWorkoutExercises((prev) =>
      prev.some((ex) => ex.id === exercise.id) ? prev : [...prev, exercise],
    );
  };

  return (
    <WorkoutContext.Provider
      value={{ workoutExercises, addExercise, setWorkoutExercises }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutContext = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkoutContext must be used within a WorkoutProvider");
  }
  return context;
};
