import Image from 'next/image';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface ProductImageProps {
  imageSrc: string;
  imageAlt: string;
  imageContainerRef: React.RefObject<HTMLDivElement | null>;
  setIsModalOpen: (open: boolean) => void;
}

export default function ProductImage({
  imageSrc,
  imageAlt,
  imageContainerRef,
  setIsModalOpen,
}: ProductImageProps) {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState('50% 50%');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    setTransformOrigin(
      `${Math.max(0, Math.min(100, xPercent))}% ${Math.max(0, Math.min(100, yPercent))}%`
    );
  };

  return (
    <div
      className="relative max-w-full flex-1 overflow-hidden lg:max-w-[450px] xl:max-w-[500px]"
      ref={imageContainerRef}
    >
      {imageSrc ? (
        <div
          className="bg-neutral-light relative h-96 cursor-zoom-in lg:h-128"
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => {
            setIsImageHovered(false);
            setTransformOrigin('50% 50%');
          }}
          onMouseMove={handleMouseMove}
          onClick={() => setIsModalOpen(true)}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            height={1000}
            width={1000}
            className={`size-full object-cover transition-transform duration-300 ${
              isImageHovered ? 'scale-200' : 'scale-100'
            }`}
            style={{ transformOrigin }}
            priority
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className={`bg-opacity-50 hover:bg-opacity-70 absolute top-4 right-4 rounded-full bg-black p-3 transition-opacity duration-300`}
            aria-label="View full image"
          >
            <Search className="h-6 w-6 text-white" />
          </button>
        </div>
      ) : (
        <div className="bg-neutral-light text-text flex h-[500px] w-full items-center justify-center">
          No Image Available
        </div>
      )}
    </div>
  );
}
