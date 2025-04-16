"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function ProfileStatsLoading() {
  return (
    <div className="flex h-screen w-full flex-col gap-4 overflow-y-auto p-4 pb-28">
      <div className="flex justify-center">Your Profile</div>

      <Separator className="bg-primary rounded-2xl p-1" />

      <Skeleton className="h-[128px] w-[367px] rounded-4xl" />
      <Skeleton className="h-[128px] w-[367px] rounded-4xl" />
      <Skeleton className="h-[128px] w-[367px] rounded-4xl" />
      <Skeleton className="h-[128px] w-[367px] rounded-4xl" />
      <Skeleton className="h-[128px] w-[367px] rounded-4xl" />
    </div>
  );
}
