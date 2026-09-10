import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { isBranch, navTree, type NavLeaf } from "@/lib/nav";
import { useStore } from "@/lib/store";

export function CategoryDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { setFilter } = useStore();
  const navigate = useNavigate();
  const [openGroup, setOpenGroup] = useState<string | null>("Apple iPhone");
  const [openBranch, setOpenBranch] = useState<string | null>(null);

  function pick(leaf: NavLeaf) {
    setFilter({ category: leaf.category, query: leaf.query, label: leaf.label });
    onClose();
    void navigate({ to: "/" });
  }

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-primary/30 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 h-dvh w-[86%] max-w-sm overflow-y-auto border-l border-border bg-background shadow-lift transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <span className="text-sm font-extrabold">
            <span className="text-gold-gradient">تصفح الأقسام</span> 👑
          </span>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="rounded-full border border-border px-3 py-1 text-xs font-bold text-muted-foreground"
          >
            إغلاق ✕
          </button>
        </div>

        <div className="p-3">
          <button
            onClick={() =>
              pick({ label: "كل الأجهزة", category: "all", query: "" })
            }
            className="mb-3 w-full rounded-xl bg-gold-gradient px-4 py-3 text-right text-xs font-extrabold text-primary-foreground"
          >
            كل الأجهزة
          </button>

          {navTree.map((g) => (
            <div key={g.label} className="mb-2 overflow-hidden rounded-2xl border border-border">
              <button
                onClick={() => setOpenGroup(openGroup === g.label ? null : g.label)}
                className="flex w-full items-center justify-between bg-surface px-4 py-3 text-sm font-extrabold"
              >
                <span>
                  {g.icon} {g.label}
                </span>
                <span className="text-muted-foreground">
                  {openGroup === g.label ? "−" : "+"}
                </span>
              </button>

              {openGroup === g.label && (
                <div className="bg-card px-2 py-2">
                  {g.children.map((c) =>
                    isBranch(c) ? (
                      <div key={c.label}>
                        <button
                          onClick={() =>
                            setOpenBranch(openBranch === c.label ? null : c.label)
                          }
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold hover:bg-accent"
                        >
                          <span>{c.label}</span>
                          <span className="text-muted-foreground">
                            {openBranch === c.label ? "▾" : "◂"}
                          </span>
                        </button>
                        {openBranch === c.label && (
                          <div className="mr-3 border-r border-border pr-2">
                            {c.children.map((leaf) => (
                              <button
                                key={leaf.label}
                                onClick={() => pick(leaf)}
                                className="block w-full rounded-lg px-3 py-2 text-right text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                              >
                                {leaf.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        key={c.label}
                        onClick={() => pick(c)}
                        className="block w-full rounded-lg px-3 py-2 text-right text-xs font-bold text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        {c.label}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
