const badges = [
  { icon: "🛡️", text: "ضمان الوكيل المعتمد لمدة سنتين" },
  { icon: "🇧🇭", text: "مرخص ومطابق لهيئة تنظيم الاتصالات البحرينية (TRC)" },
  { icon: "🔒", text: "بياناتك محمية ومشفرة وفقاً لقانون حماية البيانات (PDPL)" },
  { icon: "📦", text: "أجهزة جديدة أصلية 100% بتغليف المصنع وسيريال معتمد" },
];

export function TrustBadges({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={`grid gap-2 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}
      aria-label="ضمانات المتجر"
    >
      {badges.map((b) => (
        <div
          key={b.text}
          className="flex items-center gap-3 rounded-2xl border border-gold bg-accent px-4 py-3 shadow-soft"
        >
          <span className="text-lg">{b.icon}</span>
          <span className="text-[11px] font-bold leading-5 text-accent-foreground">
            {b.text}
          </span>
        </div>
      ))}
    </section>
  );
}
