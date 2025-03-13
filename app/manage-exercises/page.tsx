// components/ManageExercises.tsx
"use client";

import { useState, useEffect } from "react";
import { Layout } from "@/components/project/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,
} from "@/services/exerciseService";
import { Exercise } from "@/models/exercise";

export default function ManageExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseDescription, setNewExerciseDescription] = useState("");
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    const fetchedExercises = await getExercises();
    setExercises(fetchedExercises);
  };

  const handleAddExercise = async () => {
    if (newExerciseName.trim() === "") return;

    try {
      const newExercise = await createExercise({
        name: newExerciseName,
        description: newExerciseDescription,
      });
      setExercises([...exercises, newExercise]);
      setNewExerciseName("");
      setNewExerciseDescription("");
      setIsAddingExercise(false);
    } catch (error) {
      console.error("Failed to add exercise:", error);
    }
  };

  const handleUpdateExercise = async () => {
    if (!editingExercise || editingExercise.name.trim() === "") return;

    try {
      const updatedExercise = await updateExercise(
        editingExercise.id,
        editingExercise
      );
      setExercises(
        exercises.map((exercise) =>
          exercise.id === updatedExercise.id ? updatedExercise : exercise
        )
      );
      setEditingExercise(null);
    } catch (error) {
      console.error("Failed to update exercise:", error);
    }
  };

  const handleDeleteExercise = async (id: string) => {
    try {
      await deleteExercise(id);
      setExercises(exercises.filter((exercise) => exercise.id !== id));
    } catch (error) {
      console.error("Failed to delete exercise:", error);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Manage Exercises</h1>
      <Button onClick={() => setIsAddingExercise(true)} className="mb-4">
        Add New Exercise
      </Button>
      <div className="space-y-2">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="flex items-center justify-between p-2 border rounded"
          >
            <div>
              <span className="font-semibold">{exercise.name}</span>
              <p className="text-sm text-gray-600">{exercise.description}</p>
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingExercise(exercise)}
                className="mr-2"
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteExercise(exercise.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog for adding new exercise */}
      <Dialog open={isAddingExercise} onOpenChange={setIsAddingExercise}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Exercise</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-exercise-name">Exercise Name</Label>
              <Input
                id="new-exercise-name"
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
                placeholder="Enter exercise name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-exercise-description">Description</Label>
              <Textarea
                id="new-exercise-description"
                value={newExerciseDescription}
                onChange={(e) => setNewExerciseDescription(e.target.value)}
                placeholder="Enter exercise description"
              />
            </div>
            <Button onClick={handleAddExercise}>Add Exercise</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing exercise */}
      <Dialog
        open={editingExercise !== null}
        onOpenChange={() => setEditingExercise(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Exercise</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-exercise-name">Exercise Name</Label>
              <Input
                id="edit-exercise-name"
                value={editingExercise?.name || ""}
                onChange={(e) =>
                  setEditingExercise((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                placeholder="Enter exercise name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-exercise-description">Description</Label>
              <Textarea
                id="edit-exercise-description"
                value={editingExercise?.description || ""}
                onChange={(e) =>
                  setEditingExercise((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
                placeholder="Enter exercise description"
              />
            </div>
            <Button onClick={handleUpdateExercise}>Update Exercise</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
