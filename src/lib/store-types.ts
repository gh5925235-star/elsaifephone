import type { Category } from "./products";

export type CartItem = {
  key: string;
  id: string;
  name: string;
  storage: string;
  color?: string | undefined;
  price: number;
  image: string;
  qty: number;
};

export type AdminSettings = {
  payNowUrl: string;
  deliveryFeeUrl: string;
  benefitPayUrl: string;
  bankName: string;
  accountName: string;
  iban: string;
  storePhone: string;
  storeEmail: string;
  telegramToken: string;
  telegramChatId: string;
  emailjsServiceId: string;
  emailjsTemplateId: string;
  emailjsPublicKey: string;
  globalDiscount: number;
};

export function discountedPrice(price: number, discount: number) {
  const d = Number.isFinite(discount) ? Math.min(Math.max(discount, 0), 100) : 0;
  if (d <= 0) return price;
  return Math.round(price * (1 - d / 100) * 1000) / 1000;
}

export type AppUser = { email: string; name?: string };

export type OrderStatus =
  | "جديد"
  | "بانتظار اختيار طريقة الدفع"
  | "بانتظار الدفع"
  | "بانتظار تأكيد الدفع من الإدارة"
  | "تم الضغط على رابط الدفع المسبق"
  | "دفع عند الاستلام - تم الانتقال لرسوم دلمون"
  | "قيد التدقيق"
  | "بانتظار التوقيع"
  | "الدفع المقدم إلكتروني - توجه لرابط بنفت"
  | "الدفع المقدم إلكتروني - تحويل بنكي بانتظار المراجعة"
  | "تم التسليم"
  | "ملغي";

export const orderStatuses: OrderStatus[] = [
  "جديد",
  "بانتظار اختيار طريقة الدفع",
  "بانتظار الدفع",
  "بانتظار تأكيد الدفع من الإدارة",
  "تم الضغط على رابط الدفع المسبق",
  "دفع عند الاستلام - تم الانتقال لرسوم دلمون",
  "قيد التدقيق",
  "بانتظار التوقيع",
  "الدفع المقدم إلكتروني - توجه لرابط بنفت",
  "الدفع المقدم إلكتروني - تحويل بنكي بانتظار المراجعة",
  "تم التسليم",
  "ملغي",
];

export function displayOrderStatus(status: string): string {
  return status
    .replace("كاش - توجه لرابط بنفت", "الدفع المقدم إلكتروني - توجه لرابط بنفت")
    .replace("كاش - تحويل بنكي بانتظار المراجعة", "الدفع المقدم إلكتروني - تحويل بنكي بانتظار المراجعة");
}

export function displayOrderMethod(method: string): string {
  return method
    .replace("كاش - الدفع عبر تطبيق بنفت", "الدفع المقدم إلكتروني - عبر تطبيق بنفت")
    .replace("كاش - تحويل مصرفي (IBAN)", "الدفع المقدم إلكتروني - تحويل مصرفي (IBAN)");
}

export type Order = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  cpr: string;
  address: string;
  device: string;
  storage: string;
  color: string;
  total: number;
  down: number;
  months: number;
  monthly: number;
  method: string;
  status: OrderStatus;
  purchaseMode?: "cash" | "installment";
  receiptImage?: string;
  /** تاريخ استحقاق أول قسط (YYYY-MM-DD) */
  firstInstallmentDate?: string;
};

export type StoreFilter = { category: Category | "all"; query: string; label: string };

export type TelegramResult = { ok: boolean; error?: string };

export async function sendTelegram(
  settings: AdminSettings, // إحنا مش هنستخدمها هنا، بس هنسيبها عشان الكود في باقي الملفات مايضربش
  message: string,
): Promise<TelegramResult> {
  try {
    // هنا بنبعت الطلب للـ API بتاعنا في Vercel بدل تيليجرام مباشرة
    const res = await fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }), 
    });

    const data = await res.json();

    if (res.ok && data.success) {
      return { ok: true };
    } else {
      return { ok: false, error: data.error || 'حدث خطأ غير معروف' };
    }
  } catch (err) {
    return { ok: false, error: 'فشل الاتصال بالسيرفر' };
  }
}


/** Sends a receipt image (data URL) to Telegram with a caption. */
export async function sendTelegramPhoto(
  settings: AdminSettings,
  dataUrl: string,
  caption: string,
) {
  if (!settings.telegramToken || !settings.telegramChatId) return;
  try {
    const blob = await (await fetch(dataUrl)).blob();
    const form = new FormData();
    form.append("chat_id", settings.telegramChatId);
    form.append("caption", caption.slice(0, 1000));
    form.append("photo", blob, "receipt.jpg");
    await fetch(`https://api.telegram.org/bot${settings.telegramToken}/sendPhoto`, {
      method: "POST",
      body: form,
    });
  } catch {
    /* silent background notification */
  }
}
