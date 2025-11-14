import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { ProductModel } from "@/lib/models/productModel";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import Image from "next/image";

type Props = {
  onResolve: (confirmed: boolean) => void;
  onReject: () => void;
  modalProps: OutOfStockModalProps;
};

export type OutOfStockModalProps = {
  outOfStockItems: ProductModel[];
};

export function OutOfStockItemsModal({
  onResolve,
  onReject,
  modalProps,
}: Props) {
  const t = useTranslations("Cart");
  const { outOfStockItems } = modalProps;
  return (
    <Dialog open onOpenChange={onReject}>
      <DialogContent className="flex flex-col gap-6 px-6 pt-16 pb-6">
        <div className="flex flex-col gap-4">
          <DialogTitle className="font-roboto-condensed text-3xl font-normal">
            {t("problemWithOrder")}
          </DialogTitle>
          <div className="font-roboto text-base font-normal md:text-lg">
            {t("outOfStockModalMessage")}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-roboto text-base font-bold md:text-lg">
            {t("outOfStockProducts")}
          </div>
          {outOfStockItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-row items-center gap-2 text-base"
            >
              <div className="relative h-16 w-16 items-center justify-center">
                <Image
                  src={item.images[0].url}
                  alt={item.images[0].altText || item.name}
                  className="h-auto w-full"
                  fill
                />
              </div>
              <div>{item.name}</div>
            </div>
          ))}
        </div>
        <DialogFooter className="flex flex-col justify-end gap-2 md:flex-row">
          <Button
            variant="outline"
            onClick={() => onResolve(false)}
            className="hover:bg-neutral-black rounded-xs hover:text-white"
          >
            {t("viewCart")}
          </Button>
          <Button
            onClick={() => onResolve(true)}
            className="bg-tertiary-dark-cyan hover:bg-secondary-cyan rounded-xs text-white"
          >
            {t("removeAndCheckout")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
