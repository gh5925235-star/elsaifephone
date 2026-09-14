export default async function handler(request: any, response: any) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return response.status(500).json({ error: 'المفاتيح غير موجودة' });
    }

    // هنجيب البيانات من الجدول بتاعك ونرتبها من الأحدث للأقدم
    const url = `${supabaseUrl}/rest/v1/elsaifephone-orders?select=*&order=id.desc`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.ok) {
      const data = await res.json();
      return response.status(200).json(data);
    } else {
      return response.status(400).json({ error: 'فشل في جلب البيانات' });
    }
  } catch (error: any) {
    return response.status(500).json({ error: error.message });
  }
}

