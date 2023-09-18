import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useGoogleLogin } from "./hooks/useGoogleLogin";

export const GoogleLoginButton = () => {
  const { isPending, signInWithGoogle } = useGoogleLogin();

  return (
    <Button
      onClick={signInWithGoogle}
      variant="default"
      type="button"
      data-testid="google-login-button"
    >
      {isPending ? <Loader2 className="mr-2" /> : "Sign In with Google"}
    </Button>
  );
};
