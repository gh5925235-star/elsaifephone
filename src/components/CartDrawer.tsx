import { useNavigate } from "@tanstack/react-router";
import { bhd } from "@/lib/products";
import { useStore } from "@/lib/store";

export function CartDrawer() {
  const { open, setOpen, items, setQty, remove, total } = useStore();
  const navigate = useNavigate();

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex h-dvh w-[min(24rem,90vw)] flex-col border-l border-border bg-background shadow-lift transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <h2 className="text-base font-extrabold">سلة المشتريات</h2>
          <button
            onClick={() => setOpen(false)}
            aria-label="إغلاق"
            className="rounded-full px-2 text-lg text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {items.length === 0 && (
            <p className="pt-10 text-center text-sm text-muted-foreground">
              سلتك فارغة حالياً
            </p>
          )}
          {items.map((i) => (
            <div
              key={i.key}
              className="flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft"
            >
              <img
                src={i.image}
                alt={i.name}
                loading="lazy"
                className="h-16 w-16 rounded-xl bg-surface object-contain"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{i.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {i.storage}
                  {i.color ? ` · ${i.color}` : ""}
                </p>
                <p className="mt-1 text-xs font-extrabold text-burgundy">
                  {bhd(i.price * i.qty)}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => setQty(i.key, i.qty - 1)}
                    className="h-6 w-6 rounded-full border border-border text-sm"
                  >
                    −
                  </button>
                  <span className="text-xs font-bold">{i.qty}</span>
                  <button
                    onClick={() => setQty(i.key, i.qty + 1)}
                    className="h-6 w-6 rounded-full border border-border text-sm"
                  >
                    +
                  </button>
                  <button
                    onClick={() => remove(i.key)}
                    className="mr-auto text-[11px] text-muted-foreground hover:text-destructive"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">الإجمالي</span>
            <span className="text-lg font-extrabold">{bhd(total)}</span>
          </div>
          <button
            disabled={items.length === 0}
            onClick={() => {
              setOpen(false);
              navigate({ to: "/checkout" });
            }}
            className="w-full rounded-xl bg-gold-gradient py-3 text-sm font-extrabold text-primary-foreground shadow-soft transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            متابعة الشراء ➔
          </button>
        </div>
      </aside>
    </>
  );
}
