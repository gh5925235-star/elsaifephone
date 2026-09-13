// api/telegram.ts
export default async function handler(request: any, response: any) {
  // التأكد من أن الطلب من نوع POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'الطريقة غير مسموحة' });
  }

  const { message } = request.body;
  
  // قراءة المتغيرات السرية من بيئة Vercel
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return response.status(500).json({ error: 'إعدادات تيليجرام غير مكتملة في السيرفر' });
  }

  try {
    const url = https://api.telegram.org/bot${token}/sendMessage;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    const data = await res.json();
    if (data.ok) {
      return response.status(200).json({ success: true });
    } else {
      return response.status(400).json({ error: data.description });
    }
  } catch (error) {
    return response.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
}
