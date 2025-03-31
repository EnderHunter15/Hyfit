"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import WorkoutTimer from "@/components/workoutTimer";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@radix-ui/react-separator";
import { Input } from "@/components/ui/input";

export default function WorkoutPage() {
  const [open, setOpen] = useState(false);
  const [workoutFinished, setWorkoutFinished] = useState(false);
  return (
    <div className="bg-background flex h-full min-h-screen w-full flex-col items-center p-6">
      <Drawer
        open={open}
        onOpenChange={(newState) => {
          if (!newState && !workoutFinished) return;
          setOpen(newState);
        }}
      >
        <DrawerTrigger asChild>
          <Button className="w-3/4 rounded-2xl" onClick={() => setOpen(true)}>
            Start empty workout
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-background flex h-[90vh] p-4">
          <DrawerHeader className="flex flex-col items-center">
            <DrawerTitle>Current Session</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
            <WorkoutTimer />
            <Separator
              className="bg-primary mt-2 w-full rounded-2xl p-[2px]"
              orientation="horizontal"
            />
          </DrawerHeader>
          <div className="flex flex-col items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button className="w-1/2 rounded-2xl">Add an exercise</Button>
              </SheetTrigger>
              <SheetContent className="w-full">
                <SheetHeader className="flex items-center">
                  <SheetTitle>
                    <Input
                      className="text-primary w-full rounded-3xl p-4"
                      placeholder="Search exercise"
                    />
                    <Separator className="bg-primary mt-2 rounded-2xl p-[2px]" />
                  </SheetTitle>
                </SheetHeader>
                {/* { render exercises} */}
              </SheetContent>
            </Sheet>
          </div>
          <DrawerFooter className="mt-auto">
            <Button
              onClick={() => {
                setOpen(false);
                setWorkoutFinished(true);
              }}
            >
              Complete workout <Send />
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
