"use client";

import changeCurrencyAction from "@/actions/changeCurrencyAction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currencySelectionEvent } from "@/lib/analytics";
import { useCartContext } from "@/lib/context/cartContext";
import { useCurrencyContext } from "@/lib/context/currencyContext";
import { CURRENCIES } from "@/lib/i18n/currency";
import { emptyCart } from "@/lib/models/cartModel";
import Image from "next/image";
import { useState } from "react";

export function CurrencyDropdown() {
  const { setCart } = useCartContext();
  const { currency: currentCurrency, setCurrency } = useCurrencyContext();
  const [open, setOpen] = useState(false);
  const submitCurrency = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedCurrency = e.target.value;
    if (selectedCurrency !== currentCurrency.isoCode) {
      currencySelectionEvent(currentCurrency.isoCode, selectedCurrency);
      setCurrency(CURRENCIES[selectedCurrency]);
    }

    e.target.form?.requestSubmit();
    setOpen(false);
  };

  const formAction = async (formData: FormData) => {
    const updatedCart = await changeCurrencyAction(formData);
    setCart(updatedCart ?? emptyCart());
  };

  const currencyRadioElements = Object.values(CURRENCIES).map((currency) => {
    return (
      <div key={currency.isoCode} className="radio">
        <label className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-normal text-nowrap">
          <input
            className="accent-secondary-cyan"
            type="radio"
            name="isoCode"
            value={currency.isoCode}
            checked={currentCurrency.isoCode === currency.isoCode}
            onChange={submitCurrency}
          />
          {currency.symbol} - {currency.isoCode}
        </label>
      </div>
    );
  });

  return (
    <DropdownMenu open={open}>
      <DropdownMenuTrigger
        id="currencyDropdownBlock"
        onClick={() => setOpen(true)}
        className="hidden w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-normal text-nowrap hover:bg-gray-50 lg:inline-flex"
      >
        {`${currentCurrency.symbol} - ${currentCurrency.isoCode}`}
        <div className="indicator-vertical-space-holder h-4 w-4">
          <Image
            src="/triangle-down.svg"
            alt="Currency dropdown icon"
            width={16}
            height={16}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          id="currencyDropdownMenuBlock"
          onInteractOutside={() => setOpen(false)}
        >
          <form action={formAction}>{currencyRadioElements}</form>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
