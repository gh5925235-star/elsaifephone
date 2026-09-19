export default async function handler(request: any, response: any) {
  try {
    if (request.method !== 'POST') {
      return response.status(405).json({ error: 'طريقة الطلب غير مسموح بها' });
    }

    let body = request.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    
    // استلام البيانات من الموقع
    const { customer_name, phone, address, cart_items, total_price, down_payment, monthly_installment, months_count, purchase_type } = request.body;

    // قراءة مفاتيح Vercel
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return response.status(500).json({ error: 'مفاتيح قاعدة البيانات غير موجودة في Vercel' });
    }

    // تجهيز المنتجات عشان تتحفظ كنص بدون أخطاء
    let itemsToSave = cart_items;
    if (typeof cart_items === 'object') {
      itemsToSave = JSON.stringify(cart_items);
    }

    // اسم الجدول زي ما ظهر في الصورة بتاعتك بالظبط
    const tableName = 'elsaifephone-orders';
    const url = `${supabaseUrl}/rest/v1/${tableName}`;

    // إرسال البيانات لقاعدة البيانات
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
    customer_name: customer_name || "غير محدد",
    phone: phone || "غير محدد",
    address: address || "غير محدد",
    cart_items: itemsToSave || "لا يوجد",
    total_price: total_price || "0",
    
    // الحقول الجديدة اللي ضفناها في Supabase:
    down_payment: down_payment || 0,
    monthly_installment: monthly_installment || 0,
    months_count: months_count || 0,
    purchase_type: purchase_type || "الدفع المقدم إلكتروني"
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

