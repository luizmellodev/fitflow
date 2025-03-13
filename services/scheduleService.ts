// scheduleService.ts
import { createClient } from '@/utils/supabase/client';
import { User } from '@/models/user';
import { Schedule } from '@/models/schedule';

interface ScheduleGroup {
  hour: number;
  users: User[];
  workouts: string[];
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
      workouts (
        id,
        exercises:workout_exercises (
          exercise:exercises (id, name, description)
        )
      )
    `)
    .eq('user_id', userId)
    .order('date', { ascending: true })
    .order('hour', { ascending: true });

  console.log("Supabase response:", { data, error });
    
  if (error) {
    console.error('Error fetching schedule for user:', error);
    throw error;
  }

  return data.map((schedule: any) => {
    // Garantir que a data seja tratada corretamente
    const dateStr = schedule.date; // formato: "YYYY-MM-DD"
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(Date.UTC(year, month, day));

    console.log("Schedule date:", date);

    return {
      id: schedule.id,
      date,
      hour: schedule.hour,
      user_id: schedule.user_id,
      workoutId: schedule.workout_id,
      workout: schedule.workouts ? {
        id: schedule.workouts.id,
        exercises: schedule.workouts.exercises.map((we: any) => we.exercise),
        userId: schedule.user_id,
        date // usar a mesma data já corrigida
      } : null
    };
  });
}

export async function getScheduleForDate(date: Date): Promise<ScheduleGroup[]> {
  const formattedDate = date.toISOString().split('T')[0];
  
  const { data, error } = await createClient()
    .from('schedule')
    .select(`
      hour,
      user_id,
      workout_id,
      users (id, name)
    `)
    .eq('date', formattedDate)
    .order('hour');

  console.log("Supabase response:", { data, error, formattedDate });

  if (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }

  // Agrupar por hora
  const groupedSchedule = data.reduce((acc: { [hour: number]: ScheduleGroup }, slot: any) => {
    if (!acc[slot.hour]) {
      acc[slot.hour] = { hour: slot.hour, users: [], workouts: [] };
    }
    acc[slot.hour].users.push(slot.users);
    if (slot.workout_id) {
      acc[slot.hour].workouts.push(slot.workout_id);
    }
    return acc;
  }, {});

  return Object.values(groupedSchedule);
}

export async function addUserToSchedule(date: Date, hour: number, userId: string): Promise<void> {
  const formattedDate = date.toISOString().split('T')[0];
  
  const { error } = await createClient()
    .from('schedule')
    .insert({ 
      date: formattedDate, 
      hour, 
      user_id: userId
    });

  if (error) {
    console.error('Error adding user to schedule:', error);
    throw error;
  }
}

export async function removeUserFromSchedule(date: Date, hour: number, userId: string): Promise<void> {
  const formattedDate = date.toISOString().split('T')[0];
  
  const { error } = await createClient()
    .from('schedule')
    .delete()
    .match({ date: formattedDate, hour, user_id: userId });

  if (error) {
    console.error('Error removing user from schedule:', error);
    throw error;
  }
}

export async function checkUserSchedule(date: Date, userId: string): Promise<{ isScheduled: boolean; hour?: number; workoutId?: string }> {
  const formattedDate = date.toISOString().split('T')[0];
  
  const { data, error } = await createClient()
    .from('schedule')
    .select('hour, workout_id')
    .eq('date', formattedDate)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking user schedule:', error);
    throw error;
  }

  return {
    isScheduled: !!data,
    hour: data?.hour,
    workoutId: data?.workout_id
  };
}

export async function updateScheduleWorkout(
  scheduleId: string,
  workoutId: string
): Promise<void> {
  const { error } = await createClient()
    .from('schedule')
    .update({ workout_id: workoutId })
    .eq('id', scheduleId);

  if (error) {
    console.error('Error updating schedule workout:', error);
    throw error;
  }

  console.log("Schedule workout updated");
}