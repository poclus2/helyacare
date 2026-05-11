import CustomerDashboard from "@/components/espace-client/CustomerDashboard";
import AmbassadorBoutique from "@/components/espace-client/AmbassadorBoutique";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function EspaceClientOverviewPage() {
  const session = await auth();
  const token = session?.medusa_token as string;
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";
  const role = (session?.role as string) || "customer";

  if (role === "ambassadeur") {
    return <AmbassadorBoutique />;
  }

  let orders: any[] = [];
  
  if (token) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/orders`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          ...(publishableKey && { "x-publishable-api-key": publishableKey })
        },
        cache: "no-store", 
      });
      if (res.ok) {
        const data = await res.json();
        orders = data.orders || [];
      }
    } catch (e) {
      console.error("Failed to fetch orders:", e);
    }
  }

  return (
    <CustomerDashboard orders={orders} />
  );
}

