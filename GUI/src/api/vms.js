import _ from 'lodash';

import getUrls from '../utils/urls/index';
import fetch from '../utils/request';

const urls = getUrls.vms;

// /----------------------------------device

export async function getVideoDeviceListApi(obj) {
  return fetch.post(urls.videoDeviceList, obj);
}

export async function initModelsApi({ pageNo, pageSize }) {
  const model = _.cloneDeep(urls.model);
  model.url = `${model.url}?pindex=${pageNo}&psize=${pageSize}`;
  return fetch.get(model);
}

export async function getBatchUploadTaskListApi(obj) {
  return fetch.post(urls.batchUploadTaskList, obj);
}

export async function downloadFailedDevicesApi(id) {
  const downloadFailedDevices = _.cloneDeep(urls.downloadFailedDevices);
  downloadFailedDevices.url = downloadFailedDevices.url.replace('{uuid}', id);
  return fetch.downloadGet(downloadFailedDevices);
}

export async function uploadDevicesApi(obj) {
  return fetch.fileUpload(urls.addMultipleDevice, obj);
}

export async function updateDeviceApi({ payload, id }) {
  const updateDevice = _.cloneDeep(urls.updateDevice);
  updateDevice.url = `${updateDevice.url}/${id}`;
  return fetch.put(updateDevice, payload);
}

export async function addDeviceApi(obj) {
  return fetch.post(urls.addDevice, obj);
}

export async function downloadTemplateApi() {
  return fetch.downloadGet(urls.downloadTemplate);
}

export async function deleteDeviceApi(object) {
  return fetch.post(urls.delDevice, {
    deviceIds: object.deviceIds,
    userId: object.userId,
    deviceNames: object.deviceNames
  });
}

// /------------------------------------------video

export async function channelGroupTree(userId) {
  const channelGroupTree = _.cloneDeep(urls.channelGroupTree);
  channelGroupTree.url = channelGroupTree.url.replace('{userId}', userId);
  return fetch.get(channelGroupTree);
}

export async function requestPlayabck(obj) {
  return fetch.post(urls.playback, obj);
}

export async function saveBookmarkApi(bookmarkObj) {
  return fetch.post(urls.saveBookmark, {
    bookmarkComments: bookmarkObj.bookmarkComments,
    bookmarkTimestamp: bookmarkObj.bookmarkTimestamp.toString(),
    channelId: bookmarkObj.channelId,
    deviceId: bookmarkObj.deviceId,
    createdId: bookmarkObj.userId
  });
}

export async function getDefaultApi(obj) {
  const getDefault = _.cloneDeep(urls.getDefault);
  getDefault.url = `${getDefault.url}/${obj.userId}`;
  return fetch.get(getDefault);
}

export async function setDefaultApi(obj) {
  return fetch.post(urls.setDefault, obj);
}

// const initBookmarkApiFormat = {
//   type: paramObj.type,
//   channelId: paramObj.channelId,
//   channelName: paramObj.channelName,
//   deviceId: paramObj.deviceId,
//   streamId: paramObj.streamId,
//   createdId: paramObj.userId,
//   from: paramObj.from,
//   to: paramObj.to
// }
export async function initBookmarkApi(paramObj) {
  return fetch.post(urls.getBookmark, paramObj);
}

export async function endStreamApi(obj) {
  const endStream = _.cloneDeep(urls.endStream);
  if (obj.type && obj.type === 'live') {
    endStream.materialKey = 'M4-102';
  } else if (obj.type && obj.type === 'playback') {
    endStream.materialKey = 'M4-105';
  }
  endStream.url = `${endStream.url}/${obj.id}/${obj.name}`;
  return fetch.del(endStream);
}

export async function doClippingApi(obj) {
  return fetch.post(urls.doClipping, obj);
}

export async function delBookmarkApi(obj) {
  const initBookmark = _.cloneDeep(urls.initBookmark);
  const ts = new Date().getTime();
  initBookmark.materialKey = 'M4-130';
  initBookmark.url = `${initBookmark.url}/${obj.id}/${obj.createdId}/${obj.channelName}/${ts}/${obj.name}`;
  return fetch.del(initBookmark);
}

