import { AddressModel } from "@/lib/models/addressModel";
import { useTranslations } from "next-intl";

type Props = {
  address: AddressModel;
  boldName?: boolean;
  renderEmailPhone?: boolean;
  renderPhone?: boolean;
};

export function AddressText({
  address,
  boldName,
  renderEmailPhone,
  renderPhone,
}: Readonly<Props>) {
  const t = useTranslations("Countries");
  return (
    <>
      <div
        className={`${boldName ? "font-bold" : ""} w-full break-words whitespace-normal`}
      >
        {`${address.firstName} ${address.lastName}`}
      </div>
      <div>{address.addressLine1}</div>
      <div>{address.addressLine2}</div>
      <div>{`${address.city}, ${address.postalCode}`}</div>
      <div>{t(address.country)}</div>
      {renderPhone && <div>{address.phone}</div>}
      {renderEmailPhone && (
        <>
          <div className="mt-5">{address.email}</div>
          <div>{address.phone}</div>
        </>
      )}
    </>
  );
}
