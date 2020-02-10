import _ from 'lodash';
import getUrls from '../utils/urls/index';
import fetch from '../utils/request';

const urls = getUrls.alarm;
const vmsUrls = getUrls.vms;
const urlsUser = getUrls.user;

// get alarm subscribe data list
export async function subscribeSearchApi(obj) {
  return fetch.post(urls.alarmSubscribeSettingList, obj);
}

// save alarm subscribe change
export async function subscribeSettingSaveApi(alarmItems) {
  return fetch.post(urls.subscribeSettingSave, alarmItems);
}

// get event type and alarm severity information
export async function getAlarmInitInfoApi() {
  return fetch.get(urls.createAlarm);
}

// query the events data
export async function getEventsApi(parameter) {
  return fetch.post(urls.getEventQueryList, parameter);
}

// export events
export async function exportEventListApi(obj) {
  return fetch.downloadPost(urls.exportAllEvent, obj);
}

// get alarm history data
export async function getAlarmHistoryDataApi(obj) {
  return fetch.post(urls.alarmHistoryList, obj);
}

// alarm history data export
export async function exportAlarmHistoryDataApi(obj) {
  return fetch.downloadPost(urls.exportAlarm, obj);
}

// handle alarm history actions
export async function updateAlarmHistoryActionApi(obj) {
  return fetch.post(urls.updateActionWithoutFile, obj);
}

// alarm history action handle
export async function getAlarmHistoryActionApi(status) {
  const getAction = _.cloneDeep(urls.getAction);
  getAction.url = `${getAction.url}/${status}`;
  return fetch.get(getAction);
}

// alarm history file upload
export async function updateAlarmHistoryDetailsApi(obj) {
  return fetch.fileUpload(urls.updateAlarmDetailsStatus, obj);
}

// action details update without file
export async function updateAlarmHistoryDetailsNoFileApi(obj) {
  return fetch.post(urls.updateActionWithoutFile, obj);
}

// alarm history download action file
export async function alarmHistoryDownloadApi(id) {
  const alarmDownload = _.cloneDeep(urls.alarmDownload);
  alarmDownload.url = `${alarmDownload.url}/${id}/download`;
  return fetch.downloadGet(alarmDownload);
}

// get alarm realtime for vms
export async function getAlarmRealtimeDataApi(obj) {
  return fetch.post(urls.getRealTimeAlarmForVMS, obj);
}

// get alarm configuration list
export async function getAlarmConfigurationListApi(obj) {
  return fetch.post(urls.alarmConfigurationList, obj);
}

// get the details of one alarm
export async function getAlarmDetailsOfOneApi(id) {
  const searchOne = _.cloneDeep(urls.searchOne);
  searchOne.url = `${searchOne.url}/${id}`;
  return fetch.get(searchOne);
}

// get vms channel data
export async function getChannelsDataApi(obj) {
  return fetch.post(vmsUrls.getChannelList, obj);
}

// get vms models
export async function getVmsModelsDataApi() {
  const model = _.cloneDeep(vmsUrls.model);
  const { url } = model;
  model.url = `${url}?pindex=0&psize=99999999`;
  return fetch.get(model);
}

// get live stream
export async function getLiveStreamApi(obj) {
  return fetch.post(vmsUrls.getLiveStream, obj);
}

// get playback stream
export async function getPlaybackStreamApi(obj) {
  return fetch.post(vmsUrls.playback, obj);
}

// create alarm
export async function createAlarmApi(obj) {
  return fetch.post(urls.saveAlarm, obj);
}

// delete alarm
export async function deleteAlarmConfigurationApi(obj) {
  return fetch.post(urls.deleteAlarms, obj);
}

// get user list
export async function getUserListApi(obj) {
  return fetch.post(urlsUser.searchableUserList, obj);
}

// alarm configuration delivery to
export async function deliverToApi(obj) {
  return fetch.post(urls.deliverTo, obj);
}

// update alarm settings
export async function updateAlarmSettingApi(obj) {
  return fetch.post(urls.updateAlarmSetting, obj);
}

// update alarm information
export async function updateAlarmApi(obj) {
  return fetch.post(urls.updateAlarm, obj);
}

// get real time alarm for vap
export async function getRealTimeAlarmForVAPApi(obj) {
  return fetch.post(urls.getRealTimeAlarmForVAP, obj);
}

export async function updateAlarmFalsePositiveStatusApi(obj) {
  return fetch.post(urls.updateAlarmFalsePositiveStatus, obj);
}
