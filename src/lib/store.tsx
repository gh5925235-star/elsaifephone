import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products as defaultProducts, type Product } from "./products";
import type {
  AdminSettings,
  AppUser,
  CartItem,
  Order,
  StoreFilter,
} from "./store-types";
import { discountedPrice } from "./store-types";

export type {
  AdminSettings,
  AppUser,
  CartItem,
  Order,
  OrderStatus,
  StoreFilter,
} from "./store-types";

const defaultSettings: AdminSettings = {
  payNowUrl: "https://benefit.bh/",
  deliveryFeeUrl: "https://benefit.bh/",
  benefitPayUrl: "https://benefit.bh/",
  bankName: "",
  accountName: "مؤسسة السيف للهواتف للتجارة",
  iban: "",
  storePhone: "+973 XXXXXXXX",
  storeEmail: "support@alsaifphones.com",
telegramToken: import.meta.env.VITE_TELEGRAM_TOKEN || "",
telegramChatId: import.meta.env.VITE_TELEGRAM_CHAT_ID || "",
  
  globalDiscount: 0,
};

const defaultFilter: StoreFilter = { category: "all", query: "", label: "كل الأجهزة" };

type Ctx = {
  items: CartItem[];
  add: (
    p: Product,
    storage: string,
    price: number,
    color?: string,
    image?: string,
  ) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  total: number;
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  settings: AdminSettings;
  saveSettings: (s: AdminSettings) => void;
  discount: number;
  priceOf: (baseline: number) => number;
  catalog: Product[];
  saveCatalog: (p: Product[]) => void;
  orders: Order[];
  addOrder: (o: Omit<Order, "id" | "createdAt" | "status">) => Order;
  updateOrder: (id: string, patch: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  filter: StoreFilter;
  setFilter: (f: StoreFilter) => void;
  isAdmin: boolean;
  login: (u: string, p: string) => boolean;
  logout: () => void;
  user: AppUser | null;
  signInUser: (email: string, password: string) => void;
  signOutUser: () => void;

};

const StoreContext = createContext<Ctx | null>(null);

const CART_KEY = "taj-cart";
const SETTINGS_KEY = "taj-settings";
const CATALOG_KEY = "taj-catalog";
const ORDERS_KEY = "taj-orders";
const AUTH_KEY = "taj-admin-auth";
const USER_KEY = "taj-user";
const USERS_KEY = "taj-users";


export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [catalog, setCatalog] = useState<Product[]>(defaultProducts);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<StoreFilter>(defaultFilter);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);


  useEffect(() => {
    try {
      const c = localStorage.getItem(CART_KEY);
      if (c) setItems(JSON.parse(c));
      const s = localStorage.getItem(SETTINGS_KEY);
      if (s) setSettings({ ...defaultSettings, ...JSON.parse(s) });
      const cat = localStorage.getItem(CATALOG_KEY);
      if (cat) {
        const saved: Product[] = JSON.parse(cat);
        const merged = saved.map((prod) => {
          const base = defaultProducts.find((d) => d.id === prod.id);
          if (!base) return prod;
          return base.colors
            ? { ...prod, colors: base.colors, image: base.image }
            : { ...prod, image: base.image };
        });
        const missing = defaultProducts.filter((d) => !saved.some((s) => s.id === d.id));
        setCatalog([...missing, ...merged]);
      }
      const o = localStorage.getItem(ORDERS_KEY);
      if (o) setOrders(JSON.parse(o));
      if (sessionStorage.getItem(AUTH_KEY) === "true") setIsAdmin(true);
      const u = localStorage.getItem(USER_KEY);
      if (u) setUser(JSON.parse(u));

    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const add = useCallback(
    (
      p: Product,
      storage: string,
      price: number,
      color?: string,
      image?: string,
    ) => {
      const key = `${p.id}-${storage}-${color ?? ""}`;
      setItems((prev) => {
        const found = prev.find((i) => i.key === key);
        if (found)
          return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
        return [
          ...prev,
          {
            key,
            id: p.id,
            name: p.name,
            storage,
            color,
            price,
            image: image || p.image,
            qty: 1,
          },
        ];
      });
      setOpen(true);
    },
    [],
  );

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty } : i)),
    );
  }, []);

  const remove = useCallback(
    (key: string) => setItems((prev) => prev.filter((i) => i.key !== key)),
    [],
  );

  const clear = useCallback(() => setItems([]), []);

  const saveSettings = useCallback((s: AdminSettings) => {
    setSettings(s);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    } catch {
      /* ignore */
    }
  }, []);

  const saveCatalog = useCallback((p: Product[]) => {
    setCatalog(p);
    try {
      localStorage.setItem(CATALOG_KEY, JSON.stringify(p));
    } catch {
      /* ignore */
    }
  }, []);

  const persistOrders = useCallback((list: Order[]) => {
    setOrders(list);
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
    } catch {
      /* ignore */
    }
  }, []);

  const addOrder = useCallback<Ctx["addOrder"]>(
    (o) => {
      const order: Order = {
        ...o,
        id: String(Date.now()).slice(-6),
        createdAt: new Date().toISOString(),
        status: "جديد",
      };
      setOrders((prev) => {
        const next = [order, ...prev];
        try {
          localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
      return order;
    },
    [],
  );

  const updateOrder = useCallback(
  async (id: string, patch: Partial<Order>) => {
    // 1. تحديث الواجهة فوراً (الحفظ المحلي)
    setOrders((prev) => {
      const next = prev.map((o) => (o.id === id ? { ...o, ...patch } : o));
      try {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });

    // 2. إرسال التعديل إلى قاعدة بيانات Supabase
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        await fetch(`${supabaseUrl}/rest/v1/elsaifephone-orders?id=eq.${id}`, {
          method: 'PATCH', // نستخدم PATCH لتحديث الحقول المحددة فقط
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(patch) // سيتم إرسال التاريخ وأي حقل آخر يتم تعديله
        });
      }
    } catch (err) {
      console.error("خطأ في الاتصال بقاعدة البيانات:", err);
    }
  },
  []
);

        return next;
      });
    },
    [],
  );

  const deleteOrder = useCallback(
    (id: string) => persistOrders(orders.filter((o) => o.id !== id)),
    [orders, persistOrders],
  );

  const login = useCallback((u: string, p: string) => {
    if (u.trim() === "admin" && p === "admin20000") {
      setIsAdmin(true);
      try {
        sessionStorage.setItem(AUTH_KEY, "true");
      } catch {
        /* ignore */
      }
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const signInUser = useCallback((email: string, password: string) => {
    const account: AppUser = { email: email.trim().toLowerCase() };
    setUser(account);
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(account));
      const raw = localStorage.getItem(USERS_KEY);
      const list: { email: string; password: string }[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex((u) => u.email === account.email);
      if (idx >= 0) list[idx] = { email: account.email, password };
      else list.push({ email: account.email, password });
      localStorage.setItem(USERS_KEY, JSON.stringify(list));
    } catch {
      /* ignore */
    }
  }, []);

  const signOutUser = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(USER_KEY);
    } catch {
      /* ignore */
    }
  }, []);


  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items],
  );
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  return (
    <StoreContext.Provider
      value={{
        items,
        add,
        setQty,
        remove,
        clear,
        total,
        count,
        open,
        setOpen,
        settings,
        saveSettings,
        discount: Math.min(Math.max(settings.globalDiscount || 0, 0), 100),
        priceOf: (baseline: number) =>
          discountedPrice(baseline, settings.globalDiscount || 0),
        catalog,
        saveCatalog,
        orders,
        addOrder,
        updateOrder,
        deleteOrder,
        filter,
        setFilter,
        isAdmin,
        login,
        logout,
        user,
        signInUser,
        signOutUser,

      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
