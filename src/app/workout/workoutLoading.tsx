import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function WorkoutLoading() {
  return (
    <div className="flex flex-col space-y-4">
      <Skeleton className="h-[64px] w-[367px] rounded-xl" />
      <Skeleton className="h-[64px] w-[367px] rounded-xl" />
      <Skeleton className="h-[64px] w-[367px] rounded-xl" />
      <Skeleton className="h-[64px] w-[367px] rounded-xl" />
      <Skeleton className="h-[64px] w-[367px] rounded-xl" />
      <Skeleton className="h-[64px] w-[367px] rounded-xl" />
      <Skeleton className="h-[64px] w-[367px] rounded-xl" />
      <Skeleton className="h-[64px] w-[367px] rounded-xl" />
      <Skeleton className="h-[64px] w-[367px] rounded-xl" />
      <Skeleton className="h-[64px] w-[367px] rounded-xl" />
      <Skeleton className="h-[64px] w-[367px] rounded-xl" />
    </div>
  );
}
