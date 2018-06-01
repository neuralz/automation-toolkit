import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Form } from '../../common/form/form';
import { TextInput } from '../../common/form/text-input';
import { Modal } from '../../common/modal/modal';

interface IEnterPassphraseModalProps {
  message: string;
  submitText: String;
  onClose: () => void;
  onSubmit: (passphrase: string) => Promise<void>;
}

@observer
export class EnterPassphraseModal extends React.Component<IEnterPassphraseModalProps> {
  @observable private passphrase = '';

  public render() {
    return (
      <Modal title='Enter Passphrase' onClose={this.props.onClose}>
        <Form onSubmit={this.onSubmit}>
          <p>{this.props.message}</p>
          <TextInput type='password' label='Passphrase' placeholder='Passphrase' minLength={6}
            onChange={this.onPassphraseChange} value={this.passphrase} required={true} autoFocus={true} />

          <div>
            <button className='button primary fw' type='submit' disabled={!this.passphrase}>{this.props.submitText}</button>
          </div>
        </Form>
      </Modal>
    );
  }

  private readonly onPassphraseChange: React.ChangeEventHandler<HTMLInputElement> = event => this.passphrase = event.target.value;

  private readonly onSubmit = async () => {
    if (this.passphrase) {
      await this.props.onSubmit(this.passphrase);
      this.props.onClose();
    }
  }
}
