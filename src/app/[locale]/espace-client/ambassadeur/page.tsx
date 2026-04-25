import { auth } from "@/auth";
import { redirect } from "next/navigation";
import WithdrawPanel from "@/components/espace-client/WithdrawPanel";

export default async function AmbassadeurDashboardPage() {
  const session = await auth();

  if (!session?.medusa_token) redirect("/connexion");
  if ((session.role as string) !== "ambassadeur") redirect("/espace-client");

  const token = session.medusa_token as string;

  return <WithdrawPanel token={token} />;
}
