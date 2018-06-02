import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Button } from '../../common/form/button';
import { Form } from '../../common/form/form';
import { TextInput } from '../../common/form/text-input';
import { Modal } from '../../common/modal/modal';
import { flashMessageStore } from '../flash-message/flash-message-store';

interface IEnterPassphraseModalProps {
  message: string;
  submitText: String;
  onClose: () => void;
  onSubmit: (passphrase: string) => Promise<void>;
}

@observer
export class EnterPassphraseModal extends React.Component<IEnterPassphraseModalProps> {
  @observable private passphrase = '';
  @observable private isProcessing = false;

  public render() {
    return (
      <Modal title='Enter Passphrase' onClose={this.props.onClose}>
        <Form onSubmit={this.onSubmit}>
          <p>{this.props.message}</p>
          <TextInput type='password' label='Passphrase' placeholder='Passphrase' minLength={6}
            onChange={this.onPassphraseChange} value={this.passphrase} required={true} autoFocus={true} />

          <div>
            <Button className='button primary fw' isProcessing={this.isProcessing}
            type='submit' disabled={!this.passphrase}>{this.props.submitText}</Button>
          </div>
        </Form>
      </Modal>
    );
  }

  private readonly onPassphraseChange: React.ChangeEventHandler<HTMLInputElement> = event => this.passphrase = event.target.value;

  private readonly onSubmit = async () => {
    if (this.passphrase) {
      this.isProcessing = true;
      try {
        await this.props.onSubmit(this.passphrase);
        this.props.onClose();
      } catch (err) {
        flashMessageStore.addMessage({ type: 'error', content: err.message });
      }
      this.isProcessing = false;
    }
  }
}
