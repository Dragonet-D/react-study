import _ from 'lodash';

export const TIME_TOO_SMALL = 'Value must be greater than or equal to 1';
export const TIME_TOO_BIG = 'Value must be less than or equal to 999';
export const INPUT_INT = 'Please enter a positive integer';

export function getAlarmInfo(config, target, type = 'alarmSeverity') {
  if (config[type] && target) {
    const result = config[type].find(item => item[0] === target);
    return result ? result[1] : '';
  }
  return '';
}

export function getAlarmSelectOptions(data) {
  if (data) {
    return data.map(item => item[1]);
  }
  return [];
}

export function handleEventTypes(data, source = ['Add Device', 'Delete Device']) {
  const dataIsArray = Array.isArray(data);
  const dataArr = dataIsArray ? data : [data];
  const handledEventTypes = new Set(dataArr);
  source.forEach(item => {
    if (handledEventTypes.has(item)) {
      handledEventTypes.delete(item);
    }
  });
  return [...handledEventTypes];
}

export function isEventTypesShow(eventTypes) {
  return !['Add Device', 'Delete Device'].includes(eventTypes);
}

// get target event type or alarm severity for request
export function getAlarmRequestData(config, type, target) {
  const data = config[type].find(item => item[1] === target);
  return data ? data[0] : '';
}

// handle alarm configuration delivery to user select
export function handleDeliveryToSelected(original, currentPageIds, newData) {
  const extraIds = [];
  if (original) {
    const originalData = original.split(',').filter(item => item);
    originalData.forEach(item => {
      if (!new Set(currentPageIds).has(item)) {
        extraIds.push(item);
      }
    });
    return [...extraIds, ...newData].join(',');
  } else if (!original && newData.length) {
    return newData.join(',');
  }
  return '';
}

// handle delivery to string to arr
export function handleDeliveryToArray(string) {
  if (string) {
    const arr = string.split(',');
    if (arr.length) {
      return arr.filter(item => item);
    } else {
      return [];
    }
  } else {
    return [];
  }
}

// alarm settings show subscribe
export function getForceSubscribe(data) {
  return data === 'N' ? 'Yes' : 'No';
}

// alarm settings show consolidate to single
export function getConsolidateNotification(data) {
  return data === 'N' ? 'No' : 'Yes';
}

// handle channel checked status
export function handleChannelSelect(data, sourceId) {
  if (!sourceId) {
    return data;
  }
  return data.map(item => {
    return {
      ...item,
      checked: sourceId.includes(item.channelId),
      groupName: _.isArray(item.groupName) ? item.groupName.join(',') : item.groupName
    };
  });
}

// get model id
export function getModelId(modelData, name) {
  const result = modelData.find(item => item.name === name);
  if (result) {
    return result.id || '';
  }
  return '';
}

// judge is the model id change
export function isTheModelIdChange(selectedItems, sourceId) {
  if (!selectedItems && !sourceId) {
    return true;
  }
  if ((!selectedItems && sourceId) || (selectedItems && !sourceId)) {
    return false;
  }
  const items = selectedItems.split(',');
  const sourceItems = sourceId.split(',');
  const isLengthEqual = items.length === sourceItems.length;
  if (isLengthEqual) {
    return selectedItems.split(',').every(itemData => {
      return sourceId.split(',').find(item => itemData === item) !== undefined;
    });
  }
  return isLengthEqual;
}
