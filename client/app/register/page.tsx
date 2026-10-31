import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import { safeNext } from "@/lib/auth-redirect";

export const metadata: Metadata = { title: "Create account | Ember" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <RegisterForm next={safeNext(next)} />;
}