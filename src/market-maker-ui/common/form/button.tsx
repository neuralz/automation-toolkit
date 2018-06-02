import * as React from 'react';
import './button.scss';

interface IButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  isProcessing?: boolean;
}

export class Button extends React.Component<IButtonProps> {
  public render() {
    return (
      <button {...this.props}>
        {this.props.isProcessing
          ? <img src='images/button-oval.svg' />
          : this.props.children}
      </button>
    );
  }
}