export async function getLiveStreamApi(obj) {
  // obj.refresh = !!obj.refresh && obj.refresh ? true : false
  return fetch.post(urls.getLiveStream, obj);
}

export async function getChannelPTZpresetsApi(obj) {
  const channelPTZpreset = _.cloneDeep(urls.channelPTZpreset);
  const index = obj.index ? obj.index : '';
  const name = obj.name ? obj.name : '';
  channelPTZpreset.url = channelPTZpreset.url.replace('{device-id}', obj.deviceId);
  channelPTZpreset.url = channelPTZpreset.url.replace('{channel-id}', obj.channelId);
  channelPTZpreset.url = `${channelPTZpreset.url}?index=${index}&name=${name}&pindex=${obj.pindex}&psize=${obj.psize}`;
  return fetch.get(channelPTZpreset);
}

export async function clearPTZpresetApi(obj) {
  const channelPTZpreset = _.cloneDeep(urls.channelPTZpreset);
  channelPTZpreset.url = channelPTZpreset.url.replace('{device-id}', obj.deviceId);
  channelPTZpreset.url = channelPTZpreset.url.replace('{channel-id}', obj.channelId);
  channelPTZpreset.url = `${channelPTZpreset.url}/${obj.index}`;
  return fetch.del(channelPTZpreset);
}

export async function controlPTZApi(obj) {
  const controlPTZ = _.cloneDeep(urls.controlPTZ);
  const value = obj.value ? obj.value : 10;
  controlPTZ.url = controlPTZ.url.replace('{device-id}', obj.deviceId);
  controlPTZ.url = controlPTZ.url.replace('{channel-id}', obj.channelId);
  controlPTZ.url = `${controlPTZ.url}?action=${obj.action}&value=${value}&userId=${obj.userId}`;
  return fetch.put(controlPTZ, {
    ptzInd: obj.ptzInd
  });
}

export async function setPTZpresetApi(obj) {
  const channelPTZpreset = _.cloneDeep(urls.channelPTZpreset);
  channelPTZpreset.url = channelPTZpreset.url.replace('{device-id}', obj.deviceId);
  channelPTZpreset.url = channelPTZpreset.url.replace('{channel-id}', obj.channelId);
  channelPTZpreset.url = `${channelPTZpreset.url}/${obj.index}`;
  return fetch.post(channelPTZpreset);
}

export async function updatePTZpresetApi(obj) {
  const channelPTZpreset = _.cloneDeep(urls.channelPTZpreset);
  channelPTZpreset.url = channelPTZpreset.url.replace('{device-id}', obj.deviceId);
  channelPTZpreset.url = channelPTZpreset.url.replace('{channel-id}', obj.channelId);
  channelPTZpreset.url = `${channelPTZpreset.url}/${obj.index}`;
  return fetch.put(channelPTZpreset, {
    name: obj.name
  });
}

export async function startClippingApi(obj) {
  return fetch.post(urls.startClipping, {
    deviceId: obj.deviceId,
    channelId: obj.channelId,
    userId: obj.userId
  });
}
export async function endClippingApi(obj) {
  return fetch.post(urls.endClipping, {
    start: obj.start,
    end: obj.end,
    deviceId: obj.deviceId,
    channelId: obj.channelId,
    clippingId: obj.clippingId,
    userId: obj.userId
  });
}

export async function getChannelSnapshot(infos) {
  return fetch.downloadPost(urls.getSnapshot, infos);
}
// ----------------------------------recording
export async function initRecordingChannelsApi(obj) {
  return fetch.post(urls.getChannelList, obj);
  // return fetch.post(urls.channels, obj);
}

export async function getChannelDetailListApi(object) {
  return fetch.post(urls.getChannelDetailList, object);
}

export async function getDownloadRecordingListApi(object) {
  return fetch.post(urls.getDownloadRecording, object);
}

export async function exportRecordingDownloadPostApi(object) {
  return fetch.post(urls.exportRecordingDownload, object);
}

export async function uploadRecordingApi(object) {
  return fetch.fileUpload(urls.uploadRecording, object);
}

export async function recordingTaskListApi(object) {
  return fetch.post(urls.getTaskList, {
    channelInfo: object
    // descriptionFields: object.descriptionFields
  });
}

