import { PanelPlugin } from '@grafana/data';
import React, { PureComponent } from 'react';
import * as module from './module';

jest.mock('./PerspectivePanel', () => class PerspectivePanel extends PureComponent {});

describe('module', () => {
  it('exports a plugin', () => {
    expect(module.plugin).toBeInstanceOf(PanelPlugin);
  });
});
