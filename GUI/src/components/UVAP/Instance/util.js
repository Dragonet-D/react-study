import _ from 'lodash';
import moment from 'moment';
import { DATE_FORMAT } from 'commons/constants/const';

export function handleEnginesList(data = {}) {
  const { items = [] } = data;
  data.items = items.map(item => {
    return {
      ...item,
      status: item.status ? (_.isString(item.status) ? JSON.parse(item.status) : item.status) : {},
      providerAppInfo: item.providerAppInfo
        ? _.isString(item.providerAppInfo)
          ? JSON.parse(item.providerAppInfo)
          : item.providerAppInfo
        : {},
      availableOptions: item.availableOptions
        ? _.isString(item.availableOptions)
          ? JSON.parse(item.availableOptions)
          : item.availableOptions
        : [],
      labels: _.isNil(item.labels) || item.labels === '' ? [] : item.labels
    };
  });
  return data;
}
export function handleInstanceData(data = {}) {
  delete data.parameters;
  delete data.sourceDetails;
  delete data.schedule;
  return data;
}

export function handleCheckedChannelItem(data, id, checked) {
  return data.map(item => {
    if (item.channelId === id) {
      return {
        ...item,
        checked
      };
    }
    if (checked) {
      return {
        ...item,
        checked: false
      };
    }
    return item;
  });
}
export function handleCheckedFileItem(data, id, checked) {
  return data.map(item => {
    if (item.id === id) {
      return {
        ...item,
        checked
      };
    }
    if (checked) {
      return {
        ...item,
        checked: false
      };
    }
    return item;
  });
}
export function handleCheckedItem(data, id, checked) {
  // return data.map(item => {
  //   if (item.id === id) {
  //     return {
  //       ...item,
  //       checked
  //     };
  //   }
  //   return item;
  // });
  return data.map(item => {
    if (item.appId === id) {
      return {
        ...item,
        checked
      };
    }
    if (checked) {
      return {
        ...item,
        checked: false
      };
    }
    return item;
  });
}

export function handleJoinCheckedItem(data) {
  const ids = data.map(item => item.appId);
  return _.join(ids, ',');
}

export function handleGetSourceList(id, gateway, engineList) {
  const currentGateway = handleGetCurrentGateway(id, gateway, engineList);
  return currentGateway.sourceProviders || [];
}

function handleGetCurrentGateway(id, gateway, engineList) {
  if (id === '' || _.isNil(id)) return {};
  const selectEngines = engineList.filter(engine => engine.appId === id);
  if (selectEngines.length === 0) return {};
  const selectGateways = gateway.filter(item => item.id === selectEngines[0].vaGatewayId);
  return selectGateways[0] || {};
}

export function handleInitCheckedItems(id, list) {
  return list.filter(item => item.appId === id);
}

export function handleInitCheckedList(id, list, idText) {
  return _.cloneDeep(
    list.map(item => ({
      ...item,
      checked: item[idText] === id
    }))
  );
}

export function handleGetArgumentsList(provider, list) {
  const provideritem = list.filter(item => item.provider === provider)[0];
  return provideritem ? provideritem.availableArguments : [];
}

export function handleInitRecordingList(list) {
  return list.map((item, index) => ({
    id: index,
    name: `${moment(_.toNumber(item.start)).format(DATE_FORMAT)} - ${moment(
      _.toNumber(item.end)
    ).format(DATE_FORMAT)}`,
    value: `${item.start}-${item.end}`
  }));
}

export function handleGetAvailableOptions(id, list) {
  if (_.isNil(list)) return [];
  const currentItem = list.filter(item => item.appId === id);
  if (currentItem.length === 1) return currentItem[0].availableOptions;
  else return [];
}

export function handleGetChannelNode(id, list, type) {
  const { items } = list;
  if (type === 'live') {
    if (items) {
      const currentItem = items.filter(item => item.channelId === id);
      if (currentItem.length === 1) {
        currentItem[0].name = currentItem[0].channelName;
        return currentItem;
      }
      return [];
    }
    return [];
  } else {
    if (items) {
      const currentItem = items.filter(item => item.channelId === id);
      if (currentItem.length === 1) {
        currentItem[0].name = currentItem[0].channelName;
        return currentItem[0];
      }
      return {};
    }
    return {};
  }
}

export const getCurrentTimeInMinutes = newDate => {
  const currentTime = new Date();
  const currentTimeString = new Date(currentTime.toLocaleDateString()).getTime();
  const time = _.parseInt(newDate) - _.parseInt(currentTimeString);
  return _.parseInt(time / 1000 / 60);
};

export const getCurrentTimeWithMinutes = time => {
  const currentTime = new Date();
  const currentTimeString = new Date(currentTime.toLocaleDateString()).getTime();
  const currentDateString = _.parseInt(time * 1000 * 60) + _.parseInt(currentTimeString);

  return currentDateString;
};

export const handleFrsGroupList = (list, appId) => {
  return list
    .map(item => {
      const libraryWithApp = item.faceLibraries[_.findIndex(item.faceLibraries, { appId })];
      // const librariesWithApp = item.faceLibraries.filter(item => item.appId === appId)[0];
      return {
        name: item.name,
        id: item.id,
        libraryId: libraryWithApp
          ? // item.faceLibraries.filter(item => item.appId === appId).map(item => item.libraryId)
            libraryWithApp.libraryId
          : null
      };
    })
    .filter(item => !_.isNil(item.libraryId));
};
