// components/site/LanguageProvider.tsx
"use client";

import * as React from "react";

export type Lang = "it" | "en";

type Dictionary = typeof I18N["it"];

const I18N = {
  it: {
    header: {
      enter: "Entra in Wine Connect",
      nav: { catalog: "Catalogo", buyers: "Per Buyer", wineries: "Per Cantine", how: "Come funziona" },
    },
    hero: {
      kicker: "L’hub tra chi produce e chi compra",
      titleA: "Matchmaking su misura.",
      titleB: "Documenti e spedizioni già integrati.",
      desc:
        "Colleghiamo cantine italiane e buyer internazionali per stile, fascia prezzo e volumi. SPST gestisce accise, burocrazia e logistica end-to-end: meno attrito, più ordini.",
      ctaCatalog: "Sfoglia il catalogo",
      ctaBrief: "Invia un brief",
    },
    footer: { rights: "Tutti i diritti riservati" },
  },
  en: {
    header: {
      enter: "Enter Wine Connect",
      nav: { catalog: "Catalog", buyers: "For Buyers", wineries: "For Wineries", how: "How it works" },
    },
    hero: {
      kicker: "The hub between producers and buyers",
      titleA: "Tailored matchmaking.",
      titleB: "Docs and shipping built-in.",
      desc:
        "We match Italian wineries and international buyers by style, price range and volumes. SPST handles excise, paperwork and end-to-end logistics: less friction, more orders.",
      ctaCatalog: "Browse catalog",
      ctaBrief: "Start a brief",
    },
    footer: { rights: "All rights reserved" },
  },
} as const;

type LangContextValue = {
  lang: Lang;
  t: Dictionary;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
};

const LangContext = React.createContext<LangContextValue | null>(null);

export function useI18n(): LangContextValue {
  const ctx = React.useContext(LangContext);
  if (!ctx) throw new Error("useI18n must be used within <LanguageProvider>");
  return ctx;
}

export function LanguageProvider({ children, defaultLang = "it" as Lang }) {
  const [lang, setLang] = React.useState<Lang>(defaultLang);
  const t = I18N[lang];

  const value: LangContextValue = React.useMemo(
    () => ({
      lang,
      t,
      setLang,
      toggleLang: () => setLang((prev) => (prev === "it" ? "en" : "it")),
    }),
    [lang, t]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}
