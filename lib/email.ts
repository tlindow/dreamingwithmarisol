import type { DeliveryRecord } from './fulfillment'

export function downloadUrl(token: string) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5173'
  return `${site.replace(/\/$/, '')}/api/download/${token}`
}

export async function sendDownloadEmail(record: DeliveryRecord, productTitle: string) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || 'Dreaming with Marisól <onboarding@resend.dev>'
  const link = downloadUrl(record.token)
  if (!apiKey) {
    console.info('[email] RESEND_API_KEY is unset. Download link:', link)
    return { sent: false, link }
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [record.email],
      subject: `Your download: ${productTitle}`,
      text: `Thank you for your purchase.\n\n${productTitle}\n${link}\n\nThis link expires in 7 days and can be used 5 times.\n`,
    }),
  })
  if (!response.ok) {
    const detail = await response.text()
    console.error('[email] Resend error', response.status, detail)
    return { sent: false, link }
  }
  return { sent: true, link }
}
