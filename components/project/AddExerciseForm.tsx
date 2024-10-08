import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Exercise = {
  name: string;
  sets: number;
  reps: number;
};

type AddExerciseFormProps = {
  onAddExercise: (exercise: Exercise) => void;
};

export function AddExerciseForm({ onAddExercise }: AddExerciseFormProps) {
  const [newExercise, setNewExercise] = useState<Exercise>({
    name: "",
    sets: 0,
    reps: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddExercise(newExercise);
    setNewExercise({ name: "", sets: 0, reps: 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="exercise-name">Nome do Exercício</Label>
        <Input
          id="exercise-name"
          value={newExercise.name}
          onChange={(e) =>
            setNewExercise({ ...newExercise, name: e.target.value })
          }
          required
        />
      </div>
      <div className="flex space-x-4">
        <div className="w-1/2">
          <Label htmlFor="exercise-sets">Séries</Label>
          <Input
            id="exercise-sets"
            type="number"
            value={newExercise.sets}
            onChange={(e) =>
              setNewExercise({
                ...newExercise,
                sets: parseInt(e.target.value),
              })
            }
            required
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="exercise-reps">Repetições</Label>
          <Input
            id="exercise-reps"
            type="number"
            value={newExercise.reps}
            onChange={(e) =>
              setNewExercise({
                ...newExercise,
                reps: parseInt(e.target.value),
              })
            }
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Adicionar Exercício
      </Button>
    </form>
  );
}
