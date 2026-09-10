import type { CSSProperties } from "react";
import type { Order } from "@/lib/store";
import { displayOrderMethod } from "@/lib/store-types";

export type DocType = "invoice" | "contract" | "receipt" | "manifest" | "schedule";

/** يبني مواعيد الأقساط الشهرية بدءاً من تاريخ أول قسط */
function buildSchedule(order: Order): { n: number; due: string }[] {
  const months = Math.max(order.months || 0, 0);
  const startRaw = order.firstInstallmentDate;
  const start = startRaw ? new Date(`${startRaw}T00:00:00`) : null;
  const rows: { n: number; due: string }[] = [];
  for (let i = 0; i < months; i++) {
    let due = "—";
    if (start && !Number.isNaN(start.getTime())) {
      const d = new Date(start.getTime());
      const day = start.getDate();
      d.setDate(1);
      d.setMonth(d.getMonth() + i);
      const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      d.setDate(Math.min(day, lastDay));
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      due = `${dd}/${mm}/${d.getFullYear()}`;
    }
    rows.push({ n: i + 1, due });
  }
  return rows;
}

const money = (n: number) => n.toFixed(3);

const arDate = (iso: string) =>
  new Date(iso).toLocaleString("ar-BH", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

const arDateLong = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("ar-BH", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

const th: CSSProperties = { border: "1px solid #cbd5e1", padding: "6px" };
const td: CSSProperties = { border: "1px solid #cbd5e1", padding: "6px" };

export function OfficialStamp({ size = 110 }: { size?: number }) {
  const navy = "#12275c";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{ transform: "rotate(-14deg)", opacity: 0.92 }}
      aria-label="ختم مؤسسة السيف للهواتف"
    >
      <defs>
        <path
          id="taj-stamp-top"
          d="M100,100 m-72,0 a72,72 0 1,1 144,0"
          fill="none"
        />
        <path
          id="taj-stamp-bottom"
          d="M100,100 m-58,0 a58,58 0 1,0 116,0"
          fill="none"
        />
      </defs>
      <circle cx="100" cy="100" r="92" fill="none" stroke={navy} strokeWidth="5" />
      <circle cx="100" cy="100" r="80" fill="none" stroke={navy} strokeWidth="2" />
      <circle cx="100" cy="100" r="52" fill="none" stroke={navy} strokeWidth="2" />
      <text fill={navy} fontSize="15" fontWeight="bold" letterSpacing="0.5">
        <textPath href="#taj-stamp-top" startOffset="50%" textAnchor="middle">
          مؤسسة السيف للهواتف للتجارة • ALSAIF PHONES
        </textPath>
      </text>
      <text fill={navy} fontSize="12" fontWeight="bold">
        <textPath href="#taj-stamp-bottom" startOffset="50%" textAnchor="middle">
          معتمد • مملكة البحرين
        </textPath>
      </text>
      <path
        d="M72 108 L80 84 L92 98 L100 76 L108 98 L120 84 L128 108 Z"
        fill={navy}
      />
      <rect x="72" y="112" width="56" height="8" fill={navy} />
    </svg>
  );
}

function Letterhead({ title, serial, date }: { title: string; serial: string; date: string }) {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #C5A059",
          paddingBottom: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: "#8B1538", fontSize: 22 }}>
            السيف للهواتف | ALSAIF PHONES 👑
          </h2>
          <p style={{ margin: "3px 0", fontSize: 13, color: "#64748b" }}>
            مملكة البحرين • أجهزة وهواتف ذكية بأقساط ميسرة
          </p>
        </div>
        <div style={{ textAlign: "left", fontSize: 13 }}>
          <p style={{ margin: "2px 0" }}>
            <strong>الرقم:</strong> {serial}
          </p>
          <p style={{ margin: "2px 0" }}>
            <strong>التاريخ:</strong> {date}
          </p>
        </div>
      </div>
      <h3
        style={{
          textAlign: "center",
          margin: "15px 0 25px 0",
          fontSize: 18,
          textDecoration: "underline",
        }}
      >
        {title}
      </h3>
    </>
  );
}

function Barcode({ value }: { value: string }) {
  const bars = Array.from(value.padEnd(14, "7")).map((c) => (c.charCodeAt(0) % 4) + 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 46 }}>
      {bars.map((w, i) => (
        <span
          key={i}
          style={{ width: w, height: "100%", background: i % 2 ? "#fff" : "#0f172a" }}
        />
      ))}
    </div>
  );
}

