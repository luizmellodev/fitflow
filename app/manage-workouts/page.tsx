"use client";

import { useState, useEffect } from "react";
import { Layout } from "@/components/project/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { X } from "lucide-react";

type User = {
  id: string;
  name: string;
};

type Workout = {
  id: string;
  userId: string;
  exercises: string[];
  date: Date;
};

const predefinedExercises = [
  "Leg Press",
  "Crucifixo",
  "Abdominal",
  "Esteira",
  "Biceps",
  "Barra",
  "Remada Alta",
  "Remada Baixa",
  "Remada Alta de Costas",
  "Abdutor",
  "Adutor",
  "Flexor",
  "Supino",
  "Agachamento",
  "Levantamento Terra",
  "Desenvolvimento",
  "Tríceps Corda",
  "Rosca Direta",
  "Prancha",
  "Elevação Lateral",
];

export default function ManageWorkouts() {
  const [users, setUsers] = useState<User[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [newWorkout, setNewWorkout] = useState<Omit<Workout, "id">>({
    userId: "",
    exercises: [],
    date: new Date(),
  });

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    setUsers([
      { id: "1", name: "John Doe" },
      { id: "2", name: "Jane Smith" },
      { id: "3", name: "Bob Johnson" },
    ]);
    setWorkouts([
      {
        id: "1",
        userId: "1",
        exercises: ["Leg Press", "Abdominal", "Esteira"],
        date: new Date(),
      },
      {
        id: "2",
        userId: "2",
        exercises: ["Biceps", "Tríceps Corda", "Barra"],
        date: new Date(),
      },
      {
        id: "3",
        userId: "3",
        exercises: ["Remada Alta", "Crucifixo", "Supino"],
        date: new Date(),
      },
    ]);
  }, []);

  const addWorkout = () => {
    if (newWorkout.userId === "" || newWorkout.exercises.length === 0) return;
    const workout = {
      ...newWorkout,
      id: Math.random().toString(36).substring(2, 11),
    };
    setWorkouts([...workouts, workout]);
    setNewWorkout({ userId: "", exercises: [], date: new Date() });
    setIsAddingWorkout(false);
    setSelectedUserId(null);
  };

  const updateWorkout = () => {
    if (!editingWorkout || editingWorkout.exercises.length === 0) return;
    setWorkouts(
      workouts.map((workout) =>
        workout.id === editingWorkout.id ? editingWorkout : workout
      )
    );
    setEditingWorkout(null);
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(workouts.filter((workout) => workout.id !== id));
  };

  const toggleExercise = (exercise: string) => {
    if (newWorkout.exercises.includes(exercise)) {
      setNewWorkout({
        ...newWorkout,
        exercises: newWorkout.exercises.filter((e) => e !== exercise),
      });
    } else {
      setNewWorkout({
        ...newWorkout,
        exercises: [...newWorkout.exercises, exercise],
      });
    }
  };

  const toggleEditingExercise = (exercise: string) => {
    if (!editingWorkout) return;
    if (editingWorkout.exercises.includes(exercise)) {
      setEditingWorkout({
        ...editingWorkout,
        exercises: editingWorkout.exercises.filter((e) => e !== exercise),
      });
    } else {
      setEditingWorkout({
        ...editingWorkout,
        exercises: [...editingWorkout.exercises, exercise],
      });
    }
  };

  const startAddingWorkout = (userId: string) => {
    setSelectedUserId(userId);
    setNewWorkout({ userId, exercises: [], date: new Date() });
    setIsAddingWorkout(true);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Manage Workouts</h1>
        <div className="mb-4">
          <Label htmlFor="user-select">Select User to Add Workout</Label>
          <Select onValueChange={(value) => startAddingWorkout(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <div>
                <span className="font-bold">
                  {users.find((u) => u.id === workout.userId)?.name}
                </span>
                <span className="ml-2 text-gray-500">
                  {format(workout.date, "MMM d, yyyy")}
                </span>
                <div className="text-sm text-gray-600">
                  {workout.exercises.join(", ")}
                </div>
              </div>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingWorkout(workout)}
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteWorkout(workout.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Dialog open={isAddingWorkout} onOpenChange={setIsAddingWorkout}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Add New Workout for{" "}
                {users.find((u) => u.id === selectedUserId)?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {predefinedExercises.map((exercise) => (
                  <Button
                    key={exercise}
                    variant={
                      newWorkout.exercises.includes(exercise)
                        ? "default"
                        : "outline"
                    }
                    onClick={() => toggleExercise(exercise)}
                    className="text-xs py-1 px-2 h-auto"
                  >
                    {exercise}
                  </Button>
                ))}
              </div>
              <div>
                <Label>Selected Exercises</Label>
                <div className="space-y-1">
                  {newWorkout.exercises.map((exercise) => (
                    <div
                      key={exercise}
                      className="flex justify-between items-center bg-secondary p-2 rounded"
                    >
                      <span>{exercise}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExercise(exercise)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="workout-date">Date</Label>
                <Input
                  id="workout-date"
                  type="date"
                  value={format(newWorkout.date, "yyyy-MM-dd")}
                  onChange={(e) =>
                    setNewWorkout({
                      ...newWorkout,
                      date: new Date(e.target.value),
                    })
                  }
                />
              </div>
              <Button onClick={addWorkout}>Add Workout</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog
          open={editingWorkout !== null}
          onOpenChange={() => setEditingWorkout(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Edit Workout for{" "}
                {users.find((u) => u.id === editingWorkout?.userId)?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {predefinedExercises.map((exercise) => (
                  <Button
                    key={exercise}
                    variant={
                      editingWorkout?.exercises.includes(exercise)
                        ? "default"
                        : "outline"
                    }
                    onClick={() => toggleEditingExercise(exercise)}
                    className="text-xs py-1 px-2 h-auto"
                  >
                    {exercise}
                  </Button>
                ))}
              </div>
              <div>
                <Label>Selected Exercises</Label>
                <div className="space-y-1">
                  {editingWorkout?.exercises.map((exercise) => (
                    <div
                      key={exercise}
                      className="flex justify-between items-center bg-secondary p-2 rounded"
                    >
                      <span>{exercise}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleEditingExercise(exercise)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-workout-date">Date</Label>
                <Input
                  id="edit-workout-date"
                  type="date"
                  value={
                    editingWorkout
                      ? format(editingWorkout.date, "yyyy-MM-dd")
                      : ""
                  }
                  onChange={(e) =>
                    setEditingWorkout((prev) =>
                      prev ? { ...prev, date: new Date(e.target.value) } : null
                    )
                  }
                />
              </div>
              <Button onClick={updateWorkout}>Update Workout</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
