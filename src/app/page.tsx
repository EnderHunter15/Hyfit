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
  if (ratio > 0.8) return "bg-red-600";
  if (ratio > 0.6) return "bg-orange-500";
  if (ratio > 0.4) return "bg-yellow-400";
  if (ratio > 0.2) return "bg-green-400";
  return "bg-gray-300";
};

export default function HomePage() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const { data: heatmap, isLoading } = api.heatmap.getMuscleHeatmap.useQuery({
    userId,
  });

  if (isLoading) {
    return <div className="p-6 text-gray-600">Loading heatmap...</div>;
  }

  if (!heatmap || Object.keys(heatmap).length === 0) {
    return (
      <div className="text-primary p-6 text-center text-lg font-semibold">
        No workout data found. 😅 Start training to see your muscle heatmap!
      </div>
    );
  }

  const typedHeatmap = heatmap;
  const maxVolume = Math.max(...Object.values(typedHeatmap));

  return (
    <main className="bg-primary-foreground min-h-screen p-6">
      <h1 className="mb-6 text-2xl font-bold">
        👋 Welcome back, {user?.username}!
      </h1>
      <Separator className="bg-primary mb-6 rounded-2xl p-0.5" />
      <section>
        <div className="mb-3 flex justify-between text-xl font-semibold">
          💪 Muscle Activity Heatmap
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Info className="size-8" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Color represents muscle intensity total training volume
                  (weight × reps):
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="">
                    🔴 Very High — Most trained muscle <br /> 🟠 High — Heavily
                    trained
                    <br /> 🟡 Medium — Moderate effort <br /> 🟢 Low — Lightly
                    trained <br /> ⚪️ Inactive — Not recently trained
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant={"destructive"}>X</Button>
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

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
      </section>
    </main>
  );
}
