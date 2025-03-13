import { Layout } from "@/components/project/layout";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { GymSchedule } from "@/components/project/GymSchedule";

export default async function AdminPage() {
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
