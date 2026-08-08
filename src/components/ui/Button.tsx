import type { ComponentProps, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

type Variant = 'primary' | 'outline' | 'ghost';

const BASE =
  'inline-flex items-center justify-center gap-2 px-6 py-3 text-[0.6875rem] font-medium uppercase tracking-[0.24em] transition-[color,background-color,border-color,transform] duration-300 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-paper text-ink hover:bg-white',
  outline: 'border border-ink-line text-paper hover:border-paper hover:bg-paper hover:text-ink',
  ghost: 'text-paper-dim hover:text-paper',
};

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ComponentProps<'button'> & { variant?: Variant; children: ReactNode }) {
  return (
    <button className={`${BASE} ${VARIANTS[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; children: ReactNode }) {
  return (
    <Link className={`${BASE} ${VARIANTS[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}
