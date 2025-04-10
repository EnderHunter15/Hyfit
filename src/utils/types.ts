import type { LucideIcon } from "lucide-react";
import { Home, Dumbbell, Utensils, SquareUserRound } from "lucide-react";
type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const links: NavLink[] = [
  { href: "/", label: "home", icon: Home },
  { href: "/workout", label: "workout", icon: Dumbbell },
  { href: "diet", label: "diet", icon: Utensils },
  { href: "profile", label: "profile", icon: SquareUserRound },
];

export type WorkoutExercise = {
  id: string;
  name: string;
  muscles: string;
  iconUrl?: string;
  sets: SetRow[];
};

export type SetRow = {
  kg: number;
  reps: number;
  confirmed: boolean;
};

export type ExerciseProps = {
  id: string;
  name: string;
  iconUrl?: string;
};
