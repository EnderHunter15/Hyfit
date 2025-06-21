import type { LucideIcon } from "lucide-react";
import {
  Home,
  Dumbbell,
  Utensils,
  SquareUserRound,
  MessageCircle,
} from "lucide-react";
import type { ReactNode } from "react";
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
  { href: "chat", label: "chat", icon: MessageCircle },
];

export type WorkoutExercise = {
  id: string;
  name: string;
  muscles: string;
  iconUrl?: string;
  sets: SetRow[];
};

export type SetRow = {
  kg: string | number;
  reps: string | number;
  confirmed: boolean;
};

export type ExerciseProps = {
  id: string;
  name: string;
  iconUrl?: string;
};

export type FoodItem = {
  kcal: number;
  quantity: ReactNode;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  grams: number;
};

export type NutritionixFood = {
  food_name: string;
  nf_calories?: number;
  nf_protein?: number;
  nf_total_fat?: number;
  nf_total_carbohydrate?: number;
};

export type OpenRouterResponse = {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
};

export type AddedFood = {
  name: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type NutritionixSearchResponse = {
  common: { food_name: string }[];
};

export type NutritionixDetailResponse = {
  foods?: NutritionixFood[];
};