export function DocumentView({ order, type }: { order: Order; type: DocType }) {
  const remaining = Math.max(order.total - order.down, 0);
  const date = arDate(order.createdAt);
  const base: CSSProperties = {
    fontFamily: "'Cairo', sans-serif",
    padding: 30,
    color: "#1e293b",
    lineHeight: 1.6,
    background: "#fff",
  };

  if (type === "schedule") {
    const rows = buildSchedule(order);
    return (
      <div className="printable-document" dir="rtl" style={base}>
        <Letterhead
          title="جدول سداد الأقساط الشهرية المعتمد"
          serial={`SAIF-SCH-${order.id}`}
          date={date}
        />

        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: 12,
            marginBottom: 14,
            fontSize: 13,
          }}
        >
          <p style={{ margin: "4px 0" }}>
            <strong>اسم العميل:</strong> {order.name} | <strong>الرقم الشخصي (CPR):</strong>{" "}
            {order.cpr || "—"}
          </p>
          <p style={{ margin: "4px 0" }}>
            <strong>رقم الهاتف (واتساب):</strong> +973 {order.phone}
          </p>
          <p style={{ margin: "4px 0" }}>
            <strong>العنوان التفصيلي (المحافظة، المنطقة، المجمع، الشارع، المبنى/الشقة):</strong>{" "}
            {order.address || "—"}
          </p>
          <p style={{ margin: "4px 0" }}>
            <strong>رقم الطلب:</strong> SAIF-{order.id} | <strong>تاريخ الطلب:</strong> {date}
          </p>
          <p style={{ margin: "4px 0" }}>
            <strong>الجهاز:</strong> {order.device} {order.storage}
            {order.color ? ` - ${order.color}` : ""}
          </p>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: 12,
            fontSize: 12,
            textAlign: "center",
          }}
        >
          <tbody>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={th}>إجمالي المتبقي للتقسيط</th>
              <th style={th}>عدد الأقساط</th>
              <th style={th}>قيمة القسط الشهري</th>
            </tr>
            <tr>
              <td style={td}>{money(remaining)} د.ب</td>
              <td style={td}>{order.months} شهراً</td>
              <td style={{ ...td, fontWeight: "bold", color: "#8B1538" }}>
                {money(order.monthly)} د.ب
              </td>
            </tr>
          </tbody>
        </table>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 12,
            textAlign: "center",
          }}
        >
          <tbody>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={th}>رقم القسط</th>
              <th style={th}>تاريخ الاستحقاق</th>
              <th style={th}>قيمة القسط (د.ب)</th>
              <th style={th}>طريقة الدفع</th>
              <th style={th}>الحالة</th>
            </tr>
            {rows.map((r) => (
              <tr key={r.n}>
                <td style={td}>{r.n}</td>
                <td style={td}>{r.due}</td>
                <td style={{ ...td, fontWeight: "bold" }}>{money(order.monthly)}</td>
                <td style={td}>بنفت باي (BenefitPay)</td>
                <td style={td}>غير مسدد</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p
          style={{
            marginTop: 12,
            padding: 10,
            border: "1px solid #C5A059",
            background: "#FBF5EB",
            borderRadius: 8,
            fontSize: 12,
            color: "#6B4F35",
            fontWeight: "bold",
          }}
        >
          📌 ملاحظة هامة: يتم سداد الأقساط الشهرية في موعد استحقاقها عبر تطبيق بنفت باي
          (BenefitPay) أو القنوات المعتمدة لدى مؤسسة السيف للهواتف.
        </p>

        <table
          className="signature-section"
          style={{ width: "100%", borderCollapse: "collapse", marginTop: 18, fontSize: 13 }}
        >
          <tbody>
            <tr>
              <td style={{ width: "50%", verticalAlign: "top", padding: 10 }}>
                <p style={{ margin: "0 0 5px 0" }}>
                  <strong>عن مؤسسة السيف للهواتف:</strong> التوقيع والختم
                </p>
                <OfficialStamp size={95} />
              </td>
              <td style={{ width: "50%", verticalAlign: "top", padding: 10 }}>
                <p style={{ margin: "0 0 5px 0" }}>
                  <strong>توقيع العميل:</strong> {order.name}
                </p>
                <div style={{ minHeight: 70, borderBottom: "1px solid #334155" }} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (type === "contract") {
    return (
      <div className="contract-container printable-document" dir="rtl" style={base}>
        <Letterhead
          title="عقد بيع بالتقسيط وإقرار مديونية"
          serial={`SAIF-CON-${order.id}`}
          date={date}
        />

        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: 12,
            marginBottom: 15,
            fontSize: 13,
          }}
        >
          <p style={{ margin: "4px 0" }}>
            <strong>الطرف الأول (البائع):</strong> مؤسسة السيف للهواتف للتجارة والتوزيع، الكائن
            مقرها بمملكة البحرين.
          </p>
          <p style={{ margin: "4px 0" }}>
            <strong>الطرف الثاني (المشتري / المدين):</strong> {order.name} |{" "}
            <strong>الرقم الشخصي (CPR):</strong> {order.cpr || "—"}
          </p>
          <p style={{ margin: "4px 0" }}>
            <strong>رقم الهاتف (واتساب):</strong> +973 {order.phone} |{" "}
            <strong>العنوان المختار:</strong> {order.address}
          </p>
        </div>

        <p style={{ fontSize: 12, color: "#475569", marginBottom: 15 }}>
          <strong>التمهيد:</strong> لما كان الطرف الأول يمارس نشاط بيع وتوزيع الأجهزة
          الإلكترونية والهواتف الذكية بالتقسيط الميسر، وقد أبدى الطرف الثاني رغبته التامة في
          شراء الجهاز الموضح أدناه وفق المواصفات المحددة، على أن تتم المعاينة والفحص والتأكد من
          سلامته ومطابقته عند التسليم النهائي، وقبوله لجدول السداد الشهري، فقد اتفق الطرفان
          بكامل الأهلية المعتبرة على البنود التالية:
        </p>

        <div style={{ marginBottom: 12, fontSize: 13 }}>
          <h4 style={{ margin: "0 0 4px 0", color: "#0f172a" }}>
            البند الأول: بيانات المبيع والتسليم
          </h4>
          <p style={{ margin: 0 }}>
            باع الطرف الأول للطرف الثاني الجهاز:{" "}
            <strong>
              {order.device} ({order.storage}
              {order.color ? ` - ${order.color}` : ""})
            </strong>
            ، مشمولاً بضمان الوكيل المعتمد لمدة عامين. يلتزم الطرف الأول بتسليم الجهاز للطرف
            الثاني جديداً ومطابقاً للمواصفات المعتمدة، ويلتزم الطرف الثاني بمعاينته وتأكيد
            استلامه فور التوصيل.
          </p>
        </div>

        <div style={{ marginBottom: 12, fontSize: 13 }}>
          <h4 style={{ margin: "0 0 4px 0", color: "#0f172a" }}>
            البند الثاني: القيمة المالية وجدول السداد
          </h4>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 6,
              fontSize: 12,
              textAlign: "center",
            }}
          >
            <tbody>
              <tr style={{ background: "#f1f5f9" }}>
                <th style={th}>إجمالي القيمة</th>
                <th style={th}>الدفعة الأولى</th>
                <th style={th}>المبلغ المتبقي</th>
                <th style={th}>مدة التقسيط</th>
                <th style={th}>القسط الشهري</th>
              </tr>
              <tr>
                <td style={td}>{money(order.total)} د.ب</td>
                <td style={td}>{money(order.down)} د.ب</td>
                <td style={td}>{money(remaining)} د.ب</td>
                <td style={td}>{order.months} شهراً</td>
                <td style={{ ...td, fontWeight: "bold", color: "#8B1538" }}>
                  {money(order.monthly)} د.ب
                </td>
              </tr>
            </tbody>
          </table>
          <p style={{ margin: "4px 0 0 0", fontSize: 11, color: "#64748b" }}>
            * يستحق القسط الأول في تاريخ{" "}
            {order.firstInstallmentDate ? arDateLong(order.firstInstallmentDate) : "—"}، وتستحق
            الأقساط اللاحقة في نفس اليوم من كل شهر ميلادي بصورة دورية ومنتظمة عبر وسائل الدفع
            المعتمدة لدى الطرف الأول (تطبيق بنفت باي).
          </p>
        </div>

        <div style={{ marginBottom: 12, fontSize: 13 }}>
          <h4 style={{ margin: "0 0 4px 0", color: "#0f172a" }}>البند الثالث: إقرار المديونية</h4>
          <p style={{ margin: 0 }}>
            يقر الطرف الثاني (المشتري) إقراراً صريحاً لا رجعة فيه بانشغال ذمته بالمبلغ المتبقي
            لصالح الطرف الأول، ويتعهد بالالتزام التام بسداد الأقساط الشهرية في مواعيد
            استحقاقها المحددة.
          </p>
        </div>

        <div style={{ marginBottom: 12, fontSize: 13 }}>
          <h4 style={{ margin: "0 0 4px 0", color: "#0f172a" }}>
            البند الرابع: التأخر عن السداد والرسوم الإدارية
          </h4>
          <p style={{ margin: 0 }}>
            اتفق الطرفان تراضياً على أنه في حال تأخر الطرف الثاني عن سداد الأقساط المستحقة لمدة
            تتجاوز <strong>ثلاثة أشهر متتالية</strong>، يتم احتساب وإضافة{" "}
            <strong>رسوم تأخير ومتابعة إدارية قدرها (10.000 د.ب) عشرة دنانير بحرينية</strong>{" "}
            تضاف إلى رصيد الحساب عن كل شهر تأخير إضافي حتى تمام السداد وتسوية المبالغ المستحقة.
          </p>
        </div>

        <div style={{ marginBottom: 15, fontSize: 13 }}>
          <h4 style={{ margin: "0 0 4px 0", color: "#0f172a" }}>
            البند الخامس: الإخطارات والمراسلات
          </h4>
          <p style={{ margin: 0 }}>
            تعتبر العناوين وأرقام الهواتف وبيانات تطبيق الواتساب الموضحة في صدر هذا العقد
            معتمدة وموثقة لتبادل التذكيرات الشهرية والإشعارات الخاصة بمواعيد السداد وإيصالات
            الدفع.
          </p>
        </div>

        <table
          className="signature-section"
          style={{ width: "100%", borderCollapse: "collapse", marginTop: 25, fontSize: 13 }}
        >
          <tbody>
            <tr>
              <td style={{ width: "50%", verticalAlign: "top", padding: 10 }}>
                <p style={{ margin: "0 0 5px 0" }}>
                  <strong>الطرف الأول (البائع):</strong> مؤسسة السيف للهواتف
                </p>
                <p style={{ margin: "0 0 40px 0" }}>
                  <strong>التوقيع والختم:</strong> .....................................
                </p>
                <OfficialStamp size={95} />
              </td>
              <td style={{ width: "50%", verticalAlign: "top", padding: 10 }}>
                <p style={{ margin: "0 0 5px 0" }}>
                  <strong>الطرف الثاني (المشتري):</strong> {order.name}
                </p>
                <p style={{ margin: "0 0 10px 0" }}>
                  <strong>التوقيع الحي:</strong>
                </p>
                <div
                  style={{
                    minHeight: 80,
                    borderBottom: "1px solid #334155",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>
                    (توقيع العميل الإلكتروني معتمد)
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (type === "invoice") {
    return (
      <div className="printable-document" dir="rtl" style={base}>
        <Letterhead
          title="فاتورة رسمية"
          serial={`SAIF-INV-${order.id}`}
          date={date}
        />
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: 12,
            marginBottom: 15,
            fontSize: 13,
          }}
        >
          <p style={{ margin: "4px 0" }}>
            <strong>اسم العميل:</strong> {order.name} | <strong>CPR:</strong>{" "}
            {order.cpr || "—"}
          </p>
          <p style={{ margin: "4px 0" }}>
            <strong>الهاتف:</strong> +973 {order.phone}
          </p>
          <p style={{ margin: "4px 0" }}>
            <strong>العنوان:</strong> {order.address}
          </p>
        </div>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, textAlign: "center" }}
        >
          <tbody>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={th}>الوصف</th>
              <th style={th}>السعة</th>
              <th style={th}>اللون</th>
              <th style={th}>الإجمالي</th>
            </tr>
            <tr>
              <td style={td}>{order.device}</td>
              <td style={td}>{order.storage}</td>
              <td style={td}>{order.color || "—"}</td>
              <td style={td}>{money(order.total)} د.ب</td>
            </tr>
          </tbody>
        </table>
        <table
          style={{ width: "60%", marginTop: 14, borderCollapse: "collapse", fontSize: 12 }}
        >
          <tbody>
            <tr style={{ background: "#f1f5f9" }}>
              <td style={{ ...td, fontWeight: "bold" }}>المبلغ الإجمالي</td>
              <td style={{ ...td, fontWeight: "bold", color: "#8B1538" }}>
                {money(order.total)} د.ب
              </td>
            </tr>
            <tr>
              <td style={td}>الدفعة الأولى</td>
              <td style={td}>{money(order.down)} د.ب</td>
            </tr>
            <tr>
              <td style={td}>المتبقي بالتقسيط ({order.months} شهر)</td>
              <td style={td}>
                {money(remaining)} د.ب — {money(order.monthly)} د.ب شهرياً
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: 30, display: "flex", justifyContent: "space-between" }}>
          <p style={{ fontSize: 12, color: "#64748b" }}>طريقة الدفع: {displayOrderMethod(order.method)}</p>
          <OfficialStamp size={110} />
        </div>
      </div>
    );
  }

  if (type === "receipt") {
    return (
      <div className="printable-document" dir="rtl" style={base}>
        <Letterhead title="سند قبض رسمي" serial={`SAIF-RCV-${order.id}`} date={date} />
        <div style={{ fontSize: 14, lineHeight: 2 }}>
          <p>
            استلمنا نحن <strong>مؤسسة السيف للهواتف للتجارة والتوزيع</strong> من السيد/ة{" "}
            <strong>{order.name}</strong> (CPR: {order.cpr || "—"})
          </p>
          <p>
            مبلغاً وقدره <strong style={{ color: "#8B1538" }}>{money(order.down)} د.ب</strong>{" "}
            وذلك عن الدفعة الأولى لشراء الجهاز{" "}
            <strong>
              {order.device} {order.storage}
            </strong>{" "}
            بنظام التقسيط.
          </p>
          <p>
            ويتبقى بذمة المشتري مبلغ <strong>{money(remaining)} د.ب</strong> يسدد على{" "}
            {order.months} قسطاً شهرياً بواقع {money(order.monthly)} د.ب للقسط.
          </p>
        </div>
        <table className="signature-section" style={{ width: "100%", marginTop: 40, fontSize: 13 }}>
          <tbody>
            <tr>
              <td style={{ padding: 10 }}>
                <strong>المستلم:</strong> مؤسسة السيف للهواتف
                <div style={{ marginTop: 20 }}>
                  <OfficialStamp size={100} />
                </div>
              </td>
              <td style={{ padding: 10, verticalAlign: "top" }}>
                <strong>توقيع الدافع:</strong>
                <div style={{ marginTop: 50, borderBottom: "1px solid #334155" }} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="printable-document" dir="rtl" style={base}>
      <Letterhead
        title="بوليصة شحن — دلمون إكسبريس 🚚"
        serial={`DLM-${order.id}`}
        date={date}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13 }}>
          <p style={{ margin: "2px 0" }}>
            <strong>المرسل:</strong> السيف للهواتف — مملكة البحرين
          </p>
          <p style={{ margin: "2px 0" }}>
            <strong>هاتف المرسل:</strong> +973 3000 0000
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <Barcode value={order.id} />
          <p style={{ margin: 2, fontSize: 11, letterSpacing: 2 }}>DLM-{order.id}</p>
        </div>
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: 16,
          fontSize: 12,
        }}
      >
        <tbody>
          <tr style={{ background: "#f1f5f9" }}>
            <th style={th}>المستلم</th>
            <th style={th}>الهاتف</th>
            <th style={th}>العنوان</th>
          </tr>
          <tr>
            <td style={td}>{order.name}</td>
            <td style={td}>+973 {order.phone}</td>
            <td style={td}>{order.address}</td>
          </tr>
          <tr style={{ background: "#f1f5f9" }}>
            <th style={th}>محتوى الشحنة</th>
            <th style={th}>طريقة الدفع</th>
            <th style={th}>المبلغ المطلوب تحصيله</th>
          </tr>
          <tr>
            <td style={td}>
              {order.device} {order.storage} {order.color}
            </td>
            <td style={td}>{displayOrderMethod(order.method)}</td>
            <td style={{ ...td, fontWeight: "bold", color: "#8B1538" }}>
              {money(order.down)} د.ب
            </td>
          </tr>
        </tbody>
      </table>
      <p style={{ marginTop: 24, fontSize: 12, color: "#64748b" }}>
        يلتزم المندوب بتسليم الجهاز بعد التحقق من هوية المستلم وتحصيل المبلغ الموضح أعلاه
        وتوقيع العقد.
      </p>
      <div className="signature-section" style={{ marginTop: 30, display: "flex", alignItems: "flex-end", justifyContent: "space-between", fontSize: 13 }}>
        <span>توقيع المندوب: ..........................</span>
        <span>توقيع المستلم: ..........................</span>
        <OfficialStamp size={95} />
      </div>
    </div>
  );
}

