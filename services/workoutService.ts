import { createClient } from '../utils/supabase/client';

const supabase = createClient();

export const getWorkouts = async (userId: string, date: string) => {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .or(`date.eq.${date},day_of_week.eq.${new Date(date).getDay()}`);
  
  if (error) throw error;
  return data;
};

export const createWorkout = async (userId: string, date: Date, time: string, dayOfWeek?: number) => {
  const { data, error } = await supabase.from('workouts').insert([{ user_id: userId, date, time, day_of_week: dayOfWeek }]);
  if (error) throw error;
  return data;
};

export const updateWorkout = async (id: string, userId: string, date: Date, time: string, dayOfWeek?: number) => {
    const { data, error } = await supabase
      .from('workouts')
      .update({ user_id: userId, date, time, day_of_week: dayOfWeek })
      .match({ id });
    
    if (error) throw error;
    return data;
  };