"use client";

import { CurrencyType } from "@/lib/i18n/currency";
import React, { createContext, useContext, useState } from "react";

type CurrencyContextType = {
  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;
  locale: string;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: { isoCode: "", symbol: "" },
  setCurrency: () => {},
  locale: "",
});

type Props = {
  children: React.ReactNode;
  value: CurrencyType;
  locale: string;
};

export const CurrencyProvider = ({ children, value, locale }: Props) => {
  const [currency, setCurrency] = useState<CurrencyType>(value);
  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, locale }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export function useCurrencyContext() {
  return useContext(CurrencyContext);
}
