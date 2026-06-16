import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  altText: string;
}

export default function ProductModal({ isOpen, onClose, imageSrc, altText }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center before:fixed before:inset-0 before:bg-black before:opacity-90"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      ref={modalRef}
    >
      <div className="relative w-full max-w-4xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-white p-2 transition-colors hover:bg-gray-100"
          aria-label="Close modal"
        >
          <X className="h-6 w-6 text-gray-800" />
        </button>
        <Image
          src={process.env.NEXT_PUBLIC_STATIC_URL + imageSrc}
          alt={altText}
          width={1200}
          height={1200}
          className="h-auto max-h-[80vh] w-full object-contain"
          priority
        />
      </div>
    </div>
  );
}