export async function downloadApi(object) {
  return fetch.downloadPost(urls.download, object);
}

export async function batchDeleteApi(object) {
  return fetch.post(urls.batchDelete, object);
}

// -------------------------------------- request access
export async function initAccessRequestApi(object) {
  const accessAllRequests = _.cloneDeep(urls.access_AllRequests);
  accessAllRequests.url = `${accessAllRequests.url}/${object.userId}`;
  return fetch.get(accessAllRequests);
}

export async function initAllGroupsApi(object) {
  const accessAllGroups = _.cloneDeep(urls.access_AllGroups);
  accessAllGroups.url = `${accessAllGroups.url}/${object.userId}`;
  return fetch.get(accessAllGroups);
}
export async function createRequestApi(object) {
  return fetch.post(urls.access_approve_saveRequest, {
    ...object
    // requestBy: object.requestBy,
    // requestGroup: object.requestGroup,
    // requestReason: object.requestReason,
    // approvedBy: object.approvedBy,
    // requestStatus: object.requestStatus,
    // startDate: object.startDate,
    // endDate: object.endDate,
    // channels: object.channels,
    // requestId: object.requestId,
    // requestGroupId: object.requestGroupId,
    // requestGroupName: object.requestGroupName,
    // requestNo: object.requestNo,
    // rejectReason: object.rejectReason,
    // perpetual: object.perpetual,
    // descriptionFields: object.descriptionFields
  });
}

export async function updateRequestApi(object) {
  return fetch.post(urls.updateAccessRequest, {
    requestId: object.requestId,
    userId: object.userId,
    requestReason: object.requestReason,
    requestGroup: object.requestGroup,
    descriptionFields: object.descriptionFields
  });
}

// -------------------------------------------- Approve access

export async function getApproveAccessListApi(obj) {
  return fetch.post(urls.approveAccessList, obj);
}

export async function AddOrApproveRequestApi(object) {
  return fetch.post(urls.access_approve_saveRequest, object);
}

// ============================channel============================

export async function initChannelsApi(obj) {
  return fetch.post(urls.getChannelList, obj);
}
export async function getChannelInfo(obj) {
  const getChannelInfo = _.cloneDeep(urls.getChannelInfo);
  // getChannelInfo.url = `${getChannelInfo.url}/${obj.id}`;
  // getChannelInfo.url = getChannelInfo.url.replace('{channelId}', obj.id);
  return fetch.post(getChannelInfo, { channelId: obj.id });
}
export async function getAllSchedulesApi(obj) {
  const getSchedules = _.cloneDeep(urls.getSchedules);
  getSchedules.url = `${getSchedules.url}/${obj.userId}`;
  return fetch.get(getSchedules);
}
export async function getExtraSchedulesApi(obj) {
  const getExtraSchedules = _.cloneDeep(urls.getExtraSchedules);
  getExtraSchedules.url = `${getExtraSchedules.url}/${obj.id}`;
  return fetch.get(getExtraSchedules);
}
export async function getGroupsApi(obj) {
  const getGroups = _.cloneDeep(urls.getGroups);
  getGroups.url = `${getGroups.url}/${obj.userId}`;
  return fetch.get(getGroups);
}
export async function saveChannelApi(detail) {
  return fetch.post(urls.saveChannel, {
    channelId: detail.channelId,
    deviceId: detail.deviceId,
    createdId: detail.createdId,
    lastUpdatedId: detail.lastUpdatedId,
    name: detail.scheduleName,
    retentionNo: detail.retentions,
    description: detail.description,
    metadata: {
      address: detail.address,
      latitude: detail.latitude,
      longitude: detail.longitude,
      fieldOfView: detail.fieldOfView,
      fieldOfCoverage: detail.fieldOfCoverage,
      direction: detail.direction,
      distance: detail.distance,
      isSecure: detail.isSecure
    },
    descriptionFields: detail.descriptionFields
  });
}
export async function delChannelApi(obj) {
  return fetch.post(urls.batchDeleteChannel, {
    userId: obj.userId,
    channelIds: obj.channelIds,
    descriptionFields: obj.descriptionFields
  });
}
export async function saveScheduleApi(obj) {
  return fetch.post(
    urls.saveSchedule,
    {
      // deviceId: obj.deviceId,
      // channelId: obj.channelId,
      scheduleId: obj.scheduleId,
      name: obj.name,
      // timeZone: obj.timeZone,
      // retentionNum: obj.retentionNum,
      weeklyPeriods: obj.weekPeriod,
      createdId: obj.createdId,
      lastUpdatedId: obj.lastUpdatedId
    },
    {
      materialKey: obj.mk || null
    }
  );
}
export async function delScheduleApi(obj) {
  const delRecordingSchedule = _.cloneDeep(urls.delRecordingSchedule);
  delRecordingSchedule.url = `${delRecordingSchedule.url}/${obj.scheduleId}`;
  return fetch.del(delRecordingSchedule);
}
// ------------------------------------------------- Channel Group

