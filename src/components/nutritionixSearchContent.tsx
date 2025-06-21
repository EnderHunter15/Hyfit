"use client";

import type {
  NutritionixFood,
  AddedFood,
  NutritionixSearchResponse,
  NutritionixDetailResponse,
} from "@/utils/types";
import { useEffect, useState, useCallback } from "react";

const APP_ID = process.env.NEXT_PUBLIC_NUTRITIONIX_APP_ID!;
const APP_KEY = process.env.NEXT_PUBLIC_NUTRITIONIX_APP_KEY!;

export default function NutritionixSearchContent({
  onAddFood,
}: {
  onAddFood: (food: AddedFood) => Promise<void>;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NutritionixFood[]>([]);
  const [gramsMap, setGramsMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  const search = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(
        "https://trackapi.nutritionix.com/v2/search/instant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-app-id": APP_ID,
            "x-app-key": APP_KEY,
          },
          body: JSON.stringify({ query }),
        },
      );

      const data = (await res.json()) as NutritionixSearchResponse;
      const commonFoods = data.common.slice(0, 5);

      const detailedFoods = await Promise.all(
        commonFoods.map(async (food): Promise<NutritionixFood | null> => {
          const detailRes = await fetch(
            "https://trackapi.nutritionix.com/v2/natural/nutrients",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-app-id": APP_ID,
                "x-app-key": APP_KEY,
              },
              body: JSON.stringify({ query: `100g ${food.food_name}` }),
            },
          );

          const detailData =
            (await detailRes.json()) as NutritionixDetailResponse;
          return detailData.foods?.[0] ?? null;
        }),
      );

      setResults(detailedFoods.filter((f): f is NutritionixFood => Boolean(f)));
    } catch (err) {
      console.error("❌ Nutritionix fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void search(); // ✅ prevents eslint warning for floating promise
    }, 400);
    return () => clearTimeout(timeout);
  }, [query, search]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex gap-2">
        <input
          className="bg-background w-full rounded-md border px-3 py-2 text-sm text-white"
          placeholder="Search food (e.g. chicken breast)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setGramsMap({});
          }}
        />
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        {loading && <p className="text-sm text-white">Searching...</p>}

        {results.map((food, i) => {
          const gramsRaw = gramsMap[i] ?? "100";
          const grams = Number(gramsRaw);
          const ratio = grams > 0 ? grams / 100 : 0;

          const calculated = {
            calories: (food.nf_calories ?? 0) * ratio,
            protein: (food.nf_protein ?? 0) * ratio,
            fat: (food.nf_total_fat ?? 0) * ratio,
            carbs: (food.nf_total_carbohydrate ?? 0) * ratio,
          };

          return (
            <div
              key={i}
              className="bg-muted rounded border border-blue-600 p-3 text-sm text-white"
            >
              <p className="font-semibold capitalize">{food.food_name}</p>

              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={gramsRaw}
                  onChange={(e) =>
                    setGramsMap((prev) => ({
                      ...prev,
                      [i]: e.target.value,
                    }))
                  }
                  className="bg-background w-20 rounded border p-1 text-xs text-white"
                />
                <span className="text-xs">grams</span>
              </div>

              <p className="mt-2 text-xs">
                {Math.round(calculated.calories)} kcal |{" "}
                {calculated.protein.toFixed(1)}g protein |{" "}
                {calculated.carbs.toFixed(1)}g carbs |{" "}
                {calculated.fat.toFixed(1)}g fat
              </p>

              <button
                className="mt-2 rounded bg-blue-600 px-3 py-1 text-xs"
                onClick={() =>
                  void onAddFood({
                    name: food.food_name,
                    calories: Math.round(calculated.calories),
                    protein: calculated.protein,
                    carbs: calculated.carbs,
                    fat: calculated.fat,
                    grams: grams,
                  })
                }
              >
                Add
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
