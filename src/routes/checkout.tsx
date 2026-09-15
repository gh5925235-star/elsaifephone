import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useEffect, useState } from "react";
import { bhd } from "@/lib/products";
import { useStore } from "@/lib/store";
import { sendTelegram, sendTelegramPhoto } from "@/lib/store-types";
import benefitLogoAsset from "@/assets/benefit-logo.png.asset.json";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "إتمام الطلب والتقسيط | السيف للهواتف" },
      {
        name: "description",
        content:
          "احسب دفعتك الأولى وقسطك الشهري خلال ثوانٍ، ثم أكمل طلبك بالدفع المسبق أو الدفع عند الاستلام.",
      },
      { property: "og:title", content: "إتمام الطلب والتقسيط | السيف للهواتف" },
      {
        property: "og:description",
        content: "حاسبة أقساط فورية وإتمام طلب سريع مع توصيل خلال ١٢ ساعة.",
      },
    ],
  }),
  component: Checkout,
});

const governorates = ["العاصمة", "المحرق", "الشمالية", "الجنوبية"];

function Checkout() {
  const { items, total, saveSettings, settings, addOrder, updateOrder } = useStore();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gov, setGov] = useState(governorates[0]);
  const [area, setArea] = useState("");
  const [block, setBlock] = useState("");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");
  const [cpr, setCpr] = useState("");

  const [mode, setMode] = useState<"cash" | "installment">("installment");
  const [down, setDown] = useState("");
  const [months, setMonths] = useState(6);
  const [payOpen, setPayOpen] = useState(false);
  const [awaitingReview, setAwaitingReview] = useState(false);
