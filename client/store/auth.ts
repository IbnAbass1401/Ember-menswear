import { create } from "zustand";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type Status = "idle" | "loading" | "authed" | "guest";

type AuthState = {
  user: User | null;
  status: Status;
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

async function request(path: string, body?: unknown, method = "GET") {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Can't reach the server. Check your connection and try again.");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message ?? "Something went wrong. Try again.");
  return data;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  status: "idle",

  // Runs once per page load: asks the server "who am I?" using the cookie
  async init() {
    if (get().status !== "idle") return;
    set({ status: "loading" });
    try {
      const data = await request("/auth/me");
      set({ user: data.user, status: "authed" });
    } catch {
      set({ user: null, status: "guest" });
    }
  },

  async login(email, password) {
    const data = await request("/auth/login", { email, password }, "POST");
    set({ user: data.user, status: "authed" });
  },

  async register(name, email, password) {
    const data = await request("/auth/register", { name, email, password }, "POST");
    set({ user: data.user, status: "authed" });
  },

  async logout() {
    await request("/auth/logout", {}, "POST");
    set({ user: null, status: "guest" });
  },
}));