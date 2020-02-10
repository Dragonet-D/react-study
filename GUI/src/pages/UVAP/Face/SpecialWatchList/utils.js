import _ from 'lodash';

export function getGroupId(data) {
  const result = data.find(item => item.name === 'Special Watch List');
  if (result) {
    return result.id;
  }
  return '';
}

// handle action data
export function handleActionData(data) {
  if (_.isEmpty(data)) {
    return [];
  }
  return data.ACTION.map(item => item[1]);
}

export function handleViewDataForShowing(dataSource) {
  const { action, alarmType, data, note, status } = dataSource;
  return {
    'Alarm Type': alarmType,
    Data: data,
    'File Name': action,
    'Current Action': status,
    Comments: note
  };
}

export function filterAlarmDataByGroupId(data, groupId) {
  return data.filter(item => item.data.groupId === groupId);
}
