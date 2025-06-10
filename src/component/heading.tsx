import type { FC } from 'react';

export const H1: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>> = (
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>,
) => {
  return (
    <h1 {...props} className={`mb-4 border-b border-gray-200 pb-2 text-4xl font-black ${props.className ?? ''}`}>
      {props.children}
    </h1>
  );
};
