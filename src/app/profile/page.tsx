"use client";

import { Flame, Dumbbell, BarChart3, BicepsFlexed, Clock } from "lucide-react";
import { api } from "@/trpc/react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ProfileStatsLoading from "./profileStatsLoading";
import { Button } from "@/components/ui/button";

export default function ProfileStats() {
  const { data: stats } = api.workout.getStats.useQuery();
  const { user } = useUser();

  const { streak, totalKg, totalReps, mostWorked, totalDuration } = stats ?? {};
  if (stats === undefined) {
    return <ProfileStatsLoading />;
  }

  return (
    <div className="flex h-screen w-full flex-col gap-4 overflow-y-auto p-4 pb-28">
      {/* Profile Info */}
      <div className="bg-background flex items-center justify-between rounded-3xl p-4">
        <h1 className="text-foreground text-lg font-bold">
          Your Profile, {user?.username}{" "}
        </h1>
        <Button asChild variant={"destructive"} className="rounded-3xl">
          <SignOutButton>Sign Out</SignOutButton>
        </Button>
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

      {/* Total Time */}
      <Card className="rounded-3xl">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-muted-foreground text-sm">
              Total Time Spent Training
            </p>
            <h2 className="text-primary text-2xl font-semibold">
              {totalDuration}
            </h2>
          </div>
          <Clock className="text-primary h-6 w-6" />
        </CardContent>
      </Card>
    </div>
  );
}
