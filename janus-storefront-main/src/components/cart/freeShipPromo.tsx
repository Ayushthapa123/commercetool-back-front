import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartContext } from "@/lib/context/cartContext";
import { useCurrencyContext } from "@/lib/context/currencyContext";
import { formatCurrency } from "@/lib/utils";
import { useTranslations } from "next-intl";

type Props = {
  freeShipLevel: number;
  free: boolean;
};

export function FreeShipPromo({ freeShipLevel, free }: Props) {
  const { cart, loading } = useCartContext();
  const { currency, locale } = useCurrencyContext();
  const t = useTranslations("Cart");

  const mapPricing = formatCurrency(locale, currency.isoCode);
  const subTotal = cart.subTotal.value;
  const amountLeftForFreeShip = freeShipLevel - subTotal;
  const progress = (subTotal / freeShipLevel) * 100;

  return (
    <div
      id="freeShippingTrackingBlock"
      className="font-roboto rounded-sm bg-white p-2 text-xs shadow-[0px_2px_12px_0px_rgba(0,0,0,0.15)]"
    >
      {free ? (
        <div className="text-center">
          {t.rich("youEarned", {
            important: (chunks) => <span className="font-bold">{chunks}</span>,
          })}
        </div>
      ) : (
        <div className="text-center">
          {t.rich("awayFrom", {
            amount: mapPricing(amountLeftForFreeShip),
            important: (chunks) => <span className="font-bold">{chunks}</span>,
          })}
        </div>
      )}
      <div className="flex items-center justify-center gap-2">
        {loading ? (
          <Skeleton className="h-4 w-full rounded-md" />
        ) : (
          <>
            <Progress
              value={progress < 100 ? progress : 100}
              indicatorClassName="bg-secondary-cyan"
            />
            <div id="freeShippingThreshold">{mapPricing(freeShipLevel, 0)}</div>
          </>
        )}
      </div>
    </div>
  );
}
