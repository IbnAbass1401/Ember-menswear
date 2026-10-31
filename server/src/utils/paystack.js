import AppError from "./AppError.js";

const BASE = "https://api.paystack.co";

async function paystack(path, options = {}) {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new AppError("Payments are not configured yet", 500);

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new AppError("Couldn't reach the payment provider. Please try again.", 502);
  }

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.status) {
    // Log the reason on the server only (never the key)
    console.error("Paystack error:", res.status, data?.message);
    throw new AppError("The payment provider rejected the request. Please try again.", 502);
  }
  return data.data;
}

export const initializeTransaction = (body) =>
  paystack("/transaction/initialize", { method: "POST", body: JSON.stringify(body) });

export const verifyTransaction = (reference) =>
  paystack(`/transaction/verify/${encodeURIComponent(reference)}`);

// USD (what the site shows) -> kobo (what Paystack charges)
export function usdToKobo(usd) {
  const rate = Number(process.env.USD_NGN_RATE);
  if (!rate || rate <= 0) throw new AppError("Payments are not configured yet", 500);
  return { rate, kobo: Math.round(usd * rate * 100) };
}