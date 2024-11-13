'use client';

import React, { forwardRef, useRef, ButtonHTMLAttributes } from 'react';
import { mergeRefs } from 'react-merge-refs';
import cn from 'classnames';
import LoadingDots from '@/components/ui/LoadingDots';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'slim' | 'flat';
  active?: boolean;
  width?: number;
  loading?: boolean;
  Component?: React.ComponentType;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, buttonRef) => {
    const {
      className,
      variant = 'flat',
      children,
      active,
      width,
      loading = false,
      disabled = false,
      style = {},
      Component = 'button',
      ...rest
    } = props;

    const ref = useRef<HTMLButtonElement>(null);

    const rootClassName = cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
      {
        'h-10 py-2 px-4': variant === 'flat',
        'h-9 px-3': variant === 'slim',
        'bg-primary text-primary-foreground hover:bg-primary/90':
          variant === 'flat',
        'border border-input hover:bg-accent hover:text-accent-foreground':
          variant === 'slim',
        'cursor-not-allowed opacity-60': loading,
        'bg-secondary text-secondary-foreground': active
      },
      className
    );

    return (
      <Component
        ref={mergeRefs([ref, buttonRef])}
        className={rootClassName}
        aria-pressed={active}
        data-variant={variant}
        disabled={disabled || loading}
        style={{
          width,
          ...style
        }}
        {...rest}
      >
        {children}
        {loading && (
          <span className="ml-2">
            <LoadingDots />
          </span>
        )}
      </Component>
    );
  }
);

Button.displayName = 'Button';

export default Button;
