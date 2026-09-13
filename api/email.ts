// api/email.ts
import { Resend } from 'resend';

// قراءة المفتاح السري من Vercel
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'الطريقة غير مسموحة' });
  }

  const { to, subject, html } = request.body;

  try {
    const data = await resend.emails.send({
      from: 'Store <onboarding@resend.dev>', // يمكنك تغييره لاحقاً إلى الدومين الرسمي الخاص بك
      to: [to],
      subject: subject,
      html: html,
    });

    return response.status(200).json({ success: true, data });
  } catch (error) {
    return response.status(500).json({ error: 'فشل إرسال الإيميل' });
  }
}
