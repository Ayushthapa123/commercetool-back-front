// hooks/useModal.tsx
import { useState } from "react";
import { createPortal } from "react-dom";

type ModalRenderer<T, P> = (props: {
  onResolve: (value: T) => void;
  onReject: () => void;
  modalProps: P;
}) => React.ReactNode;

export function useModal<T, P = undefined>(renderModal: ModalRenderer<T, P>) {
  const [isOpen, setIsOpen] = useState(false);
  const [resolver, setResolver] = useState<(value: T) => void>();
  const [rejecter, setRejecter] = useState<() => void>();
  const [modalProps, setModalProps] = useState<P | undefined>();

  const openModal = (props: P) => {
    setModalProps(props);
    setIsOpen(true);
    return new Promise<T>((resolve, reject) => {
      setResolver(() => resolve);
      setRejecter(() => reject);
    });
  };

  const handleResolve = (value: T) => {
    setIsOpen(false);
    resolver?.(value);
  };

  const handleReject = () => {
    setIsOpen(false);
    rejecter?.();
  };

  const modal =
    isOpen && modalProps !== undefined
      ? createPortal(
          renderModal({
            onResolve: handleResolve,
            onReject: handleReject,
            modalProps,
          }),
          document.body,
        )
      : null;

  return { openModal, modal };
}
