import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {

  useStore,
  type AdminSettings,
  type Order,
  type OrderStatus,
} from "@/lib/store";
import {
  displayOrderMethod,
  displayOrderStatus,
  orderStatuses,
  sendTelegram,
} from "@/lib/store-types";
import {
  bhd,
  type Category,
  type ColorOption,
  type Product,
} from "@/lib/products";
import { PrintModal, type DocType } from "@/components/admin/PrintDocs";

function ImageUpload({
  value,
  onChange,
  compact,
}: {
  value: string;
  onChange: (dataUrl: string) => void;
  compact?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gold bg-surface p-2 transition-colors hover:bg-accent">
      {value ? (
        <img
          src={value}
          alt="معاينة"
          className={`rounded-lg bg-card object-contain ${compact ? "h-10 w-10" : "h-14 w-14"}`}
        />
      ) : (
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-card text-lg">
          📷
        </span>
      )}
      <span className="text-[11px] font-bold text-muted-foreground">
        اضغط لاختيار صورة من جهازك 📷
      </span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => onChange(String(reader.result));
          reader.readAsDataURL(file);
        }}
      />
    </label>
  );
}

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة تحكم الإدارة | السيف للهواتف" },
      { name: "description", content: "إدارة الطلبات والمنتجات وإعدادات متجر السيف للهواتف." },
      { property: "og:title", content: "لوحة تحكم الإدارة | السيف للهواتف" },
      { property: "og:description", content: "إدارة الطلبات والمنتجات والإعدادات." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { isAdmin } = useStore();
  return isAdmin ? <Dashboard /> : <LoginGate />;
}

/* ---------------- Login ---------------- */

