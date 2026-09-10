import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { bhd, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  const { add, discount, priceOf } = useStore();
  const [variantIndex, setVariantIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const variant = product.variants[variantIndex] ?? product.variants[0]!;
  const colors = product.colors ?? [];
  const color = colors[colorIndex];
  const shownImage = color?.image || product.image;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      {discount > 0 && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-burgundy px-2 py-1 text-[10px] font-extrabold text-white shadow-soft">
          خصم {discount}%
        </span>
      )}
      {product.badge && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-gold-gradient px-2 py-1 text-[10px] font-extrabold text-accent-foreground shadow-soft">
          {product.badge}
        </span>
      )}
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="mb-2 flex h-[170px] items-center justify-center rounded-xl bg-white"
      >
        <img
          key={shownImage}
          src={shownImage}
          alt={`${product.name}${color ? ` - ${color.name}` : ""}`}
          loading="lazy"
          width={800}
          height={800}
          className="h-44 w-full animate-in fade-in object-contain p-2 mix-blend-multiply duration-500 group-hover:scale-105"
        />
      </Link>

      <Link to="/product/$id" params={{ id: product.id }} className="truncate text-sm font-bold">
        <h3 className="truncate">{product.name}</h3>
      </Link>

      <div className="mt-2 flex flex-wrap gap-1">
        {product.variants.map((v, i) => (
          <button
            key={v.storage}
            onClick={() => setVariantIndex(i)}
            className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold transition-colors ${
              i === variantIndex
                ? "border-gold bg-accent text-accent-foreground"
                : "border-border bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            {v.storage}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="shrink-0 rounded-lg bg-surface px-2 py-1 text-xs font-extrabold text-burgundy">
              {bhd(priceOf(variant.price))}
            </span>
            {discount > 0 && (
              <span className="text-[11px] font-bold text-muted-foreground line-through">
                {bhd(variant.price)}
              </span>
            )}
          </div>
        </div>

        {colors.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {colors.map((c, i) => (
              <button
                key={`${c.name}-${i}`}
                onClick={() => setColorIndex(i)}
                title={c.name}
                aria-label={c.name}
                aria-pressed={i === colorIndex}
                className={`h-4 w-4 shrink-0 rounded-full border-[1.5px] border-white ring-1 ring-border transition-all duration-200 ${
                  i === colorIndex
                    ? "scale-110 outline outline-[1.5px] outline-offset-[2px] outline-burgundy"
                    : "hover:scale-105"
                }`}
                style={{ background: c.hex || "#e2e8f0" }}
              />
            ))}
          </div>
        )}

        {color && (
          <p className="text-center text-[10px] font-bold text-muted-foreground">{color.name}</p>
        )}
      </div>

      <button
        onClick={() =>
          add(product, variant.storage, priceOf(variant.price), color?.name, shownImage)
        }
        className="mt-3 w-full rounded-xl bg-primary py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
      >
        أضف للسلة
      </button>
    </article>
  );
}
