import { TextInput } from 'common/form/text-input';
import { Modal } from 'common/modal/modal';
import * as React from 'react';

interface IUpdateInstructionsProps {
  onClose: () => void;
}

export class UpdateInstructions extends React.Component<IUpdateInstructionsProps> {
  public render() {
    return (
      <Modal title='Update Application' onClose={this.props.onClose}>
        <div className='h-padding b-padding'>
          <p>Stop (CTRL + C) the process and enter the following command to update</p>
          <TextInput disabled={true} type='text' value='sh update.sh'/>
        </div>
      </Modal>
    );
  }
}
