import _ from 'lodash';

export const INSTANCE_STATUS_START = ['COMPLETED', 'NOT_STARTED', 'ERROR', 'STOPPED'];
export const INSTANCE_STATUS_STOP = ['PREPARING_SOURCE', 'RUNNING'];
export const INSTANCE_STATUS_DISABLED = ['PREPARING_SOURCE', 'WAITING'];

export const INSTANCE_STATUS_ACTIVATE = 'true';
export const INSTANCE_STATUS_DEACTIVATE = 'false';

export function handleInstanceList(list) {
  return list.map(item => ({
    ...item,
    status: item.status ? JSON.parse(item.status) : {},
    sourceDetails: item.sourceDetails ? JSON.parse(item.sourceDetails) : {},
    parameters: item.sourceDetails ? JSON.parse(item.sourceDetails) : []
  }));
}

export function handleUpdateListData(list, message, id) {
  if (_.isEmpty(list) || _.isEmpty(message) || _.isNil(message.data)) return list;
  list = list.map(item => {
    if (item[id] === message.data.id) {
      return {
        ...item,
        ...message.data
      };
    } else {
      return item;
    }
  });
  return list;
}
