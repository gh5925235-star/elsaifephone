export default async function handler(request: any, response: any) {
  try {
    if (request.method !== 'POST') {
      return response.status(405).json({ error: 'طريقة الطلب غير مسموح بها' });
    }

    let body = request.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    // قراءة مفاتيح Vercel
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return response.status(500).json({ error: 'مفاتيح قاعدة البيانات غير موجودة في Vercel' });
    }

    // اسم جدول الإعدادات ورابط التعديل (بنعدل الصف رقم 1 فقط)
    const tableName = 'store_settings';
    const url = `${supabaseUrl}/rest/v1/${tableName}?id=eq.1`;

    // إرسال التحديث لقاعدة البيانات (نستخدم PATCH للتعديل)
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        payNowUrl: body.payNowUrl,
        deliveryFeeUrl: body.deliveryFeeUrl,
        benefitUrl: body.benefitUrl,
        bankName: body.bankName,
        accountName: body.accountName,
        iban: body.iban,
        storePhone: body.storePhone,
        storeEmail: body.storeEmail
      })
    });

    if (res.ok) {
      return response.status(200).json({ success: true });
    } else {
      const errorData = await res.json();
      return response.status(400).json({ error: 'فشل في الحفظ: ' + JSON.stringify(errorData) });
    }
  } catch (error: any) {
    return response.status(500).json({ error: 'عطل داخلي: ' + error.message });
  }
}
