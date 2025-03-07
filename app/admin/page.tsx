import { GymSchedule } from "@/components/project/gym-schedule";
import { Layout } from "@/components/project/layout";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  return (
    <Layout>
      <GymSchedule />
    </Layout>
  );
}
