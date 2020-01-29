import { PanelData } from '@grafana/data';
import { PerspectivePanel as PerspectivePanelOriginal } from './PerspectivePanel';
import { shallow } from 'enzyme';
import React from 'react';

jest.mock('./transformers', () => ({
  toPerspectiveData: input => input,
}));

jest.mock('@finos/perspective-viewer', () => {});
jest.mock('@finos/perspective-viewer-d3fc', () => {});
jest.mock('@finos/perspective-viewer-hypergrid', () => {});

/*jest.mock('@grafana/runtime', () => ({
  config: {
    theme: {
      get isDark() {
        return mockedIsDark;
      },
    },
  },
}));*/

class PerspectivePanel extends PerspectivePanelOriginal {
  componentDidMount() {
    this.viewer.current = mockedViewer;
    super.componentDidMount();
  }
}

const mockedViewer = {
  addEventListener: jest.fn(),
  load: jest.fn().mockResolvedValue(),
  notifyResize: jest.fn(),
  save: jest.fn().mockReturnValue({}),
  toggleConfig: jest.fn().mockResolvedValue(),
};

const mockedHeight = 100;
const mockedWidth = 200;

const mockedData: PanelData = {
  series: [
    { name: 'AA', values: [0, 1, 2, 3] },
    { name: 'BB', values: [4, 5, 6, 7] },
  ],
};

//let mockedIsDark;

const createPanel = config => {
  const { data, height, options, width } = {
    data: mockedData,
    height: mockedHeight,
    options: {},
    width: mockedWidth,
    ...config,
  };

  return <PerspectivePanel data={data} height={height} options={options} width={width} />;
};

describe('PerspectivePanel', () => {
  beforeEach(() => {
    Object.values(mockedViewer).forEach(method => method.mockReset());
    //mockedIsDark = true;
  });

  it('contains a custom element', () => {
    const viewers = shallow(createPanel()).find('perspective-viewer');
    expect(viewers).toHaveLength(1);
  });

  // @todo when possible: https://github.com/finos/perspective/issues/865
  /*it('supports dark and light themes', () => {
    const wrapper = shallow(createPanel());
    const viewer = wrapper.find('perspective-viewer').first();

    expect(viewer.hasClass('perspective-viewer-material-dense')).toBe(false);
    expect(viewer.hasClass('perspective-viewer-material-dense-dark')).toBe(true);

    mockedIsDark = false;
    wrapper.update();
    expect(viewer.hasClass('perspective-viewer-material-dense')).toBe(true);
    expect(viewer.hasClass('perspective-viewer-material-dense-dark')).toBe(false);
  });*/

  it('passes data to the custom element upon initialization and when props change', () => {
    const { load } = mockedViewer;
    const panel = shallow(createPanel());

    expect(load).toHaveBeenCalledTimes(1);

    panel.setProps({ data: { series: [] } });
    expect(load).toHaveBeenCalledTimes(2);
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
