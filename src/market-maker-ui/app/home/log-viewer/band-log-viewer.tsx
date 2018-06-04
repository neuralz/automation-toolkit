import * as React from 'react';
import { Dashboard } from '../../../api/api';
import { LogViewer } from './log-viewer';

interface IBandLogViewerProps {
  bandId: string;
  onClose: () => void;
}

export class BandLogViewer extends React.Component<IBandLogViewerProps> {
  public render() {
    return (
      <LogViewer onClose={this.props.onClose} logsFn={this.logsFn} />
    );
  }

  private readonly logsFn = async () => {
    return await new Dashboard.Api.LogsService().getBand({
      bandId: this.props.bandId
    });
  }
}
