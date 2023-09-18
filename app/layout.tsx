import "./globals.css";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { SupabaseProvider } from "@/lib/context/SupabaseProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Jiyu",
  description: "Interact with information with freedom",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider session={session}>{children}</SupabaseProvider>
      </body>
    </html>
  );
};

export default RootLayout;
