import { MinusIcon } from "@/components/icons/minusIcon";
import { PlusIcon } from "@/components/icons/plusIcon";
import { useEffect, useState } from "react";

type Props = {
  inStock: boolean;
  quantity: number;
  setQuantity: (quantity: number) => void;
  quantityLimit?: number;
};

export function Quantity({
  inStock,
  quantity,
  setQuantity,
  quantityLimit,
}: Readonly<Props>) {
  const [inputValue, setInputValue] = useState(quantity.toString());

  useEffect(() => {
    if (quantityLimit && quantity > quantityLimit) {
      setQuantity(quantityLimit);
    }
    setInputValue(quantity.toString());
  }, [quantity, quantityLimit, setQuantity]);

  return (
    <div id="itemQuantityButton" className="flex w-35 flex-row md:w-38">
      <button
        type="button"
        className="border-neutral-black-30 text-secondary-cyan disabled:text-neutral-black-60 h-fill flex w-12 items-center justify-center border-1 hover:cursor-pointer"
        disabled={!inStock || quantity === 1}
        onClick={() => setQuantity(quantity - 1)}
      >
        <MinusIcon
          className="h-4 w-4 fill-current"
          aria-label="Decrease Quantity"
          role="img"
        />
      </button>
      <input
        type="text"
        name="quantity"
        className="border-neutral-black-30 w-fit max-w-15 border-1 text-center"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={!inStock || quantity < 1}
        onBlur={() => {
          const num = Number(inputValue);
          if (!isNaN(num) && num > 0) {
            setQuantity(num);
          } else {
            setInputValue(quantity.toString());
          }
        }}
      />
      <button
        id="quantityIncreaseBlock"
        type="button"
        className="border-neutral-black-30 text-secondary-cyan disabled:text-neutral-black-60 h-fill flex w-12 items-center justify-center border-1 hover:cursor-pointer"
        disabled={!inStock}
        onClick={() => setQuantity(quantity + 1)}
      >
        <PlusIcon
          className="h-4 w-4 fill-current"
          aria-label="Increase Quantity"
          role="img"
        />
      </button>
    </div>
  );
}
