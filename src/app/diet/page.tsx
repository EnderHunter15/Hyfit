"use client";
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar";

export default function dietPage() {
  const calories = 50;
  return (
    <div>
      <h1>Diet Page</h1>
      <AnimatedCircularProgressBar
        value={calories}
        min={0}
        max={100}
        gaugePrimaryColor="bg-primary"
        gaugeSecondaryColor="text-muted-foreground"
      />
    </div>
  );
}