useEffect(() => {
  const fetchLatestSettings = async () => {
    try {
      const res = await fetch('/api/get-settings');
      if (res.ok) {
        const data = await res.json();
        // تحديث الإعدادات في المتجر المحلي بالبيانات الجديدة من قاعدة البيانات
        saveSettings({
          ...settings,
          payNowUrl: data.payNowUrl || settings.payNowUrl,
          deliveryFeeUrl: data.deliveryFeeUrl || settings.deliveryFeeUrl,
          benefitUrl: data.benefitUrl || settings.benefitUrl,
          bankName: data.bankName || settings.bankName,
          accountName: data.accountName || settings.accountName,
          iban: data.iban || settings.iban,
          storePhone: data.storePhone || settings.storePhone,
          storeEmail: data.storeEmail || settings.storeEmail
        });
      }
    } catch (err) {
      console.error("خطأ في جلب الروابط الجديدة", err);
    }
  };
  
  fetchLatestSettings();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  
  const isCash = mode === "cash";
  const DELIVERY_FEE = 2;
  const cashTotal = total + DELIVERY_FEE;
  const downNum = Number(down) || 0;
  const remaining = Math.max(total - downNum, 0);
  const monthly = months > 0 ? remaining / months : remaining;

  const address = useMemo(
    () =>
      `محافظة ${gov}، منطقة ${area}، مجمع ${block}، شارع ${street}، مبنى/شقة ${building}`,
    [gov, area, block, street, building],
  );

  const device = items
    .map((i) => `${i.name} ${i.storage}${i.qty > 1 ? ` ×${i.qty}` : ""}`)
    .join(" + ");

  const cartColors = items
    .map((i) => i.color)
    .filter(Boolean)
    .join(" + ");
  const storages = items.map((i) => i.storage).join(" + ");

  function validate() {
    if (name.trim().length < 3) return "الرجاء إدخال الاسم الكامل";
    if (!/^3\d{7}$|^[36]\d{7}$/.test(phone.trim()))
      return "رقم واتساب بحريني غير صحيح (٨ أرقام)";
    if (!area.trim() || !block.trim() || !street.trim() || !building.trim())
      return "الرجاء إكمال بيانات العنوان";
    if (!isCash) {
      if (downNum < 50) return "الحد الأدنى للدفعة الأولى هو 50 د.ب";
      if (downNum > total)
        return "الدفعة الأولى لا يمكن أن تتجاوز إجمالي السعر";
    }
    return "";
  }

  const chosenColor = cartColors || "—";
  

  const supportDigits = (settings.storePhone || "").replace(/\D/g, "");
  const orderModeLabel = isCash ? "شراء نقداً كامل" : "طلب تقسيط شهري";
  const successAmount = isCash ? cashTotal : total;
  const whatsappMessage = orderId
    ? `مرحباً السيف للهواتف، قمت بإتمام طلبي عبر المتجر:\n\n- رقم الطلب: #${orderId}\n- الجهاز: ${device} (${storages} - ${chosenColor})\n- طريقة الدفع: ${orderModeLabel}\n- المبلغ: ${successAmount.toFixed(3)} د.ب\n\nأرجو تأكيد موعد التوصيل، شكراً لكم!`
    : "";
  const whatsappHref = supportDigits && whatsappMessage
    ? `https://wa.me/${supportDigits}?text=${encodeURIComponent(whatsappMessage)}`
    : "";

  /* Stage 1 — capture the application the moment the customer continues */
  function captureLead() {
    const order = addOrder({
      name,
      phone,
      cpr,
      address,
      device,
      storage: storages,
      color: chosenColor === "—" ? "" : chosenColor,
      total: isCash ? cashTotal : total,
      down: isCash ? cashTotal : downNum,
      months: isCash ? 0 : months,
      monthly: isCash ? 0 : monthly,
      method: isCash ? "شراء نقداً كامل" : "لم يتم الاختيار بعد",
      purchaseMode: mode,
    });
    updateOrder(order.id, { status: "بانتظار اختيار طريقة الدفع" });
       // إرسال الطلب لقاعدة البيانات في Supabase
    fetch('/api/database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: name,
        phone: phone,
        address: address,
        cart_items: `${device} - ${storages} - ${chosenColor}`,
        total_price: isCash ? cashTotal : total
      })
    }).catch(err => console.log(err));

    setOrderId(order.id);

    const purchaseLabel = isCash ? "شراء نقداً كامل" : "تقسيط شهري";
    void sendTelegram(
      settings,
      `🛒 *طلب جديد معلق / جديد*
• رقم الطلب: #${order.id}
• اسم العميل: ${name}
• الهاتف: +973 ${phone}
• نوع الشراء: ${purchaseLabel}
• الإجمالي: ${successAmountFor(order).toFixed(3)} د.ب`,
    );
  }

  function successAmountFor(o: { total: number }) {
    return o.total;
  }

  /* Cash — Benefit app link */
  function payBenefit() {
    if (orderId)
      updateOrder(orderId, {
        status: "بانتظار الدفع",
        method: "الدفع المقدم إلكتروني - عبر تطبيق بنفت",
      });
    void sendTelegram(
      settings,
      isCash
        ? `💰 *طلب دفع كامل*
• رقم الطلب: #${orderId ?? "—"}
• العميل: ${name}
• الإجمالي المدفوع: ${cashTotal.toFixed(3)} د.ب`
        : `💳 *اختيار الدفع الإلكتروني*
• رقم الطلب: #${orderId ?? "—"}
• العميل: ${name}
• المبلغ المطلوب دفعه مقدماً: ${downNum.toFixed(3)} د.ب`,
    );
    setPayOpen(false);
    window.open(settings.benefitPayUrl || settings.payNowUrl, "_blank");
  }

  /* Cash — IBAN transfer with receipt */
  function submitTransfer(receipt: string) {
    if (orderId)
      updateOrder(orderId, {
        status: "الدفع المقدم إلكتروني - تحويل بنكي بانتظار المراجعة",
        method: "الدفع المقدم إلكتروني - تحويل مصرفي (IBAN)",
        receiptImage: receipt,
      });
    const caption = `📎 *تم رفع إيصال تحويل بنكي جديد*
• رقم الطلب: #${orderId ?? "—"}
• العميل: ${name}
• الحالة: بانتظار مراجعة الإيصال واعتماده.`;
    void sendTelegram(settings, caption);
    void sendTelegramPhoto(settings, receipt, caption);
    setPayOpen(false);
    setAwaitingReview(true);
    setStep(3);
  }

  /* Stage 2 — payment action */
  function payNow() {
    if (orderId)
      updateOrder(orderId, {
        status: "بانتظار الدفع",
        method: "الدفع مقدماً",
      });
    void sendTelegram(
      settings,
      `💳 *اختيار الدفع الإلكتروني*
• رقم الطلب: #${orderId ?? "—"}
• العميل: ${name}
• المبلغ المطلوب دفعه مقدماً: ${downNum.toFixed(3)} د.ب`,
    );
    window.open(settings.payNowUrl, "_blank");
  }

  function payDelivery() {
    if (orderId)
      updateOrder(orderId, {
        status: "بانتظار الدفع",
        method: "الدفع عند الاستلام (رسوم دلمون 2 د.ب)",
      });
    void sendTelegram(
      settings,
      `🚚 *طلب دفع عند الاستلام + رسوم التوصيل*
• رقم الطلب: #${orderId ?? "—"}
• العميل: ${name}
• الإجمالي: ${total.toFixed(3)} د.ب`,
    );
    window.open(settings.deliveryFeeUrl, "_blank");
  }


  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-lg font-extrabold">سلتك فارغة</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          اختر جهازك المفضل ثم عد لإتمام الطلب.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
        >
          تصفح المتجر
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        {[1, 2].map((s) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold ${
                step >= s
                  ? "bg-gold-gradient text-primary-foreground"
                  : "bg-surface text-muted-foreground"
              }`}
            >
              {s}
            </span>
            <span className="text-xs font-bold">
              {s === 1
                ? isCash
                  ? "بيانات العميل"
                  : "البيانات والتقسيط"
                : "الملخص والدفع"}
            </span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h2 className="mb-3 text-sm font-extrabold">طريقة الشراء</h2>
            <div className="grid grid-cols-2 gap-2">
              {([
                { id: "cash", label: "شراء نقداً كامل" },
                { id: "installment", label: "طلب تقسيط شهري" },
              ] as const).map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setMode(m.id);
                    setError("");
                  }}
                  className={`rounded-xl border px-3 py-3 text-xs font-extrabold transition-colors ${
                    mode === m.id
                      ? "border-gold bg-accent text-accent-foreground"
                      : "border-border bg-surface text-muted-foreground"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h2 className="mb-4 text-sm font-extrabold">بيانات العميل</h2>
            <div className="space-y-3">
              <Field label="الاسم الكامل" value={name} onChange={setName} placeholder="مثال: أحمد علي" />
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-muted-foreground">
                  رقم الواتساب
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-input bg-card px-3">
                  <span className="text-sm font-bold text-muted-foreground">+973</span>
                  <input
                    value={phone}
                    inputMode="numeric"
                    maxLength={8}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="3XXXXXXX"
                    className="w-full bg-transparent py-2 text-sm outline-none"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-bold text-muted-foreground">المحافظة</span>
                <select
                  value={gov}
                  onChange={(e) => setGov(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm outline-none"
                >
                  {governorates.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <Field label="المنطقة" value={area} onChange={setArea} placeholder="الرفاع" />
                <Field label="المجمع" value={block} onChange={setBlock} placeholder="928" />
                <Field label="الشارع" value={street} onChange={setStreet} placeholder="2815" />
                <Field label="المبنى / الشقة" value={building} onChange={setBuilding} placeholder="1234 / 5" />
                <Field label="الرقم الشخصي (CPR)" value={cpr} onChange={setCpr} placeholder="اختياري" className="col-span-2" />
              </div>
            </div>
          </section>

          {isCash ? (
            <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h2 className="mb-4 text-sm font-extrabold">ملخص الشراء النقدي</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
                  <span className="text-muted-foreground">سعر الأجهزة</span>
                  <span className="font-extrabold">{bhd(total)}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
                  <span className="text-muted-foreground">رسوم التوصيل</span>
                  <span className="font-extrabold">{bhd(DELIVERY_FEE)}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-gold bg-accent px-4 py-3">
                  <span className="text-xs font-bold text-accent-foreground">
                    الإجمالي المطلوب
                  </span>
                  <span className="text-lg font-extrabold text-accent-foreground">
                    {bhd(cashTotal)}
                  </span>
                </div>
              </div>
            </section>
          ) : (
          <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h2 className="mb-4 text-sm font-extrabold">خطة التقسيط</h2>


            <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3 text-sm">
              <span className="text-muted-foreground">سعر الأجهزة نقداً</span>
              <span className="font-extrabold">{bhd(total)}</span>
            </div>

            <div className="mt-3 space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-muted-foreground">
                  الدفعة الأولى (د.ب) - أقل دفعة أولى 50 د.ب
                </span>
                <input
                  type="number"
                  min={50}
                  max={total}
                  value={down}
                  placeholder="0"
                  onChange={(e) => setDown(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm outline-none focus:border-gold"
                />
                {downNum > 0 && downNum < 50 && (
                  <p className="mt-1 text-xs font-bold text-destructive">
                    الحد الأدنى للدفعة الأولى هو 50 د.ب
                  </p>
                )}
              </label>

              <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3 text-sm">
                <span className="text-muted-foreground">المبلغ المتبقي</span>
                <span className="font-extrabold">{bhd(remaining)}</span>
              </div>

              <label className="block">
                <span className="mb-2 flex items-center justify-between text-xs font-bold text-muted-foreground">
                  <span>مدة الأقساط</span>
                  <span className="text-foreground">{months} شهر</span>
                </span>
                <input
                  type="range"
                  min={1}
                  max={24}
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full accent-[oklch(0.741_0.093_82.6)]"
                />
              </label>

              <div className="rounded-2xl border border-gold bg-accent p-4 text-center">
                <p className="text-xs font-bold text-accent-foreground">القسط الشهري</p>
                <p className="mt-1 text-2xl font-extrabold text-accent-foreground">
                  {bhd(monthly)}
                </p>
              </div>
            </div>
          </section>
          )}

          {error && <p className="text-center text-xs font-bold text-destructive">{error}</p>}

          <button
            onClick={() => {
              const e = validate();
              setError(e);
              if (!e) {
                if (!orderId) captureLead();
                setStep(2);
              }
            }}
            className="w-full rounded-xl bg-gold-gradient py-3 text-sm font-extrabold text-primary-foreground shadow-soft transition-opacity hover:opacity-90"
          >
            متابعة ➔
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4 duration-300">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h2 className="mb-4 text-sm font-extrabold">ملخص الطلب</h2>
            <dl className="space-y-2 text-xs">
              <Row k="الاسم" v={name} />
              <Row k="الهاتف" v={`+973 ${phone}`} />
              <Row k="العنوان" v={address} />
              <Row k="الجهاز" v={device} />
              {isCash ? (
                <>
                  <Row k="نوع الشراء" v="شراء نقداً كامل" />
                  <Row k="سعر الأجهزة" v={bhd(total)} />
                  <Row k="رسوم التوصيل" v={bhd(DELIVERY_FEE)} />
                  <Row k="الإجمالي المطلوب" v={bhd(cashTotal)} strong />
                </>
              ) : (
                <>
                  <Row k="إجمالي المبلغ" v={bhd(total)} />
                  <Row k="الدفعة الأولى" v={bhd(downNum)} />
                  <Row k="مدة الأقساط" v={`${months} شهر`} />
                  <Row k="القسط الشهري" v={bhd(monthly)} strong />
                </>
              )}
            </dl>
          </section>


          {isCash && (
            <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="text-sm font-extrabold">إتمام الدفع</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                اختر طريقة الدفع المناسبة لك لإتمام الشراء النقدي.
              </p>
              <button
                onClick={() => setPayOpen(true)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gold-gradient py-3.5 text-sm font-extrabold text-primary-foreground shadow-soft"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                  <img
                    src={benefitLogoAsset.url}
                    alt="Benefit"
                    className="h-full w-full object-contain p-0.5"
                  />
                </span>
                ادفع الآن عبر BenefitPay
              </button>
            </section>
          )}

          {!isCash && (
          <>
          <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h3 className="text-sm font-extrabold">الدفع مقدماً الآن</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              سدّد الدفعة الأولى مباشرة عبر بوابة الدفع الآمنة.
            </p>
            <button
              onClick={payNow}
              className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-extrabold text-primary-foreground"
            >
              ادفع الآن 💳
            </button>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h3 className="text-sm font-extrabold">الدفع عند الاستلام</h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              رسوم التوصيل السريع لصالح دلمون إكسبريس (توصيل خلال 3 ساعات من دفع رسوم التوصيل) بقيمة{" "}
              <strong className="text-foreground">2.000 د.ب فقط</strong>، ويتم سداد الدفعة
              الأولى وتوقيع العقد عند المعاينة والاستلام عند باب منزلك.
            </p>
            <button
              onClick={payDelivery}
              className="mt-4 w-full rounded-xl bg-gold-gradient py-3 text-sm font-extrabold text-primary-foreground"
            >
              دفع رسوم التوصيل (2.000 د.ب) لصالح دلمون إكسبريس 🚚
            </button>
          </section>
          </>
          )}

          <button
            onClick={() => setStep(1)}
            className="w-full rounded-xl border border-border bg-surface py-3 text-xs font-bold text-muted-foreground"
          >
            ← تعديل البيانات
          </button>
        </div>
      )}

      {step === 3 && (
        <SuccessScreen
          orderId={orderId || ""}
          device={device}
          storage={storages}
          color={chosenColor}
          mode={mode}
          amount={successAmount}
          whatsappHref={whatsappHref}
          pendingReview={awaitingReview}
        />
      )}

      {payOpen && (
        <PaymentModal
          settings={settings}
          amount={cashTotal}
          onClose={() => setPayOpen(false)}
          onBenefit={payBenefit}
          onTransfer={submitTransfer}
        />
      )}
    </div>
  );
}

function PaymentModal({
  settings,
  amount,
  onClose,
  onBenefit,
  onTransfer,
}: {
  settings: { bankName: string; accountName: string; iban: string };
  amount: number;
  onClose: () => void;
  onBenefit: () => void;
  onTransfer: (receipt: string) => void;
}) {
  const [method, setMethod] = useState<"benefit" | "iban" | null>(null);
  const [receipt, setReceipt] = useState("");
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState("");

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-primary/50 p-4 backdrop-blur-sm">
      <div className="mx-auto mt-6 max-w-md space-y-4 rounded-3xl border border-gold bg-card p-5 shadow-lift">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold">اختر طريقة الدفع</h3>
          <button
            onClick={onClose}
            className="rounded-full border border-border px-3 py-1 text-xs font-bold text-muted-foreground"
          >
            إغلاق ✕
          </button>
        </div>
        <p className="rounded-xl bg-surface px-4 py-3 text-center text-sm font-extrabold">
          المبلغ المطلوب: {bhd(amount)}
        </p>

        {method === null && (
          <div className="space-y-3">
            <button
              onClick={() => setMethod("benefit")}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-right transition-colors hover:bg-accent"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                <img
                  src={benefitLogoAsset.url}
                  alt="Benefit"
                  className="h-full w-full object-contain p-0.5"
                />
              </span>
              <div>
                <h4 className="text-xs font-extrabold">رابط دفع إلكتروني / BenefitPay</h4>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  الدفع الفوري عبر تطبيق بنفت
                </p>
              </div>
            </button>

            <button
              onClick={() => setMethod("iban")}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-right transition-colors hover:bg-accent"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-lg">
                🏦
              </span>
              <div>
                <h4 className="text-xs font-extrabold">تحويل بنكي / إيداع على الآيبان (IBAN)</h4>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  تحويل يدوي ثم رفع إيصال التحويل
                </p>
              </div>
            </button>
          </div>
        )}

        {method === "benefit" && (
          <section className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                <img
                  src={benefitLogoAsset.url}
                  alt="Benefit"
                  className="h-full w-full object-contain p-0.5"
                />
              </span>
              <h4 className="text-xs font-extrabold">الدفع عبر تطبيق بنفت (Benefit App)</h4>
            </div>
            <button
              onClick={onBenefit}
              className="mt-3 w-full rounded-xl bg-primary py-3 text-xs font-extrabold text-primary-foreground"
            >
              فتح رابط الدفع المباشر
            </button>
            <button
              onClick={() => setMethod(null)}
              className="mt-2 w-full rounded-xl border border-border py-2 text-xs font-bold text-muted-foreground"
            >
              ← العودة لطرق الدفع
            </button>
          </section>
        )}

        {method === "iban" && (
          <section className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-lg">
                🏦
              </span>
              <h4 className="text-xs font-extrabold">الدفع عبر التحويل المصرفي (IBAN)</h4>
            </div>

            <dl className="mt-3 space-y-2 text-xs">
              <Row k="اسم البنك" v={settings.bankName || "—"} />
              <Row k="اسم صاحب الحساب" v={settings.accountName || "—"} />
              <Row k="رقم الآيبان" v={settings.iban || "—"} />
            </dl>

            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(settings.iban);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  setErr("تعذّر نسخ الآيبان، انسخه يدوياً");
                }
              }}
              className="mt-3 w-full rounded-xl border border-gold bg-accent py-2.5 text-xs font-extrabold text-accent-foreground"
            >
              {copied ? "تم النسخ ✓" : "نسخ الآيبان"}
            </button>

            <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gold bg-card p-3">
              {receipt ? (
                <img src={receipt} alt="الإيصال" className="h-14 w-14 rounded-lg object-contain" />
              ) : (
                <span className="grid h-12 w-12 place-items-center rounded-lg bg-surface text-lg">
                  📷
                </span>
              )}
              <span className="text-[11px] font-bold text-muted-foreground">
                ارفع إيصال / صورة التحويل المصرفي (JPG / PNG)
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    setReceipt(String(reader.result));
                    setErr("");
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>

            {err && <p className="mt-2 text-center text-xs font-bold text-destructive">{err}</p>}

            <button
              onClick={() => {
                if (!receipt) {
                  setErr("الرجاء رفع صورة إيصال التحويل أولاً");
                  return;
                }
                onTransfer(receipt);
              }}
              className="mt-3 w-full rounded-xl bg-gold-gradient py-3 text-xs font-extrabold text-primary-foreground"
            >
              تأكيد الطلب وإرسال الإيصال
            </button>
            <button
              onClick={() => setMethod(null)}
              className="mt-2 w-full rounded-xl border border-border py-2 text-xs font-bold text-muted-foreground"
            >
              ← العودة لطرق الدفع
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

function SuccessScreen({
  orderId,
  device,
  storage,
  color,
  mode,
  amount,
  whatsappHref,
  pendingReview,
}: {
  orderId: string;
  device: string;
  storage: string;
  color: string;
  mode: "cash" | "installment";
  amount: number;
  whatsappHref: string;
  pendingReview?: boolean;
}) {
  return (
    <div className="animate-in fade-in zoom-in space-y-4 duration-300">
      <div className="rounded-2xl border border-gold bg-card p-8 text-center shadow-soft">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-gradient shadow-soft">
          <svg
            className="h-8 w-8 text-primary-foreground"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2 className="mt-5 text-lg font-extrabold">
          {pendingReview
            ? "تم استلام طلبك — بانتظار تأكيد الدفع"
            : "تم استلام طلبك بنجاح!"}
        </h2>
        {pendingReview && (
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            سيتم اعتماد الطلب فور التحقق من عملية الدفع من قبل الإدارة.
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">رقم الطلب</p>
        <p className="text-2xl font-extrabold text-burgundy">#{orderId}</p>

        <div className="mt-5 space-y-2 rounded-xl bg-surface p-4 text-right text-xs">
          <Row k="الجهاز" v={device} />
          <Row k="السعة" v={storage} />
          <Row k="اللون" v={color} />
          <Row k="طريقة الشراء" v={mode === "cash" ? "شراء نقداً كامل" : "طلب تقسيط شهري"} />
          <Row k="المبلغ" v={`${amount.toFixed(3)} د.ب`} strong />
        </div>
      </div>

      {whatsappHref ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#C5A880] bg-[#FBF5EB] py-3.5 text-sm font-extrabold text-[#6B4F35] shadow-soft transition-transform hover:scale-[1.02]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="#6B4F35"
            aria-hidden="true"
          >
            <path d="M12 2a9.9 9.9 0 0 0-8.55 14.92L2 22l5.24-1.37A9.94 9.94 0 1 0 12 2Zm0 1.8a8.14 8.14 0 1 1-4.15 15.15l-.3-.18-3.07.8.82-3-.2-.31A8.14 8.14 0 0 1 12 3.8Zm-3.2 4.15c-.18 0-.47.07-.72.34-.24.27-.94.92-.94 2.25s.97 2.6 1.1 2.78c.13.18 1.88 3 4.66 4.1 2.31.91 2.78.73 3.28.68.5-.05 1.62-.66 1.85-1.3.23-.64.23-1.19.16-1.3-.07-.12-.25-.19-.53-.32l-1.85-.86c-.25-.12-.44-.18-.63.07-.18.25-.72.86-.88 1.04-.16.18-.32.2-.6.07a7.5 7.5 0 0 1-2.2-1.36 8.3 8.3 0 0 1-1.52-1.9c-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.46.09-.18.05-.34-.02-.48l-.84-2.03c-.21-.5-.43-.5-.6-.5Z" />
          </svg>
          متابعة حالة الطلب فوراً عبر واتساب
        </a>
      ) : (
        <p className="text-center text-xs font-bold text-muted-foreground">
          لم يتم حفظ رقم واتساب الدعم بعد.
        </p>
      )}

      <Link
        to="/"
        className="block w-full rounded-xl border border-border bg-surface py-3 text-center text-xs font-bold text-muted-foreground transition-colors hover:bg-accent"
      >
        العودة للمتجر
      </Link>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className || ""}`}>
      <span className="mb-1 block text-xs font-bold text-muted-foreground">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        maxLength={120}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm outline-none focus:border-gold"
      />
    </label>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-2 last:border-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className={`text-left ${strong ? "text-sm font-extrabold text-burgundy" : "font-bold"}`}>
        {v}
      </dd>
    </div>
  );
}
