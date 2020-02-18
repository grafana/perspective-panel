import { Alert } from '@grafana/ui';
import { config } from '@grafana/runtime';
import { HTMLPerspectiveViewerElement } from '@finos/perspective-viewer';
import { Props } from 'types';
import { toPerspectiveData } from './transformers';
import React, { createRef, PureComponent } from 'react';
import '@finos/perspective-viewer';
import '@finos/perspective-viewer/themes/all-themes.css';
import '@finos/perspective-viewer-d3fc';
import '@finos/perspective-viewer-hypergrid';

export class PerspectivePanel extends PureComponent<Props> {
  viewer = createRef<HTMLPerspectiveViewerElement>();
  state = {
    showNotice: true,
  };

  async componentDidMount() {
    await this.updateViewer(this.props, false);

    const viewer = this.viewer.current;

    await viewer?.toggleConfig();

    viewer?.addEventListener('perspective-config-update', () => {
      this.props.onOptionsChange(viewer.save());
    });
  }

  componentDidUpdate(prevProps: Props) {
    this.updateViewer(prevProps);
  }

  hideNotice() {
    this.setState({ showNotice: false });
  }

  async updateViewer(prevProps: Props, diff = true) {
    const viewer = this.viewer.current;

    if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
      viewer?.notifyResize();
    }

    if (this.props.data !== prevProps.data || !diff) {
      await viewer?.load(toPerspectiveData(this.props.data));
    }
  }

  render() {
    const { height, options, width } = this.props;

    const notice = !this.state.showNotice ? null : (
      <Alert onRemove={() => this.hideNotice()} severity="info" title="Only the first datum of the series is referenced for display." />
    );

    // @ts-ignore -- @todo remove this comment when toolkit's tsconfig supports ES2019
    const serializedOptions: { [x: string]: string } = Object.fromEntries(
      Object.entries(options).map(([key, value]) => {
        if (typeof value === 'string') {
          return [key, value];
        } else {
          return [key, JSON.stringify(value)];
        }
      })
    );

    return (
      <div
        style={{
          height,
          position: 'relative',
          width,
        }}
      >
        {notice}

        <perspective-viewer
          {...serializedOptions}
          // No, the following should not be `className` :)
          class={`perspective-viewer-material-dense${config.theme.isDark ? '-dark' : ''}`}
          ref={this.viewer}
          style={{
            height,
            width,

            // Avoid overlapping Grafana menus
            position: 'relative',
            zIndex: 0,
          }}
        />
      </div>
    );
  }
}
