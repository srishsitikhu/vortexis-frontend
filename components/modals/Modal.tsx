import { AnimatePresence, easeInOut, motion } from "framer-motion";
import { X } from "lucide-react";
import React from "react";

type ModalProps = {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({
  children,
  isOpen,
  className,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-neutral-darker/20 fixed inset-0 z-40 flex items-center justify-center overflow-y-auto p-4"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.3, ease: easeInOut }}
            className={`section relative flex max-h-[90vh] max-w-4xl flex-col overflow-y-auto ${className}`}
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
          >
            <X
              onClick={onClose}
              className="text-neutral-dark hover:text-neutral-darker absolute cursor-pointer self-end transition-all duration-300 active:scale-90"
            />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export { Modal };
