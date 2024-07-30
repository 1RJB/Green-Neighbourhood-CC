import React from 'react';
import { CSSTransition } from 'react-transition-group';

const FadeAnimation = ({ children, ...props }) => {
  return (
    <CSSTransition
      {...props}
      timeout={300}
      classNames="fade"
      unmountOnExit
    >
      {children}
    </CSSTransition>
  );
};

export default FadeAnimation;
