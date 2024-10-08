"use client";

import { useState, useEffect } from "react";
import { parseISO, isToday, isBefore } from "date-fns";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TodaysWorkout } from "../../components/project/TodaysWorkout";
import { WorkoutHistory } from "../../components/project/WorkoutHistory";

import usersData from "../../public/data/users.json";
import workoutsData from "../../public/data/workouts.json";

type Exercise = {
  name: string;
  sets: number;
  reps: number;
};

type Workout = {
  id: string;
  date: string;
  userId: string;
  exercises: Exercise[];
};

export default function UserWorkoutView() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    // Simulating a logged-in user. In a real app, you'd get this from authentication.
    const loggedInUserId = "1";
    const userWorkouts = workoutsData.filter(
      (workout) => workout.userId === loggedInUserId
    );
    setWorkouts(
      userWorkouts.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
    setUser(usersData.find((u) => u.id === loggedInUserId) || null);
  }, []);

  const handleCompleteExercise = (workoutId: string, exerciseName: string) => {
    setCompletedExercises((prev) => {
      const newSet = new Set(prev);
      newSet.add(`${workoutId}-${exerciseName}`);
      return newSet;
    });
  };

  const todaysWorkout = workouts.find((workout) =>
    isToday(parseISO(workout.date))
  );
  const previousWorkouts = workouts.filter(
    (workout) =>
      isBefore(parseISO(workout.date), new Date()) &&
      !isToday(parseISO(workout.date))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-2xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Olá, {user?.name}!
      </motion.h1>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="today">Treino de Hoje</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <TodaysWorkout
            workout={todaysWorkout}
            completedExercises={completedExercises}
            onCompleteExercise={handleCompleteExercise}
          />
        </TabsContent>

        <TabsContent value="history">
          <WorkoutHistory workouts={previousWorkouts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
