"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { WorkoutList } from "../components/project/WorkoutList";
import { AddExerciseForm } from "../components/project/AddExerciseForm";
import { UserManagement } from "../components/project/UserManagement";

import workoutsData from "../public/data/workouts.json";
import usersData from "../public/data/users.json";

type User = {
  id: string;
  name: string;
};

type Workout = {
  id: string;
  date: string;
  userId: string;
  exercises: { name: string; sets: number; reps: number }[];
};

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>(usersData);
  const [workouts, setWorkouts] = useState<Workout[]>(workoutsData);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedUserId, setSelectedUserId] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    setUsers(usersData);
    setWorkouts(workoutsData);
  }, []);

  const handleAddExercise = (newExercise: {
    name: string;
    sets: number;
    reps: number;
  }) => {
    if (!selectedDate || selectedUserId === "all") return;

    const workoutDate = format(selectedDate, "yyyy-MM-dd");
    const workout = workouts.find(
      (w) => w.date === workoutDate && w.userId === selectedUserId
    );

    if (workout) {
      // Update existing workout
      const updatedWorkout = {
        ...workout,
        exercises: [...workout.exercises, newExercise],
      };
      setWorkouts(
        workouts.map((w) => (w.id === workout.id ? updatedWorkout : w))
      );
    } else {
      // Create new workout
      const newWorkout = {
        id: String(workouts.length + 1),
        date: workoutDate,
        userId: selectedUserId,
        exercises: [newExercise],
      };
      setWorkouts([...workouts, newWorkout]);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const filteredWorkouts = workouts
    .filter((workout) => {
      if (selectedUserId !== "all" && selectedDate) {
        return (
          workout.userId === selectedUserId &&
          workout.date === format(selectedDate, "yyyy-MM-dd")
        );
      } else if (selectedUserId !== "all") {
        return workout.userId === selectedUserId;
      } else if (selectedDate) {
        return workout.date === format(selectedDate, "yyyy-MM-dd");
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalPages = Math.ceil(filteredWorkouts.length / itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-2xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Painel de Administração
      </motion.h1>
      <Tabs defaultValue="workouts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="workouts">Gerenciar Workouts</TabsTrigger>
          <TabsTrigger value="users">Gerenciar Usuários</TabsTrigger>
        </TabsList>
        <TabsContent value="workouts">
          <div className="space-y-6 md:space-y-0 md:flex md:space-x-6">
            <motion.div
              className="w-full md:w-1/5"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Filtrar Treinos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setCurrentPage(1);
                      }}
                      className="rounded-md border w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-search">Buscar Usuário</Label>
                    <Input
                      id="user-search"
                      type="text"
                      placeholder="Digite o nome do usuário"
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                    />
                    {userSearchTerm && (
                      <ul className="mt-2 border rounded-md divide-y max-h-40 overflow-y-auto">
                        <li
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedUserId("all");
                            setUserSearchTerm("");
                          }}
                        >
                          Todos os usuários
                        </li>
                        {filteredUsers.map((user) => (
                          <li
                            key={user.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setUserSearchTerm(user.name);
                            }}
                          >
                            {user.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Exercício</CardTitle>
                </CardHeader>
                <CardContent>
                  <AddExerciseForm onAddExercise={handleAddExercise} />
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              className="w-full md:w-2/3"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    Lista de Treinos
                    {selectedUserId !== "all" &&
                      ` - ${users.find((u) => u.id === selectedUserId)?.name}`}
                    {selectedDate && ` - ${format(selectedDate, "dd/MM/yyyy")}`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WorkoutList
                    workouts={filteredWorkouts}
                    users={users}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
        <TabsContent value="users">
          <UserManagement initialUsers={users} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
