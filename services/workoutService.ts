// services/workoutService.ts
import { createClient } from '@/utils/supabase/client';
import { Workout } from '@/models/workout';
import { Exercise } from '@/models/exercise';
import { Schedule } from '@/models/schedule';

interface CreateWorkoutDTO {
  userId: string;
  date: Date;
  exercises: Exercise[];
}

export async function getScheduleForUser(userId: string): Promise<Schedule[]> {
  const { data, error } = await createClient()
    .from('schedule')
    .select(`
      id,
      date,
      hour,
      user_id,
      workout_id,
      workout:workouts!workout_id (
        id,
        exercises:workout_exercises (
          exercise:exercises (id, name, description)
        )
      )
    `)
    .eq('user_id', userId)
    .order('date', { ascending: true })
    .order('hour', { ascending: true });

  if (error) {
    console.error('Error fetching schedule for user:', error);
    throw error;
  }

  return data.map((schedule: any) => {

    const dateStr = schedule.date;
    const [year, month, day] = dateStr.split('-').map(Number);
    const newDate = new Date(Date.UTC(year, month - 1, day));

    console.log("Newdate date:", newDate.toISOString());
    
    return {
    id: schedule.id,
    date: newDate,
    hour: schedule.hour,
    user_id: schedule.user_id,
    workoutId: schedule.workout_id,
    workout: schedule.workout ? {
      id: schedule.workout.id,
      userId: schedule.user_id,
      date: newDate,
      exercises: schedule.workout.exercises.map((we: any) => we.exercise)
    } : null
  };
  });
}

export async function addWorkout(workoutData: CreateWorkoutDTO): Promise<Workout> {
  // Criar o workout
  const { data: workout, error: workoutError } = await createClient()
    .from('workouts')
    .insert({
      user_id: workoutData.userId,
      date: workoutData.date.toISOString().split('T')[0]
    })
    .select()
    .single();

  if (workoutError) {
    console.error('Error creating workout:', workoutError);
    throw workoutError;
  }

  // Adicionar exercícios ao workout
  if (workoutData.exercises.length > 0) {
    const workoutExercises = workoutData.exercises.map(exercise => ({
      workout_id: workout.id,
      exercise_id: exercise.id
    }));

    const { error: exercisesError } = await createClient()
      .from('workout_exercises')
      .insert(workoutExercises);

    if (exercisesError) {
      // Limpar workout se falhar ao adicionar exercícios
      await createClient()
        .from('workouts')
        .delete()
        .eq('id', workout.id);
      
      console.error('Error adding exercises to workout:', exercisesError);
      throw exercisesError;
    }
  }

  return {
    id: workout.id,
    userId: workout.user_id,
    date: new Date(workout.date),
    exercises: workoutData.exercises
  };
}

export async function updateWorkout(id: string, workoutData: Partial<CreateWorkoutDTO>): Promise<void> {
  const updates: any = {};
  if (workoutData.date) {
    updates.date = workoutData.date.toISOString().split('T')[0];
  }

  const { error: workoutError } = await createClient()
    .from('workouts')
    .update(updates)
    .eq('id', id);

  if (workoutError) {
    console.error('Error updating workout:', workoutError);
    throw workoutError;
  }

  if (workoutData.exercises) {
    // Remover exercícios existentes
    const { error: deleteError } = await createClient()
      .from('workout_exercises')
      .delete()
      .eq('workout_id', id);

    if (deleteError) {
      console.error('Error deleting existing exercises:', deleteError);
      throw deleteError;
    }

    // Adicionar novos exercícios
    const workoutExercises = workoutData.exercises.map(exercise => ({
      workout_id: id,
      exercise_id: exercise.id
    }));

    const { error: insertError } = await createClient()
      .from('workout_exercises')
      .insert(workoutExercises);

    if (insertError) {
      console.error('Error inserting new exercises:', insertError);
      throw insertError;
    }
  }
}

export async function getExercises(): Promise<Exercise[]> {
  const { data, error } = await createClient()
    .from('exercises')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }

  return data;
}

export async function addExercise(exercise: Omit<Exercise, 'id'>): Promise<Exercise> {
  const { data, error } = await createClient()
    .from('exercises')
    .insert(exercise)
    .select()
    .single();

  if (error) {
    console.error('Error adding exercise:', error);
    throw error;
  }

  return data;
}

export async function getWorkoutsForUser(userId: string, currentDate?: Date, limit: number = 3): Promise<Workout[]> {
  const { data, error } = await createClient()
    .from('workouts')
    .select(`
      id,
      user_id,
      date,
      exercises:workout_exercises(
        exercise:exercises(id, name, description)
      )
    `)
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }

  return data.map((workout: any) => ({
    id: workout.id,
    userId: workout.user_id,
    date: new Date(workout.date),
    exercises: workout.exercises.map((we: any) => we.exercise)
  }));
}

export async function deleteWorkout(workoutId: string): Promise<void> {
  const { error } = await createClient()
    .from('workouts')
    .delete()
    .eq('id', workoutId);

  if (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
}

export async function updateWorkoutExercises(workoutId: string, exerciseIds: string[]): Promise<void> {
  // Primeiro, removemos todos os exercícios existentes
  const { error: deleteError } = await createClient()
    .from('workout_exercises')
    .delete()
    .eq('workout_id', workoutId);

  if (deleteError) {
    console.error('Error removing existing exercises:', deleteError);
    throw deleteError;
  }

  // Agora, adicionamos os novos exercícios
  const workoutExercises = exerciseIds.map(exerciseId => ({
    workout_id: workoutId,
    exercise_id: exerciseId
  }));

  const { error: insertError } = await createClient()
    .from('workout_exercises')
    .insert(workoutExercises);

  if (insertError) {
    console.error('Error adding new exercises:', insertError);
    throw insertError;
  }
}