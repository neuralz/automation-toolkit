import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Button } from '../form/button';
import { Modal } from './modal';

export interface IConfirmModalProps {
  title: string;
  submitText: string;
  onSubmit: () => Promise<void>;
  onClose: () => void;
  onError: (err: any) => void;
}

@observer
export class ConfirmModal extends React.Component<IConfirmModalProps> {
  @observable private isProcessing = false;

  public render() {
    return (
      <Modal title={this.props.title} onClose={this.props.onClose}>
        <form onSubmit={this.onSubmit} className='form'>
          {this.props.children}
          <div className='t-padding'>
            <Button type='submit' className='button primary fw' isProcessing={this.isProcessing}>
              {this.props.submitText}
            </Button>
          </div>
        </form>
      </Modal>
    );
  }

  private readonly onSubmit: React.ChangeEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();

    this.isProcessing = true;
    try {
      await this.props.onSubmit();
      this.props.onClose();
    } catch (err) {
      this.props.onError(err);
    }
    this.isProcessing = false;
  }
}