export function PrintModal({
  order,
  type,
  onClose,
}: {
  order: Order;
  type: DocType;
  onClose: () => void;
}) {
  const docLabels: Record<DocType, string> = {
    invoice: "الفاتورة",
    contract: "العقد",
    receipt: "سند القبض",
    manifest: "بوليصة الشحن",
    schedule: "جدول الأقساط",
  };

  function pdfFileName(type: DocType, orderId: string) {
    switch (type) {
      case "contract":
        return `عقد_تقسيط_السيف_للهواتف_${orderId}.pdf`;
      case "invoice":
        return `فاتورة_السيف_للهواتف_${orderId}.pdf`;
      case "receipt":
        return `سند_قبض_السيف_للهواتف_${orderId}.pdf`;
      case "manifest":
        return `بوليصة_شحن_السيف_للهواتف_${orderId}.pdf`;
      case "schedule":
        return `جدول_اقساط_السيف_للهواتف_${orderId}.pdf`;
    }
  }

  /** انتظر اكتمال تحميل الخطوط والصور ثم اطبع حتى لا يخرج الـ PDF فارغاً */
  async function printDocument() {
    try {
      await document.fonts.ready;
    } catch {
      /* ignore */
    }
    await new Promise((r) => setTimeout(r, 300));

    const originalTitle = document.title;
    const fileName = pdfFileName(type, order.id);
    document.title = fileName;
    window.onafterprint = () => {
      document.title = originalTitle;
      window.onafterprint = null;
    };

    window.print();
  }

  async function sendViaWhatsApp() {
    // 1) افتح نافذة الحفظ/الطباعة كـ PDF
    await printDocument();
    // 2) افتح محادثة واتساب مع العميل برسالة جاهزة
    const phone = (order.phone || "").replace(/\D/g, "");
    const fullPhone = phone.startsWith("973") ? phone : `973${phone}`;
    const message =
      type === "schedule"
        ? `مرحباً عزيزنا ${order.name} 👑\nنرفق لكم جدول مواعيد سداد الأقساط الشهرية المعتمد لطلبكم رقم: #${order.id}.\nطريقة السداد المعتمدة: تطبيق بنفت باي (BenefitPay).\nالسيف للهواتف | مملكة البحرين 🇧🇭`
        : `مرحباً ${order.name}،\nمعك مؤسسة السيف للهواتف 👑\nنرسل لك ${docLabels[type]} الخاصة بطلبك رقم #${order.id} (${order.device} ${order.storage}).\nيرجى الاطلاع على ملف الـ PDF المرفق، وشكراً لتعاملكم معنا.`;
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`, "_blank");
  }

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-primary/40 p-3 backdrop-blur-sm print:static print:overflow-visible print:bg-transparent print:p-0">
      <div className="mx-auto max-w-[820px] print:max-w-none">
        <div className="mb-3 flex flex-wrap justify-between gap-2 print:hidden">
          <div className="flex gap-2">
            <button
              onClick={() => void printDocument()}
              className="rounded-xl bg-gold-gradient px-5 py-2 text-xs font-extrabold text-primary-foreground"
            >
              طباعة / حفظ PDF 🖨️
            </button>
            <button
              onClick={sendViaWhatsApp}
              className="rounded-xl border px-5 py-2 text-xs font-extrabold"
              style={{ background: "#FBF5EB", borderColor: "#C5A880", color: "#6B4F35" }}
            >
              إرسال للعميل عبر واتساب (PDF) 💬
            </button>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-border bg-background px-5 py-2 text-xs font-bold"
          >
            إغلاق ✕
          </button>
        </div>
        <div id="print-area" className="rounded-2xl bg-white shadow-lift print:rounded-none print:shadow-none">
          <DocumentView order={order} type={type} />
        </div>
      </div>
    </div>
  );
}
