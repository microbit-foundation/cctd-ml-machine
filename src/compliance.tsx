// We use the shared-assets consent API on window, which currently lacks types.
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface CookieConsent {
  analytics: boolean;
  functional: boolean;
}

export const consentContext = createContext<CookieConsent | undefined>(
  undefined
);

const config = {
  ga:
    import.meta.env.VITE_STAGE === "PRODUCTION" ||
    import.meta.env.VITE_STAGE === "STAGING"
      ? {}
      : undefined,
  custom: [
    {
      type: "cookie",
      category: "essential",
      name: "pgs-auth-jwt",
      domain: "data.microbit.org",
      purpose:
        "Session information so we know what class code you are signed in as",
    },
    {
      type: "local",
      category: "essential",
      name: "settings",
      domain: "data.microbit.org",
      purpose:
        "Used to store your settings and remember which dialogs you've opted not to be shown in future",
    },
  ],
};

const showConsent = (
  { userTriggered }: { userTriggered: boolean } = { userTriggered: false }
) => {
  const w = window as any;
  w.commonConsent?.show({ userTriggered, config });
};

const hideConsent = () => {
  const w = window as any;
  w.commonConsent?.hide();
};

export const manageCookies = () => showConsent({ userTriggered: true });

export const ConsentProvider = ({ children }: { children: ReactNode }) => {
  const [value, setValue] = useState<CookieConsent | undefined>(undefined);
  useEffect(() => {
    const w = window as any;
    const updateListener = (event: CustomEvent<CookieConsent>) => {
      setValue(event.detail);
    };
    w.addEventListener("consentchange", updateListener);
    if (w.commonConsent) {
      showConsent();
    } else {
      w.addEventListener("consentinit", showConsent);
    }
    return () => {
      w.removeEventListener("consentchange", updateListener);
      w.removeEventListener("consentinit", showConsent);
      hideConsent();
    };
  }, []);

  return (
    <consentContext.Provider value={value}>{children}</consentContext.Provider>
  );
};
export const useConsent = () => {
  return useContext(consentContext);
};
