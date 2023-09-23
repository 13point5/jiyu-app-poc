"use client";

import { useEffect } from "react";

import { useSupabase } from "@/lib/context/SupabaseProvider";
import { redirectToPreviousPageOrChatPage } from "@/lib/router";
import { GoogleLoginButton } from "@/app/(auth)/login/components/GoogleLogin";
import { Suspense } from "react";

const Main = () => {
  const { session } = useSupabase();

  useEffect(() => {
    if (session?.user !== undefined) {
      redirectToPreviousPageOrChatPage();
    }
  }, [session?.user]);

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
