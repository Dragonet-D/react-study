import _ from 'lodash';

export const ENGINES_STATUS_ENABLED = 'OK';
export const ENGINES_STATUS_DISABLED = 'DISABLED';

export function handleEnginesList(data) {
  if (!_.isArray(data)) return [];
  return data.map(item => {
    return {
      ...item,
      status: item.status ? JSON.parse(item.status) : {},
      providerAppInfo: item.providerAppInfo ? JSON.parse(item.providerAppInfo) : {},
      availableOptions: item.availableOptions ? JSON.parse(item.availableOptions) : [],
      labels: item.labels ? JSON.parse(item.labels) : []
    };
  });
}

export function handleEnginesListWithGroup(data, id) {
  if (!_.isArray(data)) return [];
  // let groupId = [];
  return data.map(item => {
    let checked = false;
    // const defaultGroup = item.groupInfo[_.findIndex(item.groupInfo, { groupId: id })]
    //   ? item.groupInfo[_.findIndex(item.groupInfo, { groupId: id })]
    //   : {};
    // const currentGroupIndex = _.findIndex(item.groupInfo, { groupId: id });
    // if (_.indexOf(item.groupId, id) !== -1) checked = true;
    // if (currentGroupIndex !== -1) checked = true;
    if (_.indexOf(item.groupIds, id) !== -1) checked = true;
    return {
      ...item,
      checked,
      // remaining: checked ? item.groupInfo[currentGroupIndex].remaining : defaultGroup.remaining,
      // assignLicense: checked
      //   ? item.groupInfo[currentGroupIndex].assignLicense
      //   : defaultGroup.assignLicense,
      // groupInfo: checked ? item.groupInfo[currentGroupIndex] : {},
      status: item.status ? JSON.parse(item.status) : {},
      providerAppInfo: item.providerAppInfo ? JSON.parse(item.providerAppInfo) : {},
      availableOptions: item.availableOptions ? JSON.parse(item.availableOptions) : [],
      labels: _.isNil(item.labels) || item.labels === '' ? [] : JSON.parse(item.labels)
    };
  });
}

export function handleUpdateListData(list, message, id) {
  if (_.isEmpty(list) || _.isEmpty(message) || _.isNil(message.data)) return list;
  list = list.map(item => {
    if (item[id] === message.data.id) {
      delete message.data.id;
      return {
        ...item,
        ...message.data
      };
    }
    return item;
  });
  return list;
}
