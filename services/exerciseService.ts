// services/exerciseService.ts
import { createClient } from '@/utils/supabase/client';
import { Exercise } from '@/models/exercise';

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

export async function createExercise(exercise: Omit<Exercise, 'id'>): Promise<Exercise> {
  const { data, error } = await createClient()
    .from('exercises')
    .insert(exercise)
    .select()
    .single();

  if (error) {
    console.error('Error creating exercise:', error);
    throw error;
  }

  return data;
}

export async function updateExercise(id: string, exercise: Partial<Exercise>): Promise<Exercise> {
  const { data, error } = await createClient()
    .from('exercises')
    .update(exercise)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating exercise:', error);
    throw error;
  }

  return data;
}

export async function deleteExercise(id: string): Promise<void> {
  const { error } = await createClient()
    .from('exercises')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting exercise:', error);
    throw error;
  }
}