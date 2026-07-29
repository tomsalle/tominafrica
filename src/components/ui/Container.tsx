import type { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
  /** `wide` pour les galeries, `prose` pour le texte long. */
  width?: 'default' | 'wide' | 'prose';
  className?: string;
};

const WIDTHS = {
  default: 'max-w-6xl',
  wide: 'max-w-[110rem]',
  prose: 'max-w-[42rem]',
} as const;

export function Container({ children, width = 'default', className = '' }: ContainerProps) {
  return (
    <div className={`mx-auto w-full px-5 sm:px-8 ${WIDTHS[width]} ${className}`}>{children}</div>
  );
}
