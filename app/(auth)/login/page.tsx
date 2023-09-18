"use client";

import { GoogleLoginButton } from "@/app/(auth)/login/components/GoogleLogin";
import { Suspense } from "react";

const Main = () => {
  return (
    <main className="w-full flex flex-col gap-4 p-4">
      <GoogleLoginButton />
    </main>
  );
};

export default function Login() {
  return (
    <Suspense fallback="Loading...">
      <Main />
    </Suspense>
  );
}
