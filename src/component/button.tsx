import type { FC } from 'react';
import type { LinkProps } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { cx } from './class-names';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'danger-outline'
  // without border, e.g. actions within a table row
  | 'ghost'
  | 'ghost-danger'
  // square, icon only: needs an aria-label (prefer visible text, e.g. ghost with icon and text)
  | 'icon'
  | 'icon-danger';

export type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonStyleProps = { variant: ButtonVariant; size?: ButtonSize };

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border border-primary-line bg-primary font-semibold text-on-primary hover:bg-primary-hover hover:text-on-primary',
  secondary: 'border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg',
  danger: 'bg-danger-solid font-semibold text-white hover:bg-danger-solid/85 hover:text-white',
  'danger-outline': 'border border-danger font-semibold text-danger hover:bg-danger-surface-hover hover:text-danger',
  ghost: 'font-medium text-fg-muted hover:bg-line hover:text-fg',
  'ghost-danger': 'font-medium text-fg-muted hover:bg-danger-surface-hover hover:text-danger-hover',
  icon: 'text-fg-muted hover:bg-line hover:text-fg',
  'icon-danger': 'text-fg-muted hover:bg-danger-surface-hover hover:text-danger-hover',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 rounded-lg px-3',
  md: 'h-10 rounded-lg px-3',
  lg: 'h-11 rounded-control px-4',
};

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'size-9 rounded-lg',
  md: 'size-10 rounded-lg',
  lg: 'size-11 rounded-control',
};

export const buttonClasses = ({ variant, size = 'lg' }: ButtonStyleProps): string => {
  const sizeClass = variant === 'icon' || variant === 'icon-danger' ? iconSizeClasses[size] : sizeClasses[size];

  return `inline-flex shrink-0 items-center justify-center gap-2 no-underline ${sizeClass} ${variantClasses[variant]}`;
};

export type AnchorButtonProps = LinkProps & ButtonStyleProps;

export const AnchorButton: FC<AnchorButtonProps> = ({ variant, size, className, ...rest }: AnchorButtonProps) => {
  return <Link {...rest} className={cx(buttonClasses({ variant, size }), className)} />;
};

export type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> &
  ButtonStyleProps;

export const Button: FC<ButtonProps> = ({ variant, size, className, type, ...rest }: ButtonProps) => {
  return <button {...rest} type={type ?? 'button'} className={cx(buttonClasses({ variant, size }), className)} />;
};
