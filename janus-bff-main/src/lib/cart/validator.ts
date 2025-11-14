import { currencies, CurrencyIso, currencyToCountries } from "@/lib/currency";
import { InvalidFieldError, RequiredFieldError } from "@/lib/exception";
import { Nullable, Validator } from "@/lib/types";
import { _BaseAddress, CartUpdateAction } from "@commercetools/platform-sdk";

type CartContext = {
  locale: string;
  currency: CurrencyIso;
};

export class UpdateActionValidator implements Validator<CartUpdateAction> {
  private readonly context: CartContext;

  constructor(locale: Nullable<string>, currency: Nullable<string>) {
    if (!currency) {
      throw new RequiredFieldError("Currency is a required field", "currency");
    }

    if (!locale) {
      throw new RequiredFieldError("Locale is a required field", "locale");
    }

    const currencyIso = currencies.find((iso) => iso === currency);
    if (!currencyIso) {
      throw new InvalidFieldError(
        "Invalid currency iso provided",
        "currency",
        currency,
        currencies,
      );
    }

    const context: CartContext = {
      locale: locale,
      currency: currencyIso,
    };

    this.context = context;
  }

  validate(obj: CartUpdateAction) {
    const action = obj.action;
    switch (action) {
      case "setShippingAddress":
        this.validateShippingAddress(obj.address);
    }
  }

  private validateShippingAddress(address: _BaseAddress | undefined) {
    if (!address) {
      throw new RequiredFieldError("Missing required address", "address");
    }

    const allowedCountries = currencyToCountries[this.context.currency];
    const validCountry = allowedCountries.find(
      (country) => country === address.country,
    );

    if (!validCountry) {
      throw new InvalidFieldError(
        "Invalid country provided",
        "country",
        address.country,
        allowedCountries,
      );
    }
  }
}
