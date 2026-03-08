import LoginPageClient from "./LoginPageClient";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return <LoginPageClient initialError={params.error ?? null} />;
}