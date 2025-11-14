import { AddressText } from "@/components/addressText";
import { AddressModel } from "@/lib/models/addressModel";
import { ShippingMethodModel } from "@/lib/models/shippingMethodModel";
import { useTranslations } from "next-intl";

type Props = {
  shippingAddress: AddressModel;
  shippingMethod: ShippingMethodModel;
};

export function ShippingAddress({
  shippingAddress,
  shippingMethod,
}: Readonly<Props>) {
  const t = useTranslations("OrderDetails");
  return (
    <div className="border-tertiary-neutral-10 flex flex-col gap-4 rounded-sm border-1 p-6 text-sm">
      <div className="text-2xl font-bold uppercase">{t("shippingAddress")}</div>
      <div>
        <AddressText address={shippingAddress} renderPhone={true}></AddressText>
      </div>
      <div>
        <div className="font-bold">{t("shippingMethod")}</div>
        <div>
          {shippingMethod?.description
            ? shippingMethod?.description
            : "Standard Shipping (3-5 days). Estimated shipment within 1 business day"}
        </div>
      </div>
    </div>
  );
}
