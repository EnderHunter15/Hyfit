"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const getColor = (volume: number, max: number): string => {
  const ratio = volume / max;

  if (volume > 0 && ratio <= 0.2) return "bg-[#4caf50]";
  if (ratio > 0.8) return "bg-[#b22222]";
  if (ratio > 0.6) return "bg-[#cc6600]";
  if (ratio > 0.4) return "bg-[#d4af37]";
  if (ratio > 0.2) return "bg-[#4caf50]";
  return "bg-[#555555]";
};

export default function HomePage() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const { data: heatmap, isLoading } = api.heatmap.getMuscleHeatmap.useQuery({
    userId,
    days: 7,
  });

  const hasData = heatmap && Object.keys(heatmap).length > 0;
  const typedHeatmap = heatmap ?? {};
  const maxVolume = hasData ? Math.max(...Object.values(typedHeatmap)) : 0;

  if (isLoading) {
    return <div className="p-6 text-gray-600">Loading heatmap...</div>;
  }

  return (
    <main className="bg-primary-foreground min-h-screen p-6">
      <h1 className="text-primary mb-6 text-2xl font-bold">
        👋 Welcome back, {user?.username}!
      </h1>
      <Separator className="bg-primary mb-6 rounded-2xl p-0.5" />

      <section>
        <div className="text-primary mb-3 flex items-center justify-between text-xl font-semibold">
          💪 Muscle Activity Heatmap
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button>
                <Info className="text-primary size-6" />
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-background border-primary rounded-2xl border shadow-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-primary relative">
                  Color represents muscle intensity total training volume
                  (weight × reps) in the last 7 days:
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="mt-2 space-y-1 text-sm">
                    <div>
                      🔴{" "}
                      <span className="font-semibold text-red-400">
                        Very High
                      </span>{" "}
                      — Most trained muscle
                    </div>
                    <div>
                      🟠{" "}
                      <span className="font-semibold text-orange-400">
                        High
                      </span>{" "}
                      — Heavily trained
                    </div>
                    <div>
                      🟡{" "}
                      <span className="font-semibold text-yellow-300">
                        Medium
                      </span>{" "}
                      — Moderate effort
                    </div>
                    <div>
                      🟢{" "}
                      <span className="font-semibold text-green-400">Low</span>{" "}
                      — Lightly trained
                    </div>
                    <div>
                      ⚪️{" "}
                      <span className="font-semibold text-gray-300">
                        Inactive
                      </span>{" "}
                      — Not recently trained
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex items-center">
                <AlertDialogCancel asChild>
                  <Button
                    variant="destructive"
                    className="text-primary absolute top-1 right-1 w-1 rounded-2xl border-none"
                  >
                    X
                  </Button>
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {hasData ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {Object.entries(typedHeatmap).map(([muscle, volume]) => {
              const color = getColor(volume, maxVolume);
              return (
                <div
                  key={muscle}
                  className={`rounded-2xl p-4 text-center text-xl font-medium text-black shadow transition-all ${color}`}
                >
                  <div className="uppercase">{muscle}</div>
                  <div className="mt-1 font-mono text-xs">{volume} kg·reps</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-primary mt-6 text-center text-lg font-semibold">
            No workout data found. 😅 Start training to see your muscle heatmap!
          </div>
        )}
      </section>
    </main>
  );
}
