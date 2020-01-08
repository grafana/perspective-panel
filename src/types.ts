import { PanelProps } from '@grafana/data';
import { PerspectiveViewerOptions } from '@finos/perspective-viewer';

export interface PerspectiveOptions extends PerspectiveViewerOptions {}
export interface Props extends PanelProps<PerspectiveViewerOptions> {}

export const defaults: PerspectiveViewerOptions = {};
