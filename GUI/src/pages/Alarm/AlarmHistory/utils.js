import _ from 'lodash';
// handle alarm history data for table
export function handleAlarmHistory(data) {
  return data.map(item => ({
    ...item,
    checked: false
  }));
}

// handle item checked
export function handleCheckedItem(data, id, checked) {
  return data.map(item => {
    if (item.alarmDetailsUuid === id) {
      return {
        ...item,
        checked
      };
    }
    return item;
  });
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
