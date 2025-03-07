import { createClient } from '../utils/supabase/client';

const supabase = createClient();

export const getExercises = async () => {
  const { data, error } = await supabase.from('exercises').select('*');
  if (error) throw error;
  return data;
};
