"use client";

import { useState, useMemo, useEffect, Fragment } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar";
import NutritionixSearchContent from "@/components/nutritionixSearchContent";
import { api } from "@/trpc/react";
import { Settings2, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import dayjs from "dayjs";
import type { AddedFood, FoodItem } from "@/utils/types";

export default function DietPage() {
  const [addedFoods, setAddedFoods] = useState<FoodItem[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const todayFoods = api.food.getTodayFoods.useQuery();
  const allFoods = api.food.getAllFoods.useQuery();
  const dates = api.food.getAllDates.useQuery();

  const addFoodMutation = api.food.addFood.useMutation({
    onSuccess: () => {
      void todayFoods.refetch();
      void allFoods.refetch();
      void dates.refetch();
    },
  });

  const {
    data: goals,
    isLoading,
    isError,
    refetch,
  } = api.nutritionGoals.get.useQuery();

  const updateGoals = api.nutritionGoals.update.useMutation({
    onSuccess: () => {
      void refetch();
      setSettingsOpen(false);
    },
  });

  const [formGoals, setFormGoals] = useState({
    calories: 2000,
    protein: 100,
    carbs: 250,
    fat: 70,
  });

  useEffect(() => {
    if (goals) setFormGoals(goals);
  }, [goals]);

  useEffect(() => {
    if (todayFoods.data) {
      setAddedFoods(
        todayFoods.data.map((item) => ({
          ...item,
          calories: item.kcal,
          grams: item.quantity,
        })),
      );
    }
  }, [todayFoods.data]);

  const handleAddFood = async (food: AddedFood) => {
    const result = await addFoodMutation.mutateAsync({
      name: food.name,
      kcal: Math.round(food.calories),
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      quantity: food.grams,
    });

    setAddedFoods((prev) => [
      ...prev,
      {
        ...result,
        calories: result.kcal,
        grams: result.quantity,
      } as FoodItem,
    ]);
  };

  const totals = useMemo(() => {
    return addedFoods.reduce(
      (acc, food) => {
        acc.calories += food.kcal ?? food.calories ?? 0;
        acc.carbs += food.carbs ?? 0;
        acc.protein += food.protein ?? 0;
        acc.fat += food.fat ?? 0;
        return acc;
      },
      { calories: 0, carbs: 0, protein: 0, fat: 0 },
    );
  }, [addedFoods]);

  if (isLoading) return <div className="p-4 text-white">Loading goals...</div>;
  if (isError || !goals)
    return (
      <div className="p-4 text-red-500">Failed to load nutrition goals</div>
    );

  const percentCalories = (totals.calories / goals.calories) * 100;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-start p-4 pt-8">
      {/* Header */}
      <div className="mb-2 flex w-full items-center justify-between gap-2">
        <h1 className="text-primary p-2 text-2xl">Your Diet</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setHistoryOpen(true)}
          >
            <History className="h-5 w-5" />
          </Button>
          <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings2 className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="h-[50vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-center">
                  Edit Nutrition Goals
                </SheetTitle>
                <SheetDescription className="text-center">
                  Customize your daily targets.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 flex flex-col gap-4">
                {["calories", "protein", "carbs", "fat"].map((key) => (
                  <div key={key} className="flex flex-col">
                    <label className="text-sm text-white capitalize">
                      {key}
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={formGoals[key as keyof typeof formGoals] || ""}
                      onChange={(e) =>
                        setFormGoals((prev) => ({
                          ...prev,
                          [key]: Number(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                ))}
                <Button
                  onClick={() => updateGoals.mutate(formGoals)}
                  className="mt-4"
                >
                  Save
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Separator className="bg-primary w-full rounded-2xl p-1" />

      {/* Calorie + Macro Summary */}
      <div className="bg-secondary mt-2 w-full rounded-2xl p-4">
        <div className="flex items-center justify-between px-4">
          <div className="text-center text-white">
            <p className="text-xl font-semibold">
              {Math.round(totals.calories)}
            </p>
            <p className="text-muted-foreground text-xs">Eaten</p>
          </div>
          <div className="relative flex h-24 w-24 items-center justify-center">
            <AnimatedCircularProgressBar
              value={Math.min(percentCalories, 100)}
              min={0}
              max={100}
              gaugePrimaryColor="blue"
              gaugeSecondaryColor="bg-muted-foreground"
            />
            <p className="absolute text-lg font-bold text-white">
              {Math.round(percentCalories)}%
            </p>
          </div>
          <div className="text-center text-white">
            <p className="text-xl font-semibold">
              {Math.max(0, Math.round(goals.calories - totals.calories))}
            </p>
            <p className="text-muted-foreground text-xs">Remaining</p>
          </div>
        </div>

        <Separator className="bg-primary my-4 h-[1px]" />

        <div className="flex flex-col gap-4 text-white">
          {[
            { label: "Carbs", value: totals.carbs, target: goals.carbs },
            { label: "Protein", value: totals.protein, target: goals.protein },
            { label: "Fat", value: totals.fat, target: goals.fat },
          ].map((macro, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span>{macro.label}</span>
                <span>
                  {Math.round(macro.value)} / {macro.target} g
                </span>
              </div>
              <Progress
                value={Math.min((macro.value / macro.target) * 100, 100)}
                className="h-2 bg-gray-500"
              />
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-primary mt-2 w-full rounded-2xl p-1" />

      {/* Add Food Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button className="fixed bottom-24 left-1/2 z-10 -translate-x-1/2 rounded-full px-6 py-3 shadow-xl">
            Add Food
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-center">Add Food</SheetTitle>
          </SheetHeader>
          <NutritionixSearchContent onAddFood={handleAddFood} />
        </SheetContent>
      </Sheet>

      {/* Added Foods */}
      {addedFoods.length > 0 && (
        <div className="mt-4 w-full space-y-2 pb-36">
          <h2 className="text-center text-lg font-bold text-white">
            Added Foods
          </h2>
          {addedFoods.map((food, idx) => (
            <div
              key={idx}
              className="bg-muted relative rounded-lg border border-blue-600 p-3 text-sm text-white"
            >
              <p className="font-semibold capitalize">{food.name}</p>
              <p className="text-muted-foreground text-xs">
                {food.quantity}g | {food.kcal} kcal | {food.protein.toFixed(1)}g
                protein | {food.carbs.toFixed(1)}g carbs | {food.fat.toFixed(1)}
                g fat
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Food History Drawer */}
      <Sheet
        open={historyOpen}
        onOpenChange={(open) => {
          setHistoryOpen(open);
          if (open) {
            void allFoods.refetch();
            void dates.refetch();
          }
        }}
      >
        <SheetContent side="bottom" className="h-[80vh] p-0">
          <div className="h-full overflow-y-auto px-4 pt-4 pb-8">
            <SheetHeader>
              <SheetTitle className="text-center">Food History</SheetTitle>
              <SheetDescription className="text-center">
                View your past food logs with daily summaries.
              </SheetDescription>
            </SheetHeader>

            <div className="mt-4 flex flex-col gap-6">
              {dates.data?.map((dateStr) => {
                const foods =
                  allFoods.data?.filter((f) =>
                    dateStr ? f.date.toISOString().startsWith(dateStr) : false,
                  ) ?? [];

                if (foods.length === 0) return null;

                const totals = foods.reduce(
                  (acc, food) => {
                    acc.kcal += food.kcal ?? 0;
                    acc.protein += food.protein ?? 0;
                    acc.carbs += food.carbs ?? 0;
                    acc.fat += food.fat ?? 0;
                    return acc;
                  },
                  { kcal: 0, protein: 0, carbs: 0, fat: 0 },
                );

                return (
                  <Fragment key={dateStr}>
                    <div className="bg-background border-border rounded-xl border p-4">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-md font-bold text-white">
                          {dayjs(dateStr).format("DD/MM/YYYY")}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Calories: {totals.kcal} | Carbs:{" "}
                          {Math.round(totals.carbs)}g | Protein:{" "}
                          {Math.round(totals.protein)}g | Fat:{" "}
                          {Math.round(totals.fat)}g
                        </p>
                      </div>

                      <div className="mt-3 space-y-2">
                        {foods.map((food) => (
                          <div
                            key={food.id}
                            className="bg-muted rounded-lg border border-blue-600 p-3 text-sm text-white"
                          >
                            <p className="font-semibold capitalize">
                              {food.name}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {food.quantity}g | {food.kcal} kcal |{" "}
                              {food.protein.toFixed(1)}g protein |{" "}
                              {food.carbs.toFixed(1)}g carbs |{" "}
                              {food.fat.toFixed(1)}g fat
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator className="bg-border mt-4" />
                  </Fragment>
                );
              })}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