export async function getChannelGroupTreeApi(obj) {
  urls.getChannelGroupTree.url = urls.getChannelGroupTree.url.replace('{userId}', obj.userId);
  urls.getChannelGroupTree.url = `${urls.getChannelGroupTree.url}${
    obj.filter === undefined || obj.filter === '' ? '' : `?filter=${obj.filter}`
  }`;
  return fetch.get(urls.getChannelGroupTree);
}

export async function createGroupApi(obj) {
  return fetch.post(urls.createGroup, obj);
}

export async function updateGroupApi(obj) {
  return fetch.post(urls.updateGroup, obj);
}

export async function deleteChannelGroupApi(obj) {
  const deleteChannelGroup = _.cloneDeep(urls.deleteChannelGroup);
  deleteChannelGroup.url = `${deleteChannelGroup.url.replace('{channelGroupId}', obj.groupId)}/${
    obj.groupName
  }/${obj.parentGroupName}`;
  return fetch.del(deleteChannelGroup);
}

export async function updateGroupMappingApi(obj) {
  return fetch.post(urls.updateGroupMapping, obj);
}
// ------------------------------------------------- Firmware

export async function getFirmwareListApi(object) {
  const firmwares = _.cloneDeep(urls.firmwares);
  const body = {
    pageNo: object.pageNo,
    pageSize: object.pageSize,
    userId: object.userId,
    model: object.model ? object.model : '',
    firmwareName: object.firmwareName ? object.firmwareName : ''
  };
  // firmwares.url = `${firmwares.url}?psize=${object.pageSize}&pindex=${
  //   object.pageNo
  // }&model=${object.model || ''}`;
  return fetch.post(firmwares, body);
}

export async function getUpgradeSchedulesApi(object) {
  return fetch.post(urls.getScheduleList, object);
}

export async function updateFirmwareApi(object) {
  return fetch.post(urls.updateFirmware, object);
}

export async function uploadFirmwareApi(object) {
  return fetch.fileUpload(urls.uploadFirmware, object);
}

export async function getScheduleDeviceListApi(object) {
  return fetch.post(urls.getUpgradeDeviceList, object);
}

export async function getSelectedDeviceArrayApi(object) {
  return fetch.post(urls.getSelectedDeviceArray, object);
}

export async function createScheduleApi(object) {
  return fetch.post(urls.createNewSchedule, object);
}

export async function delFirmwareScheduleApi(object) {
  return fetch.post(urls.deleteSchedule, object);
}
export async function delFirmwareApi(object) {
  return fetch.post(urls.deleteFirmware, object);
}
// --------------------------Icon set up-------------------------
export async function deviceModelListApi() {
  return fetch.get(urls.deviceModelList);
}
export async function deviceIconUploadApi(obj) {
  return fetch.fileUpload(urls.deviceIconUpload, obj);
}
export async function deviceIconSaveApi(obj) {
  return fetch.post(urls.deviceIconSave, obj);
}
export async function deleteIconApi(obj) {
  const model = _.cloneDeep(urls.deleteIcon);
  model.url = `${model.url}/${obj.id}`;
  return fetch.post(model);
}

export async function getUserPermission(obj) {
  const getUserPermission = _.cloneDeep(urls.getUserPermission);
  getUserPermission.url = `${getUserPermission.url}/${obj.userId}`;
  return fetch.post(getUserPermission);
}

export async function getChannelByChannelGroupId(obj) {
  return fetch.post(urls.getChannelByChannelGroupId, obj);
}
