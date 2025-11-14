import { useTranslations } from "next-intl";

type Props = {
  urlBase: string;
};

export function EmptyCart({ urlBase }: Readonly<Props>) {
  const t = useTranslations("Cart");
  return (
    <div className="border-t-neutral-black-10 border-b-neutral-black-10 flex w-full flex-col items-center justify-center gap-6 border-t-1 border-b-1 pt-10 pb-10">
      <div className="flex flex-col items-center justify-center gap-4">
        <div
          className="font-roboto-condensed text-2xl font-bold uppercase"
          data-testid="cart-empty"
        >
          {t("cartEmpty")}
        </div>
        <div className="font-roboto text-lg">{t("addProducts")}</div>
      </div>
      <a
        href={`${urlBase}/homeowner.html`}
        className="bg-tertiary-dark-cyan font-roboto-condensed hover:bg-secondary-cyan rounded-xs px-4 py-3 text-base font-bold text-white"
      >
        {t("continueShopping")}
      </a>
    </div>
  );
}
