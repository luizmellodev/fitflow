import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

type Workout = {
  id: string;
  date: string;
  userId: string;
  exercises: { name: string; sets: number; reps: number }[];
};

type User = {
  id: string;
  name: string;
};

type WorkoutListProps = {
  workouts: Workout[];
  users: User[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function WorkoutList({
  workouts,
  users,
  currentPage,
  itemsPerPage,
  totalPages,
  onPageChange,
}: WorkoutListProps) {
  const paginatedWorkouts = workouts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <ScrollArea className="h-[400px] md:h-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Exercício</TableHead>
              <TableHead>Séries</TableHead>
              <TableHead>Repetições</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {paginatedWorkouts.map((workout) =>
                workout.exercises.map((exercise, index) => (
                  <motion.tr
                    key={`${workout.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <TableCell>
                      {format(parseISO(workout.date), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      {users.find((u) => u.id === workout.userId)?.name}
                    </TableCell>
                    <TableCell>{exercise.name}</TableCell>
                    <TableCell>{exercise.sets}</TableCell>
                    <TableCell>{exercise.reps}</TableCell>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
