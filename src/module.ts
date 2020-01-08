import { defaults, PerspectiveOptions } from './types';
import { PanelPlugin } from '@grafana/data';
import { PerspectivePanel } from './PerspectivePanel';

export const plugin = new PanelPlugin<PerspectiveOptions>(PerspectivePanel).setDefaults(defaults);
