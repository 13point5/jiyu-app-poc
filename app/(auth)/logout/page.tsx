"use client";

import { useEffect } from "react";

import { useSupabase } from "@/lib/context/SupabaseProvider";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/app/(auth)/logout/hooks/useLogout";
import { Loader2 } from "lucide-react";
import { redirectToLogin } from "@/lib/router";

export default function Logout() {
  const { handleLogout, isPending } = useLogout();

  const { session } = useSupabase();

  useEffect(() => {
    if (!session?.user) {
      redirectToLogin();
    }
  }, [session?.user]);

  return (
    <main className="">
      <section className="w-full flex flex-col gap-4 items-center p-4">
        <h1 className="text-5xl font-bold">Jiyu</h1>

        <Button variant="destructive" onClick={handleLogout}>
          {isPending ? (
            <>
              <Loader2 className="mr-2" /> Logging you out
            </>
          ) : (
            "Logout"
          )}
        </Button>
      </section>
    </main>
  );
}
