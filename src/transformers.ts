import { PanelData } from '@grafana/data';

export const toPerspectiveData = ({ series }: PanelData) => {
  const { fields } = series[0];

  return fields.reduce((result, { name, values }) => {
    values.toArray().forEach((value, valueIndex) => {
      if (result[valueIndex] !== undefined) {
        result[valueIndex][name] = value;
      } else {
        result[valueIndex] = { [name]: value };
      }
    });

    return result;
  }, [] as Array<{ [x: string]: any }>);
};
