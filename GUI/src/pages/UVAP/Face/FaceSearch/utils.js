import _ from 'lodash';

function getData(data, target, path, operator, defaultValue) {
  if (data[path]) {
    return [
      {
        field: target,
        operator,
        value: _.get(data, path, defaultValue)
      }
    ];
  }
  return [];
}

function getPersonIds(data) {
  if (Array.isArray(data) && data.length) {
    return data.map(item => ({
      field: 'personId',
      operator: 'eq',
      value: item
    }));
  }
  return [];
}

// gte >=
export function getSearchParameters(data) {
  return [
    ...getData(data, 'confidence', 'confidenceThreshold', 'gte', 0),
    ...getData(data, 'groupId', 'groupId', 'eq', ''),
    ...getPersonIds(data.personId)
  ];
}
