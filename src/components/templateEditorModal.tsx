"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Checkbox } from "@/components/ui/checkbox";

export default function TemplateEditorModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const { data: exercises = [] } = api.exercise.getAllExercises.useQuery();
  const create = api.workoutTemplate.createTemplate.useMutation();

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSave = () => {
    if (!name.trim() || selected.length === 0) return;
    create.mutate(
      { name, exercises: selected },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Create Template</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Template name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4"
        />

        <div className="max-h-[300px] space-y-2 overflow-y-auto pr-2">
          {exercises.map((ex) => {
            const isSelected = selected.includes(ex.id);
            return (
              <label
                key={ex.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition ${
                  isSelected
                    ? "bg-primary/20 border-primary text-white"
                    : "bg-muted/10 text-muted-foreground"
                }`}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggle(ex.id)}
                  className="accent-primary"
                />
                <span>{ex.name}</span>
              </label>
            );
          })}
        </div>

        <Button
          onClick={handleSave}
          disabled={!name.trim() || selected.length === 0}
          className="mt-4 w-full"
        >
          Save Template
        </Button>
      </DialogContent>
    </Dialog>
  );
}