function LoginGate() {
  const { login } = useStore();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-3xl border border-border bg-card p-7 shadow-lift">
        <h1 className="text-center text-lg font-extrabold">
          تسجيل دخول الإدارة | <span className="text-gold-gradient">السيف للهواتف</span> 👑
        </h1>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          هذه المنطقة مخصصة لفريق الإدارة فقط.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (login(u, p)) setErr("");
            else setErr("بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى");
          }}
        >
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-muted-foreground">
              اسم المستخدم
            </span>
            <input
              value={u}
              onChange={(e) => setU(e.target.value)}
              autoComplete="username"
              className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-bold text-muted-foreground">
              كلمة المرور
            </span>
            <div className="flex items-center gap-2 rounded-xl border border-input bg-card px-3">
              <input
                value={p}
                type={show ? "text" : "password"}
                onChange={(e) => setP(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-transparent py-2 text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                className="text-sm"
              >
                {show ? "🙈" : "👁️"}
              </button>
            </div>
          </label>

          {err && (
            <div className="rounded-xl border border-destructive bg-destructive/10 px-4 py-3 text-center text-xs font-bold text-destructive">
              {err}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-gold-gradient py-3 text-sm font-extrabold text-primary-foreground shadow-soft transition-opacity hover:opacity-90"
          >
            تسجيل الدخول إلى لوحة التحكم ➔
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */

type Tab = "orders" | "products" | "settings";

function Dashboard() {
  const { logout } = useStore();
  const [tab, setTab] = useState<Tab>("orders");

  const tabs: { id: Tab; label: string }[] = [
    { id: "orders", label: "📦 الطلبات والعملاء" },
    { id: "products", label: "📱 المنتجات والمخزون" },
    { id: "settings", label: "⚙️ الروابط وتيليجرام" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-extrabold">
          لوحة تحكم <span className="text-gold-gradient">السيف للهواتف</span> 👑
        </h1>
        <button
          onClick={logout}
          className="rounded-xl border border-destructive px-4 py-2 text-xs font-bold text-destructive transition-colors hover:bg-destructive/10"
        >
          تسجيل الخروج ⎋
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
              tab === t.id
                ? "border-gold bg-accent text-accent-foreground"
                : "border-border bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "orders" && <OrdersTab />}
        {tab === "products" && <ProductsTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}

/* ---------------- Tab 1: Orders ---------------- */

const docButtons: { type: DocType; label: string }[] = [
  { type: "invoice", label: "📄 فاتورة" },
  { type: "contract", label: "📜 طباعة العقد" },
  { type: "receipt", label: "🧾 سند قبض" },
  { type: "manifest", label: "🚚 بوليصة دلمون" },
  { type: "schedule", label: "📅 جدول الأقساط" },
];

function waLink(o: Order) {
  const text = `👑 مرحباً ${o.name}، شكراً لطلبك من السيف للهواتف!

📱 الجهاز: ${o.device} ${o.storage}${o.color ? ` - ${o.color}` : ""}
💰 إجمالي المبلغ: ${o.total.toFixed(3)} د.ب
💵 الدفعة الأولى: ${o.down.toFixed(3)} د.ب
📅 مدة الأقساط: ${o.months} شهر
💳 القسط الشهري: ${o.monthly.toFixed(3)} د.ب
🚚 طريقة الدفع: ${displayOrderMethod(o.method)}

رقم الطلب: SAIF-${o.id}`;
  return `https://wa.me/973${o.phone}?text=${encodeURIComponent(text)}`;
}

function OrdersTab() {
  // شلنا كلمة orders القديمة عشان هنجيبها من الداتا بيز الجديدة
  const { updateOrder, deleteOrder } = useStore();
  const [doc, setDoc] = useState<any>(null);
  const [edit, setEdit] = useState<any>(null);
  const [receipt, setReceipt] = useState<string | null>(null);

  // المتغيرات اللي هتشيل بيانات Supabase
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
 
  // الكود اللي بيكلم الداتا بيز أول ما اللوحة تفتح
  useEffect(() => {
    fetch('/api/get-orders')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // بنعيد ترتيب شكل البيانات ونضيف كل الخانات الناقصة عشان اللوحة متعملش كراش
          const formatted = data.map(item => ({
            id: String(item.id || "0"),
            created_at: item.created_at || new Date().toISOString(),
            name: item.customer_name || "غير محدد",
            phone: String(item.phone || "غير محدد"),
            address: item.address || "غير محدد",
            device: item.cart_items || "غير محدد",
            storage: "",
            color: "",
                    total: Number(item.total_price) || 0,
        
        // التعديلات الجديدة لربط الأقساط بقاعدة البيانات:
        down: Number(item.down_payment) || 0,
        months: Number(item.months_count) || 0,
        monthly: Number(item.monthly_installment) || 0,
        method: "طلب من الموقع",
        status: "طلب جديد",
        cpr: "غير محدد",
        purchaseMode: item.purchase_type || "cash", // سحب نوع الشراء الحقيقي
        receiptImage: null

          }));
          setOrders(formatted);
        }
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);


  if (loading) {
    return <p className="text-center mt-10 font-bold">جاري تحميل الطلبات من قاعدة البيانات...</p>;
  }

  if (orders.length === 0) {
    return (
      <p className="rounded-2xl border border-border bg-surface p-8 text-center text-sm font-bold text-muted-foreground">
        لا توجد طلبات بعد. ستظهر هنا فور إتمام أي عميل لطلبه.
      </p>
    );
  }

  return (
    <div className="space-y-4">


     


      {orders.map((o) => (
        <article
          key={o.id}
          className="rounded-2xl border border-border bg-card p-4 shadow-soft"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-muted-foreground">
                طلب رقم SAIF-{o.id} · {new Date(o.createdAt).toLocaleString("ar-BH")}
              </p>
              <h3 className="mt-1 text-sm font-extrabold">{o.name}</h3>
              <p className="text-xs text-muted-foreground" dir="ltr">
                +973 {o.phone}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{o.address}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <a
                href={waLink(o)}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-[#25D366] px-4 py-2 text-xs font-extrabold text-white"
              >
                واتساب العميل 💬
              </a>
              <select
                value={displayOrderStatus(o.status)}
                onChange={(e) =>
                  updateOrder(o.id, { status: e.target.value as OrderStatus })
                }
                className="rounded-xl border border-input bg-card px-3 py-2 text-xs font-bold outline-none"
              >
                {orderStatuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
            <Cell k="الجهاز" v={`${o.device} ${o.storage}`} />
            <Cell k="اللون" v={o.color || "—"} />
            <Cell k="الإجمالي" v={bhd(o.total)} />
            <Cell k="الدفعة الأولى" v={bhd(o.down)} />
            <Cell k="عدد الأشهر" v={`${o.months} شهر`} />
            <Cell k="القسط الشهري" v={bhd(o.monthly)} />
            <Cell k="الرقم الشخصي" v={o.cpr || "—"} />
            <Cell k="طريقة الدفع" v={displayOrderMethod(o.method)} />
            <Cell k="نوع الشراء" v={o.purchaseMode === "cash" ? "الدفع المقدم إلكتروني" : "تقسيط"} />
          </div>

          {o.purchaseMode !== "cash" && o.months > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-gold bg-surface p-3">
              <label className="text-[11px] font-extrabold">تاريخ بدء أول قسط</label>
          <input
  type="date"
  defaultValue={o.firstInstallmentDate ?? ""}
  onChange={async (e) => {
    const newDate = e.target.value;
    
    // 1. تحديث الشاشة فوراً
    updateOrder(o.id, { firstInstallmentDate: newDate });

    // 2. كود الفحص الجديد لاكتشاف سبب عدم الحفظ
    try {
      // ⚠️ تأكد إن 'elsaifephone-orders' هو نفس اسم الجدول عندك بالظبط
      const { data, error } = await supabase
        .from('elsaifephone-orders') 
        .update({ firstInstallmentDate: newDate })
        .eq('id', o.id)
        .select();

      if (error) {
        console.error("فشل الحفظ في سوبابيز:", error);
      } else if (data && data.length === 0) {
        console.warn("فشل صامت: لم يتم العثور على الطلب! الـ ID المستخدم هو:", o.id);
      } else {
        console.log("تم الحفظ الفعلي بنجاح! البيانات:", data);
      }
    } catch (err) {
      console.error("خطأ عام:", err);
    }
  }}
  className="rounded-xl border border-input bg-card px-3 py-2 text-[11px] font-bold outline-none"
/>



            </div>
          )}


          {o.receiptImage && (
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-gold bg-surface p-3">
              <img
                src={o.receiptImage}
                alt="إيصال التحويل البنكي"
                className="h-20 w-20 rounded-lg bg-card object-contain"
              />
              <div>
                <p className="text-[11px] font-extrabold">إيصال التحويل البنكي</p>
                <button
                  onClick={() => setReceipt(o.receiptImage ?? null)}
                  className="mt-2 rounded-xl border border-gold bg-accent px-3 py-2 text-[11px] font-bold text-accent-foreground"
                >
                  🔍 عرض / تكبير الإيصال
                </button>
              </div>
            </div>
          )}


          <div className="mt-3 flex flex-wrap gap-2">
            {docButtons.map((d) => (
              <button
                key={d.type}
                onClick={() => setDoc({ order: o, type: d.type })}
                className="rounded-xl border border-gold bg-accent px-3 py-2 text-[11px] font-bold text-accent-foreground"
              >
                {d.label}
              </button>
            ))}
            <button
              onClick={() => setEdit(o)}
              className="rounded-xl border border-border bg-surface px-3 py-2 text-[11px] font-bold"
            >
              ✏️ تعديل
            </button>
            <button
              onClick={() => {
                if (confirm("حذف هذا الطلب نهائياً؟")) deleteOrder(o.id);
              }}
              className="rounded-xl border border-destructive px-3 py-2 text-[11px] font-bold text-destructive"
            >
              🗑️ حذف
            </button>
          </div>
        </article>
      ))}

      {doc && (
        <PrintModal order={doc.order} type={doc.type} onClose={() => setDoc(null)} />
      )}
      {edit && <EditOrderModal order={edit} onClose={() => setEdit(null)} />}
      {receipt && (
        <div
          onClick={() => setReceipt(null)}
          className="fixed inset-0 z-[70] grid place-items-center bg-primary/60 p-4 backdrop-blur-sm"
        >
          <img
            src={receipt}
            alt="إيصال التحويل البنكي"
            className="max-h-[85vh] w-auto max-w-full rounded-2xl bg-card object-contain shadow-lift"
          />
        </div>
      )}
    </div>
  );
}

function Cell({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-surface px-3 py-2">
      <p className="text-[10px] text-muted-foreground">{k}</p>
      <p className="font-bold">{v}</p>
    </div>
  );
}

function EditOrderModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const { updateOrder } = useStore();
  const [f, setF] = useState<Order>(order);

  const num = (k: keyof Order, label: string) => (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-muted-foreground">{label}</span>
      <input
        type="number"
        value={String(f[k] ?? "")}
        onChange={(e) => setF({ ...f, [k]: Number(e.target.value) })}
        className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm outline-none focus:border-gold"
      />
    </label>
  );

  const txt = (k: keyof Order, label: string) => (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-muted-foreground">{label}</span>
      <input
        value={String(f[k] ?? "")}
        onChange={(e) => setF({ ...f, [k]: e.target.value })}
        className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm outline-none focus:border-gold"
      />
    </label>
  );

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-primary/40 p-4 backdrop-blur-sm">
      <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-5 shadow-lift">
        <h3 className="text-sm font-extrabold">تعديل الطلب SAIF-{order.id}</h3>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {txt("name", "اسم العميل")}
          {txt("phone", "رقم الواتساب")}
          {txt("cpr", "الرقم الشخصي CPR")}
          {txt("color", "اللون")}
          {txt("device", "الجهاز")}
          {txt("storage", "السعة")}
          {num("total", "الإجمالي")}
          {num("down", "الدفعة الأولى")}
          {num("months", "عدد الأشهر")}
          {num("monthly", "القسط الشهري")}
        </div>
        <div className="mt-3">{txt("address", "العنوان")}</div>
        <div className="mt-5 flex gap-2">
          <button
            onClick={() => {
              const monthly =
                f.months > 0 ? Math.max(f.total - f.down, 0) / f.months : f.monthly;
              updateOrder(order.id, { ...f, monthly });
              onClose();
            }}
            className="flex-1 rounded-xl bg-gold-gradient py-3 text-xs font-extrabold text-primary-foreground"
          >
            حفظ التعديلات
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-border px-5 py-3 text-xs font-bold"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Tab 2: Products ---------------- */

function ProductsTab() {
  const { catalog, saveCatalog } = useStore();
  const [search, setSearch] = useState("");

  const patch = (id: string, next: Partial<Product>) =>
    saveCatalog(catalog.map((p) => (p.id === id ? { ...p, ...next } : p)));

  const filtered = catalog.filter((p) =>
    p.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="space-y-4">
      <button
        onClick={() =>
          saveCatalog([
            {
              id: `new-${Date.now()}`,
              name: "منتج جديد",
              category: "iphone",
              image: catalog[0]?.image ?? "",
              available: true,
              variants: [{ storage: "128GB", price: 0, down: 0 }],
            },
            ...catalog,
          ])
        }
        className="rounded-xl bg-gold-gradient px-5 py-3 text-xs font-extrabold text-primary-foreground"
      >
        ＋ إضافة منتج جديد
      </button>

      <div className="relative">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 ابحث عن اسم المنتج (مثال: iPhone 18, iPad Pro, ساعة...)"
          className="w-full rounded-xl border border-input bg-card py-3 pr-4 pl-10 text-sm outline-none focus:border-gold"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            aria-label="مسح البحث"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            ✕
          </button>
        )}
      </div>

      {search.trim() && filtered.length === 0 && (
        <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          لا توجد منتجات مطابقة لنتيجة البحث
        </p>
      )}

      {filtered.map((p) => (
        <article key={p.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="flex flex-wrap items-center gap-3">
            <img
              src={p.image}
              alt={p.name}
              className="h-14 w-14 rounded-xl border border-border object-cover"
            />
            <input
              value={p.name}
              onChange={(e) => patch(p.id, { name: e.target.value })}
              className="min-w-40 flex-1 rounded-xl border border-input bg-card px-3 py-2 text-sm font-bold outline-none focus:border-gold"
            />
            <select
              value={p.category}
              onChange={(e) => patch(p.id, { category: e.target.value as Category })}
              className="rounded-xl border border-input bg-card px-3 py-2 text-xs font-bold outline-none"
            >
              <option value="iphone">آيفون</option>
              <option value="samsung">سامسونج</option>
              <option value="gaming">الألعاب</option>
              <option value="audio">السماعات</option>
            </select>
            <button
              onClick={() => patch(p.id, { available: p.available === false })}
              className={`rounded-xl px-3 py-2 text-[11px] font-bold ${
                p.available === false
                  ? "border border-destructive text-destructive"
                  : "border border-gold bg-accent text-accent-foreground"
              }`}
            >
              {p.available === false ? "نفد من المخزون" : "متوفر"}
            </button>
            <button
              onClick={() => {
                if (confirm("حذف هذا المنتج؟"))
                  saveCatalog(catalog.filter((x) => x.id !== p.id));
              }}
              className="rounded-xl border border-destructive px-3 py-2 text-[11px] font-bold text-destructive"
            >
              🗑️
            </button>
          </div>

          <div className="mt-3">
            <span className="mb-1 block text-[10px] font-bold text-muted-foreground">
              صورة المنتج الرئيسية
            </span>
            <ImageUpload
              value={p.image}
              onChange={(img) => patch(p.id, { image: img })}
            />
          </div>

          <div className="mt-4">
            <p className="mb-2 text-[11px] font-extrabold">الألوان وصور كل لون</p>
            <div className="space-y-2">
              {(p.colors ?? []).map((c, i) => {
                const setColor = (next: Partial<ColorOption>) =>
                  patch(p.id, {
                    colors: (p.colors ?? []).map((x, j) =>
                      j === i ? { ...x, ...next } : x,
                    ),
                  });
                return (
                  <div
                    key={i}
                    className="flex flex-wrap items-center gap-2 rounded-xl bg-surface p-2"
                  >
                    <input
                      value={c.name}
                      placeholder="اسم اللون"
                      onChange={(e) => setColor({ name: e.target.value })}
                      className="w-32 rounded-lg border border-input bg-card px-3 py-2 text-xs outline-none focus:border-gold"
                    />
                    <input
                      type="color"
                      value={c.hex || "#000000"}
                      onChange={(e) => setColor({ hex: e.target.value })}
                      className="h-9 w-12 cursor-pointer rounded-lg border border-input bg-card"
                    />
                    <div className="min-w-48 flex-1">
                      <ImageUpload
                        value={c.image}
                        compact
                        onChange={(img) => setColor({ image: img })}
                      />
                    </div>
                    <button
                      onClick={() =>
                        patch(p.id, {
                          colors: (p.colors ?? []).filter((_, j) => j !== i),
                        })
                      }
                      className="rounded-lg border border-destructive px-3 py-2 text-[11px] font-bold text-destructive"
                    >
                      حذف اللون
                    </button>
                  </div>
                );
              })}
              <button
                onClick={() =>
                  patch(p.id, {
                    colors: [
                      ...(p.colors ?? []),
                      { name: "لون جديد", hex: "#111827", image: p.image },
                    ],
                  })
                }
                className="rounded-lg border border-gold bg-accent px-3 py-2 text-[11px] font-bold text-accent-foreground"
              >
                ＋ إضافة لون جديد
              </button>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {p.variants.map((v, i) => (
              <div key={i} className="flex flex-wrap items-end gap-2 rounded-xl bg-surface p-2">
                <VField
                  label="السعة"
                  value={v.storage}
                  onChange={(val) =>
                    patch(p.id, {
                      variants: p.variants.map((x, j) =>
                        j === i ? { ...x, storage: val } : x,
                      ),
                    })
                  }
                />
                <VField
                  label="السعر نقداً"
                  type="number"
                  value={String(v.price)}
                  onChange={(val) =>
                    patch(p.id, {
                      variants: p.variants.map((x, j) =>
                        j === i ? { ...x, price: Number(val) } : x,
                      ),
                    })
                  }
                />
                <VField
                  label="الدفعة الأولى"
                  type="number"
                  value={String(v.down ?? 0)}
                  onChange={(val) =>
                    patch(p.id, {
                      variants: p.variants.map((x, j) =>
                        j === i ? { ...x, down: Number(val) } : x,
                      ),
                    })
                  }
                />
                <button
                  onClick={() =>
                    patch(p.id, { variants: p.variants.filter((_, j) => j !== i) })
                  }
                  className="rounded-lg border border-destructive px-3 py-2 text-[11px] font-bold text-destructive"
                >
                  حذف السعة
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                patch(p.id, {
                  variants: [...p.variants, { storage: "256GB", price: 0, down: 0 }],
                })
              }
              className="rounded-lg border border-border px-3 py-2 text-[11px] font-bold text-muted-foreground"
            >
              ＋ إضافة سعة
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function VField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-28 rounded-lg border border-input bg-card px-3 py-2 text-xs outline-none focus:border-gold"
      />
    </label>
  );
}

/* ---------------- Tab 3: Settings ---------------- */

type StringSettingKey = {
  [K in keyof AdminSettings]: AdminSettings[K] extends string ? K : never;
}[keyof AdminSettings];

function SettingsTab() {
  const { settings, saveSettings } = useStore();
  const [form, setForm] = useState<AdminSettings>(settings);
  const [saved, setSaved] = useState(false);
  const [test, setTest] = useState("");
  const [tgTest, setTgTest] = useState("");
  const [testEmail, setTestEmail] = useState("");
  useEffect(() => {
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/get-settings');
      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({
          ...prev,
          payNowUrl: data.payNowUrl || prev.payNowUrl,
          deliveryFeeUrl: data.deliveryFeeUrl || prev.deliveryFeeUrl,
          benefitUrl: data.benefitUrl || prev.benefitUrl,
          bankName: data.bankName || prev.bankName,
          accountName: data.accountName || prev.accountName,
          iban: data.iban || prev.iban,
          storePhone: data.storePhone || prev.storePhone,
          storeEmail: data.storeEmail || prev.storeEmail
        }));
      }
    } catch (err) {
      console.error("خطأ في جلب الإعدادات", err);
    }
  };
  
  fetchSettings();
}, []);

const saveToDatabase = async (currentForm) => {
  try {
    const { error } = await supabase
      .from('store_settings')
      .update({
        payNowUrl: currentForm.payNowUrl,
        deliveryFeeUrl: currentForm.deliveryFeeUrl,
        benefitUrl: currentForm.benefitUrl,
        bankName: currentForm.bankName,
        accountName: currentForm.accountName,
        iban: currentForm.iban,
        storePhone: currentForm.storePhone,
        storeEmail: currentForm.storeEmail
      })
      .eq('id', 1);

    if (error) {
      console.error("خطأ من قاعدة البيانات:", error);
    }
  } catch (err) {
    console.error("خطأ في الاتصال:", err);
  }
};



  useEffect(() => setForm(settings), [settings]);

  const field = (label: string, key: StringSettingKey, placeholder: string) => (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-muted-foreground">{label}</span>
      <input
        value={form[key]}
        placeholder={placeholder}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm outline-none focus:border-gold"
      />
    </label>
  );

  return (
    <div className="max-w-xl space-y-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="rounded-2xl border border-burgundy/30 bg-surface p-4">
        <h3 className="mb-1 text-sm font-extrabold text-burgundy">
          الخصم العام الشامل (Global Discount %)
        </h3>
        <p className="mb-3 text-[11px] font-bold text-muted-foreground">
          سيتم تطبيق هذه النسبة تلقائياً على كافة الأجهزة بجميع مساحاتها التخزينية فور الحفظ
        </p>
        <label className="block">
          <span className="mb-1 block text-xs font-bold text-muted-foreground">
            نسبة الخصم العام (%)
          </span>
          <input
            type="number"
            min={0}
            max={100}
            value={String(form.globalDiscount ?? 0)}
            placeholder="0"
            onChange={(e) =>
              setForm({
                ...form,
                globalDiscount: Math.min(Math.max(Number(e.target.value) || 0, 0), 100),
              })
            }
            className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </label>
        <button
          onClick={() => {
            saveSettings(form);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          className="mt-3 w-full rounded-xl bg-burgundy py-2.5 text-xs font-extrabold text-white"
        >
          تطبيق وحفظ الخصم
        </button>
      </div>

      {field("رابط الدفع المسبق", "payNowUrl", "https://...")}
      {field("رابط رسوم التوصيل", "deliveryFeeUrl", "https://...")}

      <div className="rounded-2xl border border-border bg-surface p-4">
        <h3 className="mb-3 text-sm font-extrabold">إعدادات الدفع المقدم إلكتروني</h3>
        <div className="space-y-3">
          {field("رابط الدفع المباشر Benefit", "benefitPayUrl", "https://...")}
          {field("اسم البنك", "bankName", "بنك البحرين الوطني")}
          {field("اسم صاحب الحساب", "accountName", "مؤسسة السيف للهواتف للتجارة")}
          {field("رقم الآيبان الدولي (IBAN)", "iban", "BH00XXXX00000000000000")}
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-4">
        <h3 className="mb-3 text-sm font-extrabold">بيانات التواصل في أسفل المتجر</h3>
        <div className="space-y-3">
          {field("رقم واتساب الدعم الفني", "storePhone", "+973 XXXXXXXX")}
          {field("بريد المتجر", "storeEmail", "support@alsaifphones.com")}
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-4">
        <h3 className="mb-3 text-sm font-extrabold">إشعارات تيليجرام</h3>
        <div className="space-y-3">
          
        </div>
        <button
          onClick={async () => {
            setTgTest("جارٍ الاختبار...");
            saveSettings(form);
            const r = await sendTelegram(
              form,
              "🔔 رسالة اختبار من متجر السيف للهواتف — الإشعارات تعمل بنجاح ✓",
            );
            setTgTest(r.ok ? "تم الإرسال ✓ تحقق من محادثة تيليجرام" : "فشل الإرسال: " + r.error);
          }}
          className="mt-3 w-full rounded-xl border border-border bg-card py-2.5 text-xs font-bold"
        >
          اختبار إشعار تيليجرام
        </button>
        {tgTest && (
          <p className="mt-2 text-center text-xs font-bold text-gold-foreground">{tgTest}</p>
        )}
        <p className="mt-2 text-[11px] font-bold leading-5 text-muted-foreground">
          تأكد من: بدء محادثة مع البوت بالضغط على Start، وأن معرف المحادثة أرقام فقط (يبدأ بـ -100
          للمجموعات)، وإضافة البوت كعضو في المجموعة.
        </p>
      </div>


      
            

      <button
        onClick={async () => {
  saveSettings(form);
  try {
    await fetch('/api/update-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
  } catch (err) {
    console.error("خطأ في الاتصال بالـ API:", err);
  }
  setSaved(true);
  setTimeout(() => setSaved(false), 2000);
}}


        className="w-full rounded-xl bg-primary py-3 text-sm font-extrabold text-primary-foreground"
      >
        حفظ الإعدادات
      </button>
      {saved && <p className="text-center text-xs font-bold text-gold-foreground">تم الحفظ ✓</p>}
    </div>
  );
}

