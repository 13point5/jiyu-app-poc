import { useRouter } from "next/navigation";
import { useState } from "react";

import { useSupabase } from "@/lib/context/SupabaseProvider";

export const useLogout = () => {
  const { supabase } = useSupabase();
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();

  const handleLogout = async () => {
    setIsPending(true);
    const { error } = await supabase.auth.signOut();
    localStorage.clear();

    if (error) {
      console.error("Error logging out:", error.message);
      alert("Error logging out");
    } else {
      router.replace("/");
    }
    setIsPending(false);
  };

  return {
    handleLogout,
    isPending,
  };
};
