"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/client-api";
import { formatPrice } from "@/lib/api";
import type { AdminUserRow } from "@/lib/admin-users";

type ListData = { total: number; page: number; pages: number; users: AdminUserRow[] };

export default function UserList() {
  const [data, setData] = useState<ListData | null>(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const load = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (query) params.set("search", query);
      const res = await apiRequest<ListData>(`/admin/users?${params}`);
      setData(res);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load users.");
    }
  }, [page, query]);

  useEffect(() => {
    load();
  }, [load]);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    setData(null);
    setPage(1);
    setQuery(searchInput.trim());
  }

  function goTo(next: number) {
    setData(null);
    setPage(next);
  }

  return (
    <div>
      <form onSubmit={onSearch} className="flex gap-2 sm:max-w-md">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or email"
          aria-label="Search users"
          className="h-12 min-w-0 flex-1 rounded-xl border border-cream/15 bg-surface px-4 text-base text-cream outline-none placeholder:text-cream/40 focus:border-ember"
        />
        <button
          type="submit"
          className="h-12 shrink-0 rounded-xl border border-cream/20 px-5 text-sm font-medium transition hover:border-ember hover:text-ember"
        >
          Search
        </button>
      </form>

      <div className="mt-5">
        {error ? (
          <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-5 text-center">
            <p className="text-sm text-red-300">{error}</p>
            <button
              type="button"
              onClick={() => {
                setError("");
                load();
              }}
              className="mt-4 h-11 rounded-xl border border-cream/20 px-5 text-sm font-medium transition hover:border-ember hover:text-ember"
            >
              Try again
            </button>
          </div>
        ) : !data ? (
          <div className="space-y-3" aria-busy="true">
            {[0, 1, 2, 3].map((n) => (
              <div key={n} className="h-24 animate-pulse rounded-2xl bg-surface" />
            ))}
          </div>
        ) : data.users.length === 0 ? (
          <div className="rounded-2xl border border-cream/10 bg-surface px-5 py-12 text-center">
            <p className="font-display text-xl font-semibold">No users found</p>
            <p className="mt-2 text-sm text-cream/70">{query ? "Try a different search." : "Nobody has signed up yet."}</p>
          </div>
        ) : (
          <>
            <p className="mb-3 text-sm text-cream/60">
              {data.total} user{data.total === 1 ? "" : "s"}
              {query ? ` matching “${query}”` : ""}
            </p>
            <ul className="space-y-3">
              {data.users.map((u) => (
                <li key={u._id} className="rounded-2xl border border-cream/10 bg-surface p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-noir font-display font-bold text-ember ring-1 ring-cream/15">
                      {u.name.trim().charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium">{u.name}</p>
                        {u.role === "admin" && (
                          <span className="rounded-full border border-ember/50 px-2 py-0.5 text-xs text-ember">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="break-all text-sm text-cream/60">{u.email}</p>
                    </div>
                  </div>

                  <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-cream/10 pt-3 text-sm">
                    <div>
                      <dt className="text-xs text-cream/50">Joined</dt>
                      <dd>{new Date(u.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-cream/50">Orders</dt>
                      <dd>{u.orders}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-cream/50">Spent</dt>
                      <dd>{formatPrice(u.spent)}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>

            {data.pages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => goTo(page - 1)}
                  className="h-11 rounded-xl border border-cream/20 px-5 text-sm font-medium transition enabled:hover:border-ember enabled:hover:text-ember disabled:opacity-40"
                >
                  ← Previous
                </button>
                <span className="text-sm text-cream/60">
                  Page {data.page} of {data.pages}
                </span>
                <button
                  type="button"
                  disabled={page >= data.pages}
                  onClick={() => goTo(page + 1)}
                  className="h-11 rounded-xl border border-cream/20 px-5 text-sm font-medium transition enabled:hover:border-ember enabled:hover:text-ember disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}