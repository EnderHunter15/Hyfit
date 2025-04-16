"use client";

import { Flame, Dumbbell, BarChart3, BicepsFlexed } from "lucide-react";
import { api } from "@/trpc/react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ProfileStatsLoading from "./profileStatsLoading";

export default function ProfileStats() {
  const { data: stats } = api.workout.getStats.useQuery();

  const { streak, totalKg, totalReps, mostWorked } = stats ?? {};
  if (stats === undefined) {
    return <ProfileStatsLoading />;
  }

  return (
    <div className="flex h-screen w-full flex-col gap-4 overflow-y-auto p-4 pb-28">
      {/* Profile Info */}
      <div className="flex justify-center">
        <div>
          <h1 className="text-foreground text-lg font-bold">Your Profile</h1>
        </div>
      </div>
      <Separator className="bg-primary rounded-2xl p-1" />
      {/* Streak */}
      <Card className="rounded-3xl">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-muted-foreground text-sm">Current Streak</p>
            <div className="flex flex-row">
              {streak === 0 ? (
                <p>You currently have no streak 😭</p>
              ) : (
                <h2 className="text-primary text-2xl font-bold">
                  🔥 {streak} day{streak !== 1 ? "s" : ""}
                </h2>
              )}
            </div>
          </div>
          <Flame className="text-primary h-6 w-6" />
        </CardContent>
      </Card>

      {/* Total Weight Lifted */}
      <Card className="rounded-3xl">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-muted-foreground text-sm">Total Weight Lifted</p>
            <h2 className="text-primary text-2xl font-semibold">
              {totalKg} kgs
            </h2>
          </div>
          <Dumbbell className="text-primary h-6 w-6" />
        </CardContent>
      </Card>

      {/* Total Reps */}
      <Card className="rounded-3xl">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-muted-foreground text-sm">Total Reps</p>
            <h2 className="text-primary text-2xl font-semibold">{totalReps}</h2>
          </div>
          <BarChart3 className="text-primary h-6 w-6" />
        </CardContent>
      </Card>

      {/* Most Trained Muscle Group */}
      <Card className="rounded-3xl">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-muted-foreground text-sm">Most Worked Muscle</p>
            <h2 className="text-primary text-2xl font-semibold">
              {mostWorked}
            </h2>
          </div>
          <BicepsFlexed className="text-primary h-6 w-6" />
        </CardContent>
      </Card>

      {/* Weekly Tracker */}
      <Card className="rounded-3xl">
        <CardContent className="p-4">
          <p className="text-muted-foreground mb-2 text-sm">Weekly Activity</p>
          <div className="grid grid-cols-7 gap-2">RENDER DAYS</div>
          <p className="text-muted-foreground mt-2 text-xs italic">
            Tap a skipped day to mark it as a rest day.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
