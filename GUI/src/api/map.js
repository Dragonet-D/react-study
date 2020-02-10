import _ from 'lodash';
import fetch from 'utils/request';
import getUrl from '../utils/urls/index';

const urls = getUrl.map;
const vmsUrls = getUrl.vms;
const alarmUrls = getUrl.alarm;

export async function getTreeDataAPI(userId, filter) {
  const channelGroupTree = _.cloneDeep(vmsUrls.channelGroupTree);
  channelGroupTree.url = channelGroupTree.url.replace('{userId}', userId);
  channelGroupTree.url = filter ? `${channelGroupTree.url}?filter=${filter}` : channelGroupTree.url;
  return fetch.get(channelGroupTree);
}

export async function getRealTimeAlarmAPI(userId, sort) {
  return fetch.post(alarmUrls.getRealTimeAlarmForVMS, {
    userId,
    sort: [
      {
        key: 'time',
        sort
      }
    ]
  });
}

export async function getChannelSnapshotAPI(param) {
  return fetch.downloadPost(vmsUrls.getSnapshot, param);
}

export async function updateChannelAPI(channel) {
  return fetch.post(urls.updateChannel, channel);
}

export async function initCreateAlarmDataApi() {
  return fetch.get(alarmUrls.createAlarm);
}

export async function getLiveStreamApi(obj) {
  return fetch.post(vmsUrls.getLiveStream, {
    type: obj.type,
    deviceId: obj.deviceId,
    channelId: obj.channelId,
    channelName: obj.channelName,
    streamId: obj.streamId,
    userId: obj.userId,
    ptzInd: obj.ptzInd,
    sessionId: obj.sessionId
  });
}

export async function endStreamApi(obj) {
  const endStream = _.cloneDeep(vmsUrls.endStream);
  if (obj.type && obj.type === 'live') {
    endStream.materialKey = 'M4-102';
  } else if (obj.type && obj.type === 'playback') {
    endStream.materialKey = 'M4-105';
  }
  endStream.url = `${endStream.url}/${obj.id}/${obj.name}`;
  return fetch.del(endStream);
}

export async function controlPTZApi(obj) {
  const controlPTZ = _.cloneDeep(vmsUrls.controlPTZ);
  const value = obj.value ? obj.value : 10;
  controlPTZ.url = controlPTZ.url.replace('{device-id}', obj.deviceId);
  controlPTZ.url = `${controlPTZ.url.replace('{channel-id}', obj.channelId)}?action=${
    obj.action
  }&value=${value}&userId=${obj.userId}`;
  return fetch.put(controlPTZ, {
    ptzInd: obj.ptzInd
  });
}

// get alarm realtime
export async function getAlarmRealtimeDataApi(obj) {
  return fetch.post(alarmUrls.getRealTimeAlarmForVMS, obj);
}

export async function getAOIPolygonApi(obj) {
  const getAOIPolygonApi = _.cloneDeep(urls.getAOIPolygon);
  const arr = [];
  getAOIPolygonApi.url = getAOIPolygonApi.url.replace('{createdId}', obj.createdId);
  if (obj.zoomId || obj.zoomName) {
    getAOIPolygonApi.url = `${getAOIPolygonApi.url}?`;
    if (obj.zoomId) {
      arr.push(`zoomId=${obj.zoomId}`);
    }
    if (obj.zoomName) {
      arr.push(`zoomName=${obj.zoomName}`);
    }
    if (arr.length === 1) {
      getAOIPolygonApi.url = `${getAOIPolygonApi.url}${arr[0]}`;
    } else {
      getAOIPolygonApi.url = `${getAOIPolygonApi.url}${arr.join('&')}`;
    }
  } else {
    getAOIPolygonApi.url = getAOIPolygonApi.url.replace('/{zoomId}', '');
  }

  return fetch.get(getAOIPolygonApi);
}
export async function createPolygonApi(obj) {
  return fetch.post(urls.createPolygon, obj);
}

export async function deleteAOIApi(obj) {
  const deleteAOI = _.cloneDeep(urls.deleteAOI);
  deleteAOI.url = deleteAOI.url.replace('{geometryId}', obj.geometryId);
  deleteAOI.url = deleteAOI.url.replace('{createdId}', obj.userId);
  return fetch.del(deleteAOI, obj);
}
