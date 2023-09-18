/* eslint-disable */
import { useState } from "react";

import { useSupabase } from "@/lib/context/SupabaseProvider";

export const useGoogleLogin = () => {
  const { supabase } = useSupabase();

  const [isPending, setIsPending] = useState(false);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    setIsPending(false);
    if (error) {
      alert("something went wrong!");
    }
  };

  return {
    signInWithGoogle,
    isPending,
  };
};
