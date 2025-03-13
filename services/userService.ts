import { User } from '@/models/user';
import { createClient } from '@/utils/supabase/client';

export async function getUsers(): Promise<User[]> {
  const { data, error } = await createClient()
    .from('users')
    .select('id, name')

    console.log('Fetched users:', data);

  if (error) {
    console.error('Error fetching users:', error)
    return []
  }

  return data
}

export async function createUser(name: string): Promise<User> {
  const { data, error } = await createClient()
    .from('users')
    .insert({ name })
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }

  return data;
}

export async function updateUser(id: string, name: string): Promise<User> {
  const { data, error } = await createClient()
    .from('users')
    .update({ name })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating user:', error);
    throw error;
  }

  return data;
}

export async function deleteUser(id: string): Promise<void> {
  const { error } = await createClient()
    .from('users')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}