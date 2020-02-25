import { defaults, PerspectiveOptions } from './types';
import { PanelPlugin } from '@grafana/data';
import { PerspectivePanel } from './PerspectivePanel';
import { PanelEditor } from 'PanelEditor';

export const plugin = new PanelPlugin<PerspectiveOptions>(PerspectivePanel).setEditor(PanelEditor).setDefaults(defaults);
