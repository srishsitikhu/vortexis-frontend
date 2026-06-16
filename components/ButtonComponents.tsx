import React from 'react';

interface ButtonProps {
  content: string;
  bg_color: string;
  color: string;
  border_color?: string;
  onClick?: () => void;
}

const ButtonComponents = ({
  content,
  bg_color,
  color,
  border_color,
  onClick
}: ButtonProps) => {
  return (
    <div
      className="border-2 px-6 py-4 responsive-content cursor-pointer rounded-sm text-center"
      style={{
        backgroundColor: bg_color,
        color: color,
        borderColor: border_color || bg_color,
      }}
      onClick={onClick}
    >
      {content}
    </div>
  );
};

export default ButtonComponents;
