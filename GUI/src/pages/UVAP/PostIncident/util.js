import _ from 'lodash';

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
