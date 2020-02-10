import _ from 'lodash';

export function getRequestImageType(base) {
  if (!base) return '';
  const index = base.indexOf('base64,') + 'base64,'.length;
  return base.substring(index);
}

export function getGroupNamesByIds(data, nameData) {
  if (!_.isArray(data) || !_.isArray(nameData)) {
    return [];
  }
  const temp = data.map(item => item.appId);

  return nameData
    .filter(item => {
      return temp.includes(item.appId);
    })
    .map(item => item.name);
}

export function getGroupIdsByNames(data, ids) {
  return data
    .filter(item => {
      return ids.includes(item.name);
    })
    .map(item => item.appId);
}

export function getGroupIdByName(data, name, id = 'appId') {
  const result = data.find(item => item.name === name);
  return result ? result[id] : '';
}

// group search filter
export function groupSearchByName(data, name) {
  return data.filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
}

// get enrolled success user id
export function getUserIdFromSuccessData(res) {
  return _.get(res, 'data', '');
}
