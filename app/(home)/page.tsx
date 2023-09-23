"use client";

import { useEffect } from "react";

import { useSupabase } from "@/lib/context/SupabaseProvider";
import { redirectToPreviousPageOrChatPage } from "@/lib/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { session } = useSupabase();

  useEffect(() => {
    if (session?.user !== undefined) {
      redirectToPreviousPageOrChatPage();
    }
  }, [session?.user]);

  return (
    <main className="">
      <section className="w-full flex flex-col gap-4 items-center p-4">
        <h1 className="text-5xl font-bold">Jiyu</h1>

        <Link href={"/login"}>
          <Button variant="default">Login</Button>
        </Link>

        <p>homepage</p>
      </section>
    </main>
  );
}
