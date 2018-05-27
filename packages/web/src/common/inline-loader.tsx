import * as React from 'react';

interface IInlineLoaderProps {
  onClick?: () => void;
  style?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
  className?: string;
}

export const InlineLoader = (props: IInlineLoaderProps) => (
  <span className={`${props.onClick ? 'clickable' : ''} ${props.className || ''}`} style={props.style} onClick={props.onClick}>
    <img src='/images/three-dots.svg' alt='Loading' style={props.imgStyle || { height: '10px' }} />
  </span>
);
