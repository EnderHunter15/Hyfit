"use client";
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@radix-ui/react-separator";

export default function dietPage() {
  const progress = 64;
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-primary p-2 text-2xl">Your Diet</h1>
      <Separator className="bg-primary w-full rounded-2xl p-1" />
      <div className="bg-secondary mt-2 flex w-full flex-col items-center justify-center rounded-2xl p-4">
        <div className="mb-6">
          <AnimatedCircularProgressBar
            value={progress}
            min={0}
            max={100}
            gaugePrimaryColor="blue"
            gaugeSecondaryColor="bg-foreground"
          />
        </div>
        <div className="flex w-full flex-row items-center">
          <div className="flex w-full flex-col items-center justify-center">
            <h1>Carbs</h1>
            <Progress value={progress} className="m-3 w-[80%] bg-gray-500" />
            <h1>grams</h1>
          </div>
          <div className="flex w-full flex-col items-center justify-center">
            <h1>Protein</h1>
            <Progress value={progress} className="m-3 w-[80%] bg-gray-500" />
            <h1>grams</h1>
          </div>
          <div className="flex w-full flex-col items-center justify-center">
            <h1>Fats</h1>
            <Progress value={progress} className="m-3 w-[80%] bg-gray-500" />
            <h1>grams</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
