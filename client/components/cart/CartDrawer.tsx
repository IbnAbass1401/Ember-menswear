"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/api";
import Photo from "@/components/ui/Photo";

export default function CartDrawer() {
  const { items, open, setOpen, change } = useCart();
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-40 bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        />
      )}
      {open && (
        <motion.aside
          key="panel"
          role="dialog"
          aria-label="Shopping cart"
          className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col border-l border-ember/30 bg-surface shadow-[-10px_0_50px_rgba(251,191,36,0.1)]"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between border-b border-ember/15 px-5 py-4">
            <h2 className="font-display text-xl font-semibold">Your cart</h2>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close cart"
              className="grid h-11 w-11 place-items-center rounded-xl text-xl text-cream/70 transition hover:text-ember"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5">
            {items.length === 0 ? (
              <p className="mt-16 text-center text-cream/60">Your cart is empty. Add something sharp.</p>
            ) : (
              items.map((item) => (
                <div key={item.key} className="flex gap-3 border-b border-ember/10 py-4">
                  <Photo src={item.image} alt={item.name} className="h-20 w-16 shrink-0 rounded-lg" />
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <p className="truncate font-semibold">{item.name}</p>
                      {item.size && <p className="text-sm text-cream/60">Size {item.size}</p>}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => change(item.key, -1)}
                        aria-label="Remove one"
                        className="grid h-10 w-10 place-items-center rounded-lg border border-ember/40 text-ember transition hover:bg-ember/15"
                      >
                        −
                      </button>
                      <span className="w-8 text-center">{item.qty}</span>
                      <button
                        onClick={() => change(item.key, 1)}
                        aria-label="Add one"
                        className="grid h-10 w-10 place-items-center rounded-lg border border-ember/40 text-ember transition hover:bg-ember/15"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="font-bold text-ember">{formatPrice(item.price * item.qty)}</p>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-ember/15 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
            <div className="flex items-center justify-between">
              <span className="text-cream/70">Subtotal</span>
              <span className="text-xl font-bold text-ember">{formatPrice(subtotal)}</span>
            </div>
            <button
              disabled
              className="mt-4 min-h-12 w-full rounded-xl bg-ember font-bold text-noir opacity-60"
            >
              Checkout
            </button>
            <p className="mt-2 text-center text-xs text-cream/50">Checkout gets built in the next steps.</p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}