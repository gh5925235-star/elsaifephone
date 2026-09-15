export default async function handler(request: any, response: any) {
  try {
    if (request.method !== 'GET') {
      return response.status(405).json({ error: 'طريقة الطلب غير مسموح بها' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return response.status(500).json({ error: 'مفاتيح قاعدة البيانات غير موجودة' });
    }

    const tableName = 'store_settings';
    const url = `${supabaseUrl}/rest/v1/${tableName}?id=eq.1&select=*`;

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
      if (data && data.length > 0) {
        return response.status(200).json(data[0]); 
      } else {
        return response.status(404).json({ error: 'لم يتم العثور على إعدادات' });
      }
    } else {
      return response.status(400).json({ error: 'فشل في جلب البيانات' });
    }
  } catch (error: any) {
    return response.status(500).json({ error: 'عطل داخلي: ' + error.message });
  }
}
