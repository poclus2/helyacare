import { auth } from "@/auth";
import ParametresClient from "@/components/espace-client/ParametresClient";

export default async function ParametresPage() {
  const session = await auth();
  const token = session?.medusa_token as string;
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

  let customer = {
    id: (session?.customer_id as string) || "",
    first_name: ((session as any)?.first_name as string) || "",
    last_name: "",
    email: "",
    phone: "",
  };

  // Fetch full customer profile from Medusa
  if (token) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/customers/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          ...(publishableKey && { "x-publishable-api-key": publishableKey }),
        },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        const c = data.customer;
        customer = {
          id: c.id || customer.id,
          first_name: c.first_name || customer.first_name,
          last_name: c.last_name || "",
          email: c.email || "",
          phone: c.phone || "",
        };
      }
    } catch (e) {
      console.error("Failed to fetch customer profile:", e);
    }
  }

  return <ParametresClient customer={customer} token={token} />;
}
