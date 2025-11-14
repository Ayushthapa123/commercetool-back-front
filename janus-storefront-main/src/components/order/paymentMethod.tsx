import { AddressText } from "@/components/addressText";
import { AddressModel } from "@/lib/models/addressModel";
import { PaymentMethodModel } from "@/lib/models/paymentMethodModel";
import { useTranslations } from "next-intl";

type Props = {
  billingAddress: AddressModel;
  paymentMethod: PaymentMethodModel;
};

export function PaymentMethod({
  billingAddress,
  paymentMethod,
}: Readonly<Props>) {
  const t = useTranslations("OrderDetails");
  return (
    <div className="border-tertiary-neutral-10 flex flex-col gap-4 rounded-sm border-1 p-6 text-sm">
      <div className="text-2xl font-bold uppercase">{t("paymentMethod")}</div>
      <div>
        <div className="font-bold">{paymentMethod.cardType} Card</div>
        <div>
          {`${paymentMethod.type} ${paymentMethod.description} •••• ${paymentMethod.lastFour}`}
        </div>
        <div>{paymentMethod.date}</div>
      </div>
      <div>
        <div className="font-bold">{t("billingAddress")}</div>
        <AddressText address={billingAddress} renderPhone={true}></AddressText>
      </div>
      <div className="text-neutral-black-70">{t("paymentMethodDetails")}</div>
    </div>
  );
}
