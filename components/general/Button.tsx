'use client';

import { LoaderCircle } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

export type Variant = 'primary' | 'neutral' | 'outline' | 'ghost' | 'danger';

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  variant?: Variant;
  text?: string | null; // ✅ text can be null or undefined
  icon?: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
  href?: string;
  external?: boolean;
};

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-secondary-500 hover:bg-secondary-200 text-neutral-100 shadow-neutral-400 shadow-sm',
  neutral:
    'bg-neutral-400 hover:bg-neutral-400 text-neutral-800 shadow-neutral-400 shadow-sm',
  outline:
    'bg-transparent border border-neutral-400 hover:bg-neutral-400/10 text-neutral-800',
  ghost: 'bg-transparent hover:bg-neutral-800/10',
  danger: 'bg-red-500 hover:bg-danger-800 text-neutral-100 shadow-sm shadow-neutral',
};

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  variant = 'primary',
  text,
  icon,
  isLoading = false,
  loadingText,
  disabled = false,
  className,
  href,
  external = false,
  ...rest
}) => {
  const classes = `flex cursor-pointer items-center justify-center gap-2 rounded-md p-2 font-medium transition-all duration-300 active:scale-95 ${variantClasses[variant]} ${className ?? ''}`;

  const content = (
    <>
      {isLoading ? (
        <>
          {icon && <span className="h-4 w-4">{icon}</span>}
          <span>{loadingText ?? text ?? 'Loading...'}</span>
          <LoaderCircle className="h-4 w-4 animate-spin" />
        </>
      ) : icon ? (
        <div className="flex items-center gap-2">
          <span className="h-4 w-4">{icon}</span>
          {text && <span>{text}</span>}
        </div>
      ) : (
        text && <span>{text}</span>
      )}
    </>
  );

  // 🔁 Decide between button, internal link, or external anchor
  if (href) {
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={classes}
      {...rest}
    >
      {content}
    </button>
  );
};

export { Button };
