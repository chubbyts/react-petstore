import type { FC } from 'react';
import type { LinkProps } from 'react-router-dom';
import { Link } from 'react-router-dom';

type ColorTheme = 'blue' | 'gray' | 'green' | 'red';

const getColorThemeClasses = (colorTheme: ColorTheme) => {
  switch (colorTheme) {
    case 'blue':
      return 'bg-blue-600 hover:bg-blue-700';
    case 'gray':
      return 'bg-gray-600 hover:bg-gray-700';
    case 'green':
      return 'bg-green-600 hover:bg-green-700';
    case 'red':
      return 'bg-red-600 hover:bg-red-700';
  }
};

export const AnchorButton: FC<LinkProps & { colorTheme: ColorTheme }> = (
  props: LinkProps & { colorTheme: ColorTheme },
) => {
  const { colorTheme, className, ...rest } = props;

  return (
    <Link
      {...rest}
      className={`inline-block px-5 py-2 text-white ${getColorThemeClasses(colorTheme)} ${className ?? ''}`}
    >
      {props.children}
    </Link>
  );
};

export const Button: FC<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & { colorTheme: ColorTheme }
> = (
  props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    colorTheme: ColorTheme;
  },
) => {
  const { colorTheme, className, ...rest } = props;

  return (
    <button
      {...rest}
      className={`inline-block px-5 py-2 text-white ${getColorThemeClasses(colorTheme)} ${className ?? ''}`}
    >
      {props.children}
    </button>
  );
};
