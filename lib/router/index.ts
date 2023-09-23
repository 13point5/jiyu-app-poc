import { RedirectType } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

type RedirectToLogin = (type?: RedirectType) => never;

export const redirectToLogin: RedirectToLogin = (type?: RedirectType) => {
  sessionStorage.setItem("previous-page", window.location.pathname);

  redirect("/login", type);
};

export const redirectToPreviousPageOrChatPage = (): void => {
  const previousPage = sessionStorage.getItem("previous-page");
  if (previousPage === null) {
    redirect("/dashboard");
  } else {
    sessionStorage.removeItem("previous-page");
    redirect(previousPage);
  }
};
