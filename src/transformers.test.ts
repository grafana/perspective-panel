import { PanelData, toDataFrame } from '@grafana/data';
import { toPerspectiveData } from './transformers';

const AA = { name: 'AA', values: [0, 1, 2, 3] };
const BB = { name: 'BB', values: [4, 5, 6, 7] };
const CC = { name: 'CC', values: [8, 9, 10, 11] };

describe('toPerspectiveData', () => {
  it('transforms PanelData', () => {
    const data: PanelData = {
      series: [toDataFrame({ refId: 'AB', fields: [AA, BB] })],
    };

    expect(toPerspectiveData(data)).toEqual([
      { AA: 0, BB: 4 },
      { AA: 1, BB: 5 },
      { AA: 2, BB: 6 },
      { AA: 3, BB: 7 },
    ]);
  });

  it('ignores series indices beyond 0', () => {
    const data: PanelData = {
      series: [toDataFrame({ refId: 'AB', fields: [AA, BB] }), toDataFrame({ refId: 'AC', fields: [AA, CC] })],
    };

    expect(toPerspectiveData(data)).toEqual([
      { AA: 0, BB: 4 },
      { AA: 1, BB: 5 },
      { AA: 2, BB: 6 },
      { AA: 3, BB: 7 },
    ]);
  });
});
