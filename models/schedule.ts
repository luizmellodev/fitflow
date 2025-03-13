// models/scheduleSlot.ts
import { User } from './user';
import { Workout } from './workout';

export interface Schedule {
  id: string;
  date: Date;
  hour: number;
  user_id: User;
  workoutId?: string;
  workout?: Workout | null;
}