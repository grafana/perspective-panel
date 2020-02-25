import { PanelEditorProps } from '@grafana/data';
import React, { PureComponent } from 'react';

export class PanelEditor extends PureComponent<PanelEditorProps> {
  render() {
    const { options } = this.props;

    return (
      <div className="section gf-form-group">
        <h5 className="section-heading">Use the panel to change display options</h5>
        <pre>{JSON.stringify(options, null, 2)}</pre>
      </div>
    );
  }
}
