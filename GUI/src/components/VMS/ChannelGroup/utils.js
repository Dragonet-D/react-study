import _ from 'lodash';
import { I18n } from 'react-i18nify';
import msg from 'utils/messageCenter';

export const ROOT_NODE_ID = '80183152-bff1-40cc-b4ef-228c6ec5d70c';
// handle item checked
export function NoChangeInfoMsg(source = '') {
  msg.warn(I18n.t('global.popUpMsg.noChange'), source);
}
export function handleCheckedItem(data, id, checked) {
  return data.map(item => {
    if (item.channelId === id) {
      return {
        ...item,
        checked
      };
    }
    return item;
  });
}

export function handleInitCheckedItemList(data, id) {
  const checkedItems = [];
  data.map(item => {
    // const nameArr = _.split(item.groupId, ',');
    const nameArr = item.groupId;
    if (_.indexOf(nameArr, id) >= 0) {
      checkedItems.push({
        ...item,
        checked: true
      });
      return {
        ...item,
        groupId: id,
        checked: true
      };
    }
    return { ...item };
  });
  return checkedItems;
}

export function handleInitCheckedItem(data, id) {
  return data.map(item => {
    const nameArr = item.groupId;
    if (_.indexOf(nameArr, id) >= 0) {
      return {
        ...item,
        checked: true
      };
    }
    return { ...item };
  });
}

export function handleSlectedItems(items = []) {
  return {
    channels: handleChannelIdList(items),
    channelNames: handleChannelNamesList(items)
  };
}

export function handleChannelIdList(items = []) {
  return items.map(item => {
    return { channelId: item.channelId, deviceId: item.deviceId };
  });
}

export function handleChannelNamesList(items = []) {
  return items.map(item => {
    return item.channelName;
  });
}
