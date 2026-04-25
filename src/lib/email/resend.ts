/**
 * HelyaCare — EmailProvider (Resend)
 * Adapté de MakoPay/src/modules/notifications/providers/email.provider.ts
 *
 * Provider central pour tous les emails transactionnels.
 * Utilisable côté serveur uniquement (API Routes, Server Actions).
 */

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
  dev_mode?: boolean;
}

/**
 * Envoie un email via Resend.
 * En mode dev (clé placeholder), log seulement sans envoyer.
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "HelyaCare <commandes@helyacare.com>";

  // Mode développement — clé non configurée
  if (!apiKey || apiKey.startsWith("re_XXXX")) {
    console.log(`[Email - DEV] Simulating send to ${to} | Subject: ${subject}`);
    return { success: true, dev_mode: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[Email] Resend error:", data);
      return { success: false, error: data.message || "Erreur Resend" };
    }

    console.log(`[Email] Sent to ${to} — ID: ${data.id}`);
    return { success: true, id: data.id };
  } catch (err: any) {
    console.error("[Email] Network error:", err.message);
    return { success: false, error: err.message };
  }
}
