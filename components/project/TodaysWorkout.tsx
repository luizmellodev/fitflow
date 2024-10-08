import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle } from "lucide-react";

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

type TodaysWorkoutProps = {
  workout: Workout | undefined;
  completedExercises: Set<string>;
  onCompleteExercise: (workoutId: string, exerciseName: string) => void;
};

export function TodaysWorkout({
  workout,
  completedExercises,
  onCompleteExercise,
}: TodaysWorkoutProps) {
  if (!workout) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              Não há treino programado para hoje. Aproveite seu dia de descanso!
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            Seu treino para hoje ({format(parseISO(workout.date), "dd/MM/yyyy")}
            )
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exercício</TableHead>
                <TableHead>Séries</TableHead>
                <TableHead>Repetições</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workout.exercises.map((exercise, index) => (
                <TableRow key={index}>
                  <TableCell>{exercise.name}</TableCell>
                  <TableCell>{exercise.sets}</TableCell>
                  <TableCell>{exercise.reps}</TableCell>
                  <TableCell>
                    <Button
                      variant={
                        completedExercises.has(`${workout.id}-${exercise.name}`)
                          ? "outline"
                          : "default"
                      }
                      size="sm"
                      onClick={() =>
                        onCompleteExercise(workout.id, exercise.name)
                      }
                      className="w-full"
                    >
                      {completedExercises.has(
                        `${workout.id}-${exercise.name}`
                      ) ? (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      ) : null}
                      {completedExercises.has(`${workout.id}-${exercise.name}`)
                        ? "Concluído"
                        : "Marcar como concluído"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
