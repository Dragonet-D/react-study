import _ from 'lodash';

export function getActiveData(columns) {
  const result = columns.filter(item => _.get(item, 'sorter.active'));
  return result.length ? result[0].title : '';
}
