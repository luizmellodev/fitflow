import { useState, useEffect } from "react";
import { User } from "@/models/user";
import { Workout } from "@/models/workout";
import { getWorkoutsForUser } from "@/services/workoutService";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface WorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  date: Date;
}

export function WorkoutDialog({
  isOpen,
  onClose,
  user,
  date,
}: WorkoutDialogProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (user) {
        const fetchedWorkouts = await getWorkoutsForUser(user.id, date);
        setWorkouts(fetchedWorkouts);
        setCurrentWorkoutIndex(0);
      }
    };

    if (user) {
      fetchWorkouts();
    }
  }, [user, date]);

  const showPreviousWorkout = () => {
    setCurrentWorkoutIndex((prev) => Math.min(prev + 1, workouts.length - 1));
  };

  const showNextWorkout = () => {
    setCurrentWorkoutIndex((prev) => Math.max(prev - 1, 0));
  };

  const displayedWorkout = workouts[currentWorkoutIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby="workout-description">
        <DialogHeader>
          <DialogTitle>Treinos de {user?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {displayedWorkout ? (
            <>
              <div className="border p-4 rounded-md">
                <h3 className="font-bold mb-4">
                  Treino do dia{" "}
                  {format(new Date(displayedWorkout.date), "dd/MM/yyyy")}
                </h3>
                <ul className="space-y-2">
                  {displayedWorkout.exercises.map((exercise) => (
                    <li key={exercise.id} className="p-2 bg-gray-50 rounded-md">
                      <div className="font-medium">{exercise.name}</div>
                      <div className="text-sm text-gray-600">
                        {exercise.description}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center pt-4">
                <Button
                  onClick={showPreviousWorkout}
                  disabled={currentWorkoutIndex === workouts.length - 1}
                  variant="outline"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Treino Anterior
                </Button>
                <Button
                  onClick={showNextWorkout}
                  disabled={currentWorkoutIndex === 0}
                  variant="outline"
                >
                  Próximo Treino
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-6 text-gray-500">
              Nenhum treino encontrado para este usuário.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
