"use client";

import React from "react";
import { Button, Variant } from "../general/Button";
import { Modal } from "./Modal";

type ConfirmationModalType = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonVariant?: Variant;
};

const ConfirmationModal: React.FC<ConfirmationModalType> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  confirmButtonVariant = "primary",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="flex max-w-xl flex-col gap-4 rounded-md p-4"
    >
      <h2 className="text-base font-semibold">{title}</h2>
      <p>{description}</p>
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={onClose}
          type="button"
          text={cancelButtonText}
        />
        <Button
          variant={confirmButtonVariant}
          onClick={onConfirm}
          type="button"
          text={confirmButtonText}
        />
      </div>
    </Modal>
  );
};

export { ConfirmationModal };
