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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Info } from "lucide-react";
import React from "react";

export default function homeLoading() {
  return (
    <main className="bg-primary-foreground min-h-screen p-6">
      <h1 className="text-primary mb-6 text-2xl font-bold">👋 Welcome back!</h1>
      <Separator className="bg-primary mb-6 rounded-2xl p-0.5" />

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
                Color represents muscle intensity total training volume (weight
                × reps) in the last 7 days:
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
                    <span className="font-semibold text-orange-400">High</span>{" "}
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
                    🟢 <span className="font-semibold text-green-400">Low</span>{" "}
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
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        <Skeleton className="h-24 w-full rounded-3xl" />
        <Skeleton className="h-24 w-full rounded-3xl" />
        <Skeleton className="h-24 w-full rounded-3xl" />
        <Skeleton className="h-24 w-full rounded-3xl" />
        <Skeleton className="h-24 w-full rounded-3xl" />
        <Skeleton className="h-24 w-full rounded-3xl" />
        <Skeleton className="h-24 w-full rounded-3xl" />
        <Skeleton className="h-24 w-full rounded-3xl" />
        <Skeleton className="h-24 w-full rounded-3xl" />
        <Skeleton className="h-24 w-full rounded-3xl" />
        <Skeleton className="h-24 w-full rounded-3xl" />
        <Skeleton className="h-24 w-full rounded-3xl" />
      </div>
    </main>
  );
}
