"use client";

import { useState, useEffect } from "react";
import { Layout } from "@/components/project/layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { getUsers } from "@/services/userService";
import { getScheduleForUser } from "@/services/scheduleService";
import {
  getExercises,
  addWorkout,
  getWorkoutsForUser,
  deleteWorkout,
  updateWorkoutExercises,
} from "@/services/workoutService";
import { User } from "@/models/user";
import { Schedule } from "@/models/schedule";
import { Exercise } from "@/models/exercise";
import { Workout } from "@/models/workout";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ManageWorkouts() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userSchedules, setUserSchedules] = useState<Schedule[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);
  const [isEditingWorkout, setIsEditingWorkout] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [userWorkouts, setUserWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchExercises();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserSchedules();
      fetchUserWorkouts();
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    const fetchedUsers = await getUsers();
    setUsers(fetchedUsers);
  };

  const fetchExercises = async () => {
    const fetchedExercises = await getExercises();
    setExercises(fetchedExercises);
  };

  const fetchUserSchedules = async () => {
    if (selectedUser) {
      const schedules = await getScheduleForUser(selectedUser.id);
      setUserSchedules(schedules);
    }
  };

  const fetchUserWorkouts = async () => {
    if (selectedUser) {
      const workouts = await getWorkoutsForUser(selectedUser.id);
      setUserWorkouts(workouts);
    }
  };

  const handleCreateWorkout = async () => {
    if (!selectedSchedule || selectedExercises.length === 0) return;

    try {
      await addWorkout({
        userId: selectedUser!.id,
        date: selectedSchedule.date,
        exercises: selectedExercises,
      });

      setSelectedExercises([]);
      setIsAddingWorkout(false);
      fetchUserSchedules();
      fetchUserWorkouts();
    } catch (error) {
      console.error("Failed to create workout:", error);
    }
  };

  const handleEditWorkout = async () => {
    if (!editingWorkout) return;

    try {
      await updateWorkoutExercises(
        editingWorkout.id,
        selectedExercises.map((e) => e.id)
      );
      setIsEditingWorkout(false);
      setEditingWorkout(null);
      fetchUserWorkouts();
    } catch (error) {
      console.error("Failed to update workout:", error);
    }
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    try {
      await deleteWorkout(workoutId);
      fetchUserWorkouts();
    } catch (error) {
      console.error("Failed to delete workout:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Gerenciar Treinos</h1>

        <Select
          value={selectedUser?.id}
          onValueChange={(value) => {
            const user = users.find((u) => u.id === value);
            setSelectedUser(user || null);
          }}
        >
          <SelectTrigger className="w-full mb-4">
            <SelectValue placeholder="Selecione um usuário" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedUser && (
          <>
            {userSchedules.some((schedule) => !schedule.workoutId) && (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  Aulas sem exercícios
                </h2>
                <div className="space-y-2 mb-6">
                  {userSchedules
                    .filter((schedule) => !schedule.workoutId)
                    .map((schedule) => (
                      <div
                        key={`${schedule.date}-${schedule.hour}`}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <span className="font-medium">
                          {format(new Date(schedule.date), "dd/MM/yyyy")} às{" "}
                          {schedule.hour}:00
                        </span>
                        <Button
                          onClick={() => {
                            setSelectedSchedule(schedule);
                            setIsAddingWorkout(true);
                          }}
                        >
                          Criar Treino
                        </Button>
                      </div>
                    ))}
                </div>
              </>
            )}

            {userWorkouts.length > 0 && (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  Treinos Existentes
                </h2>
                <div className="space-y-2 mb-6">
                  {userWorkouts.map((workout) => (
                    <div
                      key={workout.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <span className="font-medium">
                          {format(new Date(workout.date), "dd/MM/yyyy")}
                        </span>
                        <span className="text-gray-500 ml-2">
                          ({workout.exercises.length} exercícios)
                        </span>
                      </div>
                      <div>
                        <Button
                          onClick={() => {
                            setEditingWorkout(workout);
                            setSelectedExercises(workout.exercises);
                            setIsEditingWorkout(true);
                          }}
                          className="mr-2"
                          variant="outline"
                        >
                          Editar
                        </Button>
                        <Button
                          onClick={() => handleDeleteWorkout(workout.id)}
                          variant="destructive"
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!userSchedules.some((schedule) => !schedule.workoutId) &&
              !userWorkouts.length && (
                <p className="text-gray-500 text-center py-4">
                  Nenhuma aula ou treino encontrado para este usuário.
                </p>
              )}
          </>
        )}

        <Dialog
          open={isAddingWorkout || isEditingWorkout}
          onOpenChange={() => {
            setIsAddingWorkout(false);
            setIsEditingWorkout(false);
            setEditingWorkout(null);
            setSelectedExercises([]);
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {isEditingWorkout ? "Editar Treino" : "Criar Treino"}
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">
                Selecione os Exercícios
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {exercises.map((exercise) => (
                  <Button
                    key={exercise.id}
                    type="button"
                    variant={
                      selectedExercises.some((e) => e.id === exercise.id)
                        ? "default"
                        : "outline"
                    }
                    className={cn(
                      "h-auto py-2 px-3 justify-start",
                      selectedExercises.some((e) => e.id === exercise.id) &&
                        "bg-primary text-primary-foreground"
                    )}
                    onClick={() => {
                      if (selectedExercises.some((e) => e.id === exercise.id)) {
                        setSelectedExercises(
                          selectedExercises.filter((e) => e.id !== exercise.id)
                        );
                      } else {
                        setSelectedExercises([...selectedExercises, exercise]);
                      }
                    }}
                  >
                    {exercise.name}
                  </Button>
                ))}
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedExercises([]);
                    setIsAddingWorkout(false);
                    setIsEditingWorkout(false);
                    setEditingWorkout(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={
                    isEditingWorkout ? handleEditWorkout : handleCreateWorkout
                  }
                  disabled={selectedExercises.length === 0}
                >
                  {isEditingWorkout ? "Atualizar Treino" : "Criar Treino"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
