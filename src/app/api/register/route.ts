import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email/notifications";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, first_name, last_name, phone, role, referral_code } = body;

    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

    // 1. Register Auth Identity
    const authRes = await fetch(`${backendUrl}/auth/customer/emailpass/register`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(publishableKey && { "x-publishable-api-key": publishableKey })
      },
      body: JSON.stringify({ email, password }),
    });

    if (!authRes.ok) {
      const errorData = await authRes.json();
      return NextResponse.json({ error: errorData.message || "Failed to register auth identity" }, { status: authRes.status });
    }

    const authData = await authRes.json();
    const token = authData.token;

    // 2. Create the Customer record linking to the Auth Identity
    const customerRes = await fetch(`${backendUrl}/store/customers`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        ...(publishableKey && { "x-publishable-api-key": publishableKey })
      },
      body: JSON.stringify({
        email,
        first_name,
        last_name,
        phone,
        metadata: {
          role: role || "customer",
          is_ambassador: role === "ambassadeur",
          referral_code: referral_code || null
        }
      }),
    });

    if (!customerRes.ok) {
      const errorData = await customerRes.json();
      return NextResponse.json({ error: errorData.message || "Failed to create customer profile" }, { status: customerRes.status });
    }

    const customerData = await customerRes.json();
    const customerId = customerData.customer?.id;

    // 3. If registering as ambassador, create Ambassador + Wallet records in MLM module
    if (role === "ambassadeur" && customerId) {
      try {
        // Generate referral code: HELYA-FIRSTNAMEL format
        const generatedCode = referral_code 
          ? referral_code.toUpperCase() 
          : `HELYA-${(first_name || "AMB").toUpperCase()}${(last_name || "").charAt(0).toUpperCase()}`;

        await fetch(`${backendUrl}/store/ambassadors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...(publishableKey && { "x-publishable-api-key": publishableKey })
          },
          body: JSON.stringify({
            customer_id: customerId,
            referral_code: generatedCode,
            sponsor_referral_code: referral_code || null, // Used to link to sponsor
          }),
        });
      } catch (mlmError) {
        // Non-blocking: log but don't fail registration
        console.error("Failed to create MLM ambassador record:", mlmError);
      }
    }

    // 4. Email de bienvenue (non-bloquant)
    try {
      await sendWelcomeEmail(email, first_name || "");
    } catch (emailErr) {
      console.error("[register] Welcome email failed (non-blocking):", emailErr);
    }

    return NextResponse.json({ success: true, customer: customerData.customer, token });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

