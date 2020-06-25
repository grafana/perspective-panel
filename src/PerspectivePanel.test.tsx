import { PanelData, toDataFrame, LoadingState } from '@grafana/data';
import { PerspectivePanel as PerspectivePanelOriginal } from './PerspectivePanel';
import { shallow } from 'enzyme';
import React from 'react';

jest.mock('@finos/perspective-viewer', () => {});
jest.mock('@finos/perspective-viewer-d3fc', () => {});
jest.mock('@finos/perspective-viewer-hypergrid', () => {});

jest.mock('@grafana/runtime', () => ({
  config: {
    theme: {
      get isDark() {
        return mockedIsDark;
      },
    },
  },
}));

class PerspectivePanel extends PerspectivePanelOriginal {
  async componentDidMount() {
    (this.viewer as any).current = mockedViewer;
    super.componentDidMount();
  }
}

const mockedViewer = {
  addEventListener: jest.fn(),
  delete: jest.fn().mockResolvedValue(true),
  load: jest.fn().mockResolvedValue({}),
  notifyResize: jest.fn(),
  save: jest.fn().mockReturnValue({}),
  toggleConfig: jest.fn().mockResolvedValue(true),
};

const mockedHeight = 100;
const mockedWidth = 200;

const mockedData: PanelData = {
  state: LoadingState.Done,
  series: [
    toDataFrame({ refId: 'AA', fields: [{ name: 'AA', values: [0, 1, 2, 3] }] }),
    toDataFrame({ refId: 'BB', fields: [{ name: 'BB', values: [4, 5, 6, 7] }] }),
  ],
} as PanelData;

let mockedIsDark = false;

const createPanel = (config?: any) => {
  const props = {
    options: {}, // default empty
    ...config,
    data: mockedData,
    width: mockedWidth,
    height: mockedHeight,
  };
  return <PerspectivePanel {...props} />;
};

describe('PerspectivePanel', () => {
  beforeEach(() => {
    Object.values(mockedViewer).forEach(method => method.mockClear());
    mockedIsDark = true;
  });

  it('contains a custom element', () => {
    const viewers = shallow(createPanel()).find('perspective-viewer');
    expect(viewers).toHaveLength(1);
  });

  it('supports a dark theme', () => {
    const wrapper = shallow(createPanel());
    const viewer = wrapper.find('perspective-viewer').first();

    // @todo use `hasClass` when possible: https://github.com/finos/perspective/issues/931
    expect(viewer.matchesElement(<perspective-viewer class="perspective-viewer-material-dense" />)).toBe(false);
    expect(viewer.matchesElement(<perspective-viewer class="perspective-viewer-material-dense-dark" />)).toBe(true);
  });

  it('supports a light theme', () => {
    mockedIsDark = false;

    const wrapper = shallow(createPanel());
    const viewer = wrapper.find('perspective-viewer').first();

    // @todo use `hasClass` when possible: https://github.com/finos/perspective/issues/931
    expect(viewer.matchesElement(<perspective-viewer class="perspective-viewer-material-dense" />)).toBe(true);
    expect(viewer.matchesElement(<perspective-viewer class="perspective-viewer-material-dense-dark" />)).toBe(false);
  });

  it('passes data to the custom element upon initialization and when props change', () => {
    const { delete: deleteFn, load } = mockedViewer;
    const panel = shallow(createPanel());

    expect(load).toHaveBeenCalledTimes(1);

    panel.setProps({
      data: { ...mockedData } as PanelData,
    });
    expect(load).toHaveBeenCalledTimes(2);

    panel.setProps({
      data: ({ series: [] } as unknown) as PanelData,
    });
    expect(deleteFn).toHaveBeenCalledTimes(1);

    panel.setProps({ data: mockedData });
    expect(load).toHaveBeenCalledTimes(3);
  });

  it('passes options to the custom element upon initialization and when props change', () => {
    const panel = shallow(
      createPanel({
        options: {
          'fake-option': 'value',
        },
      })
    );

    expect(panel.containsMatchingElement(<perspective-viewer fake-option="value" />)).toBe(true);

    panel.setProps({ options: { 'fake-option': 'new value' } });
    expect(panel.containsMatchingElement(<perspective-viewer fake-option="new value" />)).toBe(true);
  });

  it('updates the custom element when dimensions change', () => {
    const { notifyResize } = mockedViewer;
    const panel = shallow(createPanel());

    panel.setProps({ height: mockedHeight - 1 });
    expect(notifyResize).toHaveBeenCalledTimes(1);

    panel.setProps({ width: mockedWidth - 1 });
    expect(notifyResize).toHaveBeenCalledTimes(2);

    panel.setProps({
      height: mockedHeight - 2,
      width: mockedWidth - 2,
    });
    expect(notifyResize).toHaveBeenCalledTimes(3);
  });
});
