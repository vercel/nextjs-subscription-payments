import React from 'react';
import cn from 'classnames';
import s from './Text.module.css';

const Text = ({ style, className = '', variant = 'body', children }) => {
  const componentsMap = {
    body: 'p',
    heading: 'h1',
    pageHeading: 'h1',
    sectionHeading: 'h2'
  };

  const Component = componentsMap[variant];

  return (
    <Component
      className={cn(
        s.root,
        {
          [s.body]: variant === 'body',
          [s.heading]: variant === 'heading',
          [s.pageHeading]: variant === 'pageHeading',
          [s.sectionHeading]: variant === 'sectionHeading'
        },
        className
      )}
      style={style}
    >
      {children}
    </Component>
  );
};

export default Text;
