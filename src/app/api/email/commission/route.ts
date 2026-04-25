import { NextResponse } from "next/server";
import { sendCommissionEmail } from "@/lib/email/notifications";

/**
 * POST /api/email/commission
 * Notifie un ambassadeur qu'une commission vient d'être créditée.
 * Appelé depuis le workflow MLM (backend Medusa subscriber) ou manuellement.
 *
 * Body: {
 *   to: string,
 *   firstName: string,
 *   amount: number,
 *   currency?: string,
 *   level: number,
 *   referralName: string
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      to,
      firstName,
      amount,
      currency = "XOF",
      level,
      referralName,
    } = body;

    if (!to || !firstName || !amount || !level || !referralName) {
      return NextResponse.json(
        { error: "to, firstName, amount, level et referralName sont requis" },
        { status: 400 }
      );
    }

    const result = await sendCommissionEmail(
      to,
      firstName,
      Number(amount),
      currency,
      Number(level),
      referralName
    );

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
    console.error("[email/commission]", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
