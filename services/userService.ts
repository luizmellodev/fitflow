import { createClient } from "@/utils/supabase/client";

const supabase = createClient(); 

// UserService.ts
export const fetchProfile = async (userId: string) => {

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error(error.message);
    return null;
  }

  return profile;
};

export const updateProfile = async (userId: string, updates: { name?: string, role?: string }) => {

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);

  if (error) {
    console.error(error.message);
    return null;
  }

  return data;
};
