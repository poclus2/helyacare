import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email/notifications";

/**
 * POST /api/email/welcome
 * Envoie un email de bienvenue au nouveau client/ambassadeur.
 * Appelé depuis /api/register après création du compte Medusa.
 *
 * Body: { to: string, firstName: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, firstName } = body;

    if (!to || !firstName) {
      return NextResponse.json(
        { error: "to et firstName sont requis" },
        { status: 400 }
      );
    }

    const result = await sendWelcomeEmail(to, firstName);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      email_id: result.id,
      dev_mode: result.dev_mode,
    });
  } catch (err: any) {
    console.error("[email/welcome]", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
