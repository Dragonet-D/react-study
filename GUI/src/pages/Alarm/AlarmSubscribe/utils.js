import { I18n } from 'react-i18nify';

export const EMAIL = I18n.t('alarm.config.email');
export const SMS = I18n.t('alarm.config.sms');
export const ON_SCREEN = I18n.t('alarm.config.onScreen');
export const noEmailRemind = I18n.t('alarm.remindInformation.noEmailRemind');
export const noPhoneRemind = I18n.t('alarm.remindInformation.noPhoneNumber');

export function judgeChecked(defaultData, data, choseData, target) {
  if (defaultData.includes(target)) {
    return true;
  } else {
    const result = choseData.find(item => item.alarmDefinitionUuid === data.alarmDefinitionUuid);
    if (data.includes(target) && result) {
      return true;
    }
  }
  return false;
}

function getEventTypeOrSeverity(targetData, eventType) {
  const result = targetData.find(item => {
    if (item[0] === eventType) {
      return item[1] || [];
    }
    return {};
  });
  return (result && result[1]) || '';
}

export function handleAlarmSubscribeData(dataSource, targetData) {
  const { items } = dataSource;
  const { alarmSeverity, eventType } = targetData;
  const result = [];
  items.forEach(item => {
    result.push({
      ...item,
      eventType: getEventTypeOrSeverity(eventType, item.eventType),
      alarmSeverity: getEventTypeOrSeverity(alarmSeverity, item.alarmSeverity)
    });
  });
  // eslint-disable-next-line no-param-reassign
  dataSource.items = result;
  return dataSource;
}

export function getEventTypeList(data) {
  if (data) {
    return data.map(item => item[1]);
  }
  return [];
}

// handle the data to the table data type needed
export function handleDataForTable(data) {
  if (!data.length) {
    return [];
  }
  return data.map(item => {
    return {
      key: item.alarmDefinitionUuid,
      checked: item.subscribeInd === 'Y',
      disabled: item.forceSubscribe === 'Y',
      ...item
    };
  });
}
