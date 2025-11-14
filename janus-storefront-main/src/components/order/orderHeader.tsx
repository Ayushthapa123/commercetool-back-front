import { CartModel } from "@/lib/models/cartModel";
import { useTranslations } from "next-intl";

type Props = {
  cart: CartModel;
};

export function OrderHeader({ cart }: Readonly<Props>) {
  const t = useTranslations("OrderDetails");
  const formattedDate = (() => {
    const [day, month, year] = cart.cartModifiedDate.includes(".")
      ? cart.cartModifiedDate?.split(".")
      : cart.cartModifiedDate?.split("/");
    const dateObj = new Date(Number(year), Number(month) - 1, Number(day));

    const monthName = new Intl.DateTimeFormat(cart.locale, {
      month: "long",
    }).format(dateObj);
    const dayNum = dateObj.getDate();
    const yearNum = dateObj.getFullYear();

    return `${monthName} ${dayNum}, ${yearNum}`;
  })();

  return (
    <div className="border-tertiary-neutral-10 flex flex-col gap-4 rounded-sm border-1 p-6 text-sm">
      <div className="text-2xl font-bold uppercase">
        {t("orderNumber", { orderNumber: cart.orderNumber })}
      </div>
      <div>{t("orderDateLabel", { orderDate: formattedDate })}</div>
      <div>
        <div className="font-bold">{t("contactInformation")}</div>
        <div>{cart?.shippingAddress?.email}</div>
      </div>
    </div>
  );
}
