import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import { safeNext } from "@/lib/auth-redirect";

export const metadata: Metadata = { title: "Log in | Ember" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <LoginForm next={safeNext(next)} />;
}