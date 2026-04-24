"use server";

import { Resend } from "resend";
import { env } from "@/lib/env";

const resend = new Resend(env.RESEND_API_KEY);

export type EmailPayload = {
  to: string;
  customerName: string;
  serviceName: string;
  barberName: string;
  date: string;   // "YYYY-MM-DD"
  time: string;   // "HH:MM"
  price: number;  // euro (bijv. 25.00)
  appointmentId: string;
};

function formatDateNL(dateStr: string): string {
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${dateStr}T12:00:00Z`));
}

function formatPrice(euros: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(euros);
}

function buildHtml({
  customerName,
  serviceName,
  barberName,
  date,
  time,
  price,
  appointmentId,
}: EmailPayload): string {
  const formattedDate = formatDateNL(date);
  const formattedPrice = formatPrice(price);
  const shortId = appointmentId.split("-")[0].toUpperCase();

  return /* html */ `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Afspraakbevestiging</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0"
               style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08);">

          <!-- Header -->
          <tr>
            <td style="background:#171717;padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">
                Kapper De Zaak
              </p>
              <p style="margin:8px 0 0;font-size:13px;color:#a3a3a3;">
                Afspraakbevestiging
              </p>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding:32px 40px 0;">
              <p style="margin:0;font-size:15px;color:#404040;line-height:1.6;">
                Hoi <strong>${customerName}</strong>,
              </p>
              <p style="margin:12px 0 0;font-size:15px;color:#404040;line-height:1.6;">
                Je afspraak is bevestigd. Tot dan!
              </p>
            </td>
          </tr>

          <!-- Details tabel -->
          <tr>
            <td style="padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="border:1px solid #e5e5e5;border-radius:12px;overflow:hidden;">
                <tr style="background:#fafafa;">
                  <td colspan="2" style="padding:14px 20px;border-bottom:1px solid #e5e5e5;">
                    <p style="margin:0;font-size:11px;font-weight:600;color:#a3a3a3;
                               letter-spacing:0.08em;text-transform:uppercase;">
                      Details
                    </p>
                  </td>
                </tr>
                ${detailRow("Behandeling", serviceName)}
                ${detailRow("Kapper", barberName)}
                ${detailRow("Datum", `<span style="text-transform:capitalize">${formattedDate}</span>`)}
                ${detailRow("Tijd", time)}
                ${detailRow("Prijs", `<strong>${formattedPrice}</strong>`)}
              </table>
            </td>
          </tr>

          <!-- Referentie -->
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="margin:0;font-size:12px;color:#a3a3a3;text-align:center;">
                Boekingsnummer:&nbsp;
                <span style="font-family:monospace;color:#737373;">#${shortId}</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;border-top:1px solid #e5e5e5;
                       padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a3a3a3;line-height:1.6;">
                Wil je afzeggen of wijzigen? Neem dan contact op.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function detailRow(label: string, value: string): string {
  return /* html */ `
    <tr style="border-bottom:1px solid #f0f0f0;">
      <td style="padding:12px 20px;font-size:13px;color:#737373;width:40%;">${label}</td>
      <td style="padding:12px 20px;font-size:13px;color:#171717;">${value}</td>
    </tr>`;
}

// ── Exporteer als fire-and-forget: gooien bij e-mailfout
//    mag de boeking niet blokkeren. Fouten worden gelogd. ──

export async function sendConfirmationEmail(payload: EmailPayload): Promise<void> {
  try {
    const { error } = await resend.emails.send({
      from: "Kapper De Zaak <bevestiging@kapperdeplaats.nl>",
      to: payload.to,
      subject: `Afspraakbevestiging – ${payload.serviceName} op ${payload.date}`,
      html: buildHtml(payload),
    });

    if (error) {
      console.error("[sendConfirmationEmail] Resend error:", error);
    }
  } catch (err) {
    console.error("[sendConfirmationEmail] Onverwachte fout:", err);
  }
}
