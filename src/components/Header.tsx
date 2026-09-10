import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { CategoryDrawer } from "@/components/CategoryDrawer";
import { AuthModal } from "@/components/AuthModal";

export function Header() {
  const { count, setOpen, user, signOutUser } = useStore();
  const [menu, setMenu] = useState(false);
  const [auth, setAuth] = useState(false);


  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl print:hidden">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMenu(true)}
            aria-label="فتح قائمة الأقسام"
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-xl border border-border bg-surface shadow-soft transition-colors hover:bg-accent"
          >
            <span className="h-[2px] w-5 rounded bg-foreground" />
            <span className="h-[2px] w-5 rounded bg-foreground" />
            <span className="h-[2px] w-5 rounded bg-foreground" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">👑</span>
            <span className="text-lg font-extrabold tracking-tight">
              <span className="text-gold-gradient">السيف للهواتف</span>
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link to="/" className="transition-colors hover:text-foreground">
            المتجر
          </Link>
          <Link to="/checkout" className="transition-colors hover:text-foreground">
            التقسيط
          </Link>
          <Link to="/admin" className="transition-colors hover:text-foreground">
            الإدارة
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={signOutUser}
              title={user.email}
              className="rounded-full border border-border bg-surface px-3 py-2 text-xs font-bold shadow-soft transition-colors hover:bg-accent"
            >
              👤 تسجيل الخروج
            </button>
          ) : (
            <button
              onClick={() => setAuth(true)}
              className="rounded-full bg-gold-gradient px-3 py-2 text-xs font-extrabold text-primary-foreground shadow-soft transition-transform hover:scale-105"
            >
              تسجيل الدخول
            </button>
          )}

          <button
            onClick={() => setOpen(true)}
            aria-label="السلة"
            className="relative rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold shadow-soft transition-colors hover:bg-accent"
          >
            🛍️ السلة
            {count > 0 && (
              <span className="absolute -top-2 -left-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-gradient px-1 text-[11px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      <CategoryDrawer open={menu} onClose={() => setMenu(false)} />
      <AuthModal open={auth} onClose={() => setAuth(false)} />

    </header>
  );
}
