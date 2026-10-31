import type { Order } from "@/lib/orders";

const STEPS = [
  { key: "placed", label: "Order placed" },
  { key: "paid", label: "Paid" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
] as const;

// How far along each status is (index of the last finished step)
const REACHED: Record<Exclude<Order["status"], "cancelled">, number> = {
  pending: 0,
  paid: 1,
  shipped: 2,
  delivered: 3,
};

const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-US", { dateStyle: "medium" }) : "";

export default function OrderProgress({ order }: { order: Order }) {
  if (order.status === "cancelled") {
    return (
      <div className="mt-6 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        This order was cancelled.
      </div>
    );
  }

  const reached = REACHED[order.status];
  const dates = [formatDate(order.createdAt), formatDate(order.paidAt), "", ""];

  return (
    <ol aria-label="Order progress" className="mt-6 flex flex-col gap-4 sm:flex-row sm:gap-0">
      {STEPS.map((step, i) => {
        const done = i <= reached;
        const current = i === reached;

        return (
          <li
            key={step.key}
            aria-current={current ? "step" : undefined}
            className="relative flex items-center gap-3 sm:flex-1 sm:flex-col sm:gap-2 sm:text-center"
          >
            {/* connector: vertical on phones, horizontal from sm up */}
            {i > 0 && (
              <>
                <span
                  aria-hidden="true"
                  className={`absolute -top-4 left-3.75 h-4 w-0.5 sm:hidden ${
                    done ? "bg-ember" : "bg-cream/15"
                  }`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute right-1/2 top-4 hidden h-0.5 w-full -translate-y-1/2 sm:block ${
                    done ? "bg-ember" : "bg-cream/15"
                  }`}
                />
              </>
            )}

            <span
              aria-hidden="true"
              className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 ${
                done ? "border-ember bg-ember text-noir" : "border-cream/20 bg-noir"
              }`}
            >
              {done && !current && (
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12l5 5 9-10" />
                </svg>
              )}
              {current && <span className="h-2.5 w-2.5 rounded-full bg-noir" />}
            </span>

            <div>
              <p className={`text-sm ${done ? "font-medium" : "text-cream/50"}`}>{step.label}</p>
              {done && dates[i] && <p className="text-xs text-cream/60">{dates[i]}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}