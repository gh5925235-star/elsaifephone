import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { bhd, boxAndWarranty, specsFor } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "تفاصيل الجهاز | السيف للهواتف" },
      {
        name: "description",
        content:
          "اختر السعة واللون المناسب لجهازك من السيف للهواتف مع أسعار بالدينار البحريني وخطط تقسيط مرنة.",
      },
      { property: "og:title", content: "تفاصيل الجهاز | السيف للهواتف" },
      {
        property: "og:description",
        content: "اختر السعة واللون وشاهد صور كل لون قبل الطلب من السيف للهواتف.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = useParams({ from: "/product/$id" });
  const { catalog, add, discount, priceOf } = useStore();
  const product = useMemo(() => catalog.find((p) => p.id === id), [catalog, id]);
  const [variantIndex, setVariantIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-sm text-muted-foreground">هذا الجهاز غير متوفر حالياً.</p>
        <Link to="/" className="mt-4 inline-block text-sm font-bold text-burgundy">
          العودة للمتجر
        </Link>
      </div>
    );
  }

  const variant = product.variants[variantIndex] ?? product.variants[0]!;
  const colors = product.colors ?? [];
  const color = colors[colorIndex];
  const shownImage = color?.image || product.image;
  const specs = specsFor(product);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-6">
      <Link to="/" className="text-xs font-bold text-muted-foreground">
        ← العودة للمتجر
      </Link>

      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="flex items-center justify-center rounded-3xl border border-border bg-white p-6 shadow-soft">
          <img
            key={shownImage}
            src={shownImage}
            alt={`${product.name}${color ? ` - ${color.name}` : ""}`}
            width={900}
            height={900}
            className="h-[320px] w-full animate-in fade-in object-contain p-4 mix-blend-multiply duration-500"
          />
        </div>

        <div>
          {product.badge && (
            <span className="mb-2 inline-block rounded-full bg-gold-gradient px-3 py-1 text-[11px] font-extrabold text-accent-foreground shadow-soft">
              {product.badge}
            </span>
          )}
          <h1 className="text-2xl font-extrabold">{product.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="text-xl font-extrabold text-burgundy">{bhd(priceOf(variant.price))}</p>
            {discount > 0 && (
              <>
                <span className="text-sm font-bold text-muted-foreground line-through">
                  {bhd(variant.price)}
                </span>
                <span className="rounded-full bg-burgundy px-2 py-0.5 text-[11px] font-extrabold text-white">
                  خصم {discount}%
                </span>
              </>
            )}
          </div>

          <p className="mt-6 text-xs font-bold text-muted-foreground">السعة</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.variants.map((v, i) => (
              <button
                key={v.storage}
                onClick={() => setVariantIndex(i)}
                className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
                  i === variantIndex
                    ? "border-gold bg-accent text-accent-foreground"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {v.storage}
              </button>
            ))}
          </div>

          {colors.length > 0 && (
            <>
              <p className="mt-6 text-xs font-bold text-muted-foreground">
                الألوان المتاحة{color ? ` — ${color.name}` : ""}
              </p>
              <div className="mt-2 flex flex-wrap gap-3">
                {colors.map((c, i) => (
                  <button
                    key={`${c.name}-${i}`}
                    onClick={() => setColorIndex(i)}
                    title={c.name}
                    aria-label={c.name}
                    className={`flex flex-col items-center gap-1 rounded-xl border p-2 transition-all ${
                      i === colorIndex ? "border-gold ring-2 ring-gold/40" : "border-border"
                    }`}
                  >
                    {c.image ? (
                      <img
                        src={c.image}
                        alt={c.name}
                        width={120}
                        height={120}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <span
                        className="h-8 w-8 rounded-full border border-border"
                        style={{ background: c.hex || "#e2e8f0" }}
                      />
                    )}
                    <span className="text-[10px] font-bold">{c.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          <button
            onClick={() =>
              add(product, variant.storage, priceOf(variant.price), color?.name, shownImage)
            }
            className="mt-8 w-full rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            أضف للسلة
          </button>
        </div>
      </div>

      <section className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-lg font-extrabold">
          نظرة عامة على <span className="text-gold-gradient">{product.name}</span>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{specs.overview}</p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {specs.specs.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs font-extrabold text-burgundy">{s.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-gold bg-surface p-6 shadow-soft">
        <h2 className="text-sm font-extrabold">📦 محتويات العلبة والضمان</h2>
        <ul className="mt-3 space-y-2">
          {boxAndWarranty.map((b) => (
            <li key={b.label} className="flex items-start gap-2 text-xs leading-relaxed">
              <span className="mt-0.5 text-burgundy">✔</span>
              <span>
                <span className="font-extrabold">{b.label}: </span>
                <span className="text-muted-foreground">{b.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
