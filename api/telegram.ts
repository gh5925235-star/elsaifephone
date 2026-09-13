export default async function handler(request: any, response: any) {
  try {
    // 1. التأكد إن الطلب POST
    if (request.method !== 'POST') {
      return response.status(405).json({ error: 'طريقة الطلب غير مسموح بها' });
    }

    // 2. قراءة البيانات بأمان عشان السيرفر ميكراشش
    let body = request.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    const message = body?.message || "طلب جديد أو بيانات غير مقروءة";

    // 3. قراءة متغيرات Vercel
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 4. كشف صريح لو المتغيرات ناقصة
    if (!token || !chatId) {
      return response.status(500).json({ 
        error: 'متغيرات تيليجرام غير موجودة في Vercel',
        isTokenFound: !!token,
        isChatIdFound: !!chatId
      });
    }

    // 5. إرسال الرسالة لتيليجرام
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
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
    
  } catch (error: any) {
    // التقاط أي عطل مفاجئ بدل الكراش
    return response.status(500).json({ error: 'عطل داخلي: ' + error.message });
  }
}
