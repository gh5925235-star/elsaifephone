import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import heroImg from "@/assets/hero.jpg";
import { ProductCard } from "@/components/ProductCard";
import { TrustBadges } from "@/components/TrustBadges";
import { categories } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "السيف للهواتف | أجهزة أصلية بالتقسيط في البحرين" },
      {
        name: "description",
        content:
          "متجر السيف للهواتف: آيفون وسامسونج وبلايستيشن وإيربودز بأسعار بالدينار البحريني مع خطط تقسيط مرنة حتى 24 شهراً وتوصيل خلال 3 ساعات من دفع رسوم التوصيل.",
      },
      { property: "og:title", content: "السيف للهواتف | أجهزة أصلية بالتقسيط في البحرين" },
      {
        property: "og:description",
        content: "أحدث الأجهزة بالدينار البحريني مع تقسيط مرن حتى 24 شهراً وتوصيل خلال 3 ساعات من دفع رسوم التوصيل.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { catalog, filter, setFilter } = useStore();

  const list = useMemo(() => {
    const q = filter.query.trim().toLowerCase();
    return catalog.filter((p) => {
      if (p.available === false) return false;
      if (filter.category !== "all" && p.category !== filter.category) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [catalog, filter]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20">
      <section className="relative mt-4 overflow-hidden rounded-3xl border border-border shadow-soft">
        <img
          src={heroImg}
          alt="خلفية فاخرة"
          width={1600}
          height={900}
          className="h-56 w-full object-cover md:h-72"
        />
        <div className="absolute inset-0 flex flex-col justify-center bg-background/55 px-6 backdrop-blur-[2px] md:px-12">
          <p className="text-xs font-bold tracking-widest text-gold-gradient">
            ALSAIF PHONES · BAHRAIN
          </p>
          <h1 className="mt-2 max-w-md text-2xl font-extrabold leading-snug md:text-4xl">
            أجهزتك الفاخرة... بالتقسيط المريح
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            أحدث الأجهزة الأصلية في البحرين، دفعة أولى مرنة وأقساط حتى 24 شهراً، وتوصيل مرن في نفس اليوم.
          </p>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter({ category: "all", query: "", label: "كل الأجهزة" })}
          className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
            filter.category === "all" && !filter.query
              ? "border-gold bg-accent text-accent-foreground"
              : "border-border bg-surface text-muted-foreground hover:text-foreground"
          }`}
        >
          كل الأجهزة
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter({ category: c.id, query: "", label: c.label })}
            className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
              filter.category === c.id && !filter.query
                ? "border-gold bg-accent text-accent-foreground"
                : "border-border bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filter.query && (
        <p className="mt-3 text-xs font-bold text-muted-foreground">
          النتائج ضمن: <span className="text-foreground">{filter.label}</span>
        </p>
      )}

      <section className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </section>

      {list.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          لا توجد أجهزة مطابقة حالياً ضمن هذا القسم.
        </p>
      )}

      <div className="mt-10">
        <TrustBadges />
      </div>
    </div>
  );
}
