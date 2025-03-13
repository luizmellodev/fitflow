import { Exercise } from "./exercise";

export interface Workout {
  id: string;
  userId: string;
  date: Date;
  exercises: Exercise[];
}