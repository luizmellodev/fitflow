import { useState } from "react";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp } from "lucide-react";

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

type WorkoutHistoryProps = {
  workouts: Workout[];
};

export function WorkoutHistory({ workouts }: WorkoutHistoryProps) {
  const [expandedWorkouts, setExpandedWorkouts] = useState<Set<string>>(
    new Set()
  );

  const toggleWorkoutExpansion = (workoutId: string) => {
    setExpandedWorkouts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(workoutId)) {
        newSet.delete(workoutId);
      } else {
        newSet.add(workoutId);
      }
      return newSet;
    });
  };

  return (
    <ScrollArea className="h-[600px]">
      <AnimatePresence>
        {workouts.map((workout, index) => (
          <motion.div
            key={workout.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="mb-4">
              <CardHeader
                className="cursor-pointer"
                onClick={() => toggleWorkoutExpansion(workout.id)}
              >
                <div className="flex justify-between items-center">
                  <CardTitle>
                    Treino de {format(parseISO(workout.date), "dd/MM/yyyy")}
                  </CardTitle>
                  {expandedWorkouts.has(workout.id) ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </div>
              </CardHeader>
              {expandedWorkouts.has(workout.id) && (
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Exercício</TableHead>
                        <TableHead>Séries</TableHead>
                        <TableHead>Repetições</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workout.exercises.map((exercise, exerciseIndex) => (
                        <TableRow key={exerciseIndex}>
                          <TableCell>{exercise.name}</TableCell>
                          <TableCell>{exercise.sets}</TableCell>
                          <TableCell>{exercise.reps}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              )}
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </ScrollArea>
  );
}
