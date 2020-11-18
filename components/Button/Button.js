import cn from 'classnames';
import React, { forwardRef, useRef } from 'react';
import mergeRefs from 'react-merge-refs';
import { useButton } from 'react-aria';
import s from './Button.module.css';
import LoadingDots from '../LoadingDots';

const Button = forwardRef((props, buttonRef) => {
  const {
    className,
    variant = 'flat',
    children,
    active,
    onClick,
    width,
    Component = 'button',
    loading = false,
    disabled = false,
    style = {},
    ...rest
  } = props;
  const ref = useRef(null);
  const { buttonProps, isPressed } = useButton(
    {
      ...rest,
      onPress: onClick,
      isDisabled: disabled,
      elementType: Component
    },
    ref
  );

  const rootClassName = cn(
    s.root,
    {
      [s.slim]: variant === 'slim',
      [s.loading]: loading,
      [s.disabled]: disabled
    },
    className
  );

  return (
    <Component
      aria-pressed={active}
      data-variant={variant}
      ref={mergeRefs([ref, buttonRef])}
      {...buttonProps}
      data-active={isPressed ? '' : undefined}
      className={rootClassName}
      disabled={disabled}
      style={{
        width,
        ...style
      }}
    >
      {children}
      {loading && (
        <i className="pl-2 m-0 flex">
          <LoadingDots />
        </i>
      )}
    </Component>
  );
});

export default Button;
