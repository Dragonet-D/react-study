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

export function handleVapAlarmSourceData(data, config) {
  return data.map(item => {
    return {
      ...item,
      data: JSON.parse(item.data),
      sourceId: JSON.parse(item.sourceId),
      alarmSeverity: getAlarmShowData(config, 'alarmSeverity', item.alarmSeverity)
    };
  });
}

// get target event type or alarm severity for showing
export function getAlarmShowData(config, type, target) {
  if (config && config[type]) {
    const data = config[type].find(item => item[0] === target);
    return data ? data[1] : '';
  }
  return '';
}

export function handleViewDataForShowing(dataSource) {
  const { action, alarmTypeDesc, data, note, status } = dataSource;
  return {
    'Alarm Type': alarmTypeDesc,
    Data: data,
    'File Name': action,
    'Current Action': status,
    Comments: note
  };
}
