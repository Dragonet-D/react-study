import _ from 'lodash';
import getUrls from '../utils/urls/index';
import fetch from '../utils/request';

const urls = getUrls.overview;
const vmsUrls = getUrls.vms;
const vapUrls = getUrls.vap;

export async function getOverviewSummaryApi(userId) {
  const model = _.cloneDeep(urls.getOverviewSummary);
  const { url } = model;
  model.url = `${url}/${userId}`;
  return fetch.get(model);
}
export async function getCameraUsageApi(obj) {
  const model = _.cloneDeep(vmsUrls.getCameraInfo);
  const { url } = model;
  model.url = `${url}/${obj.userId}?pindex=${obj.pageNo}&psize=${obj.pageSize}&modelId&deviceName`;
  return fetch.get(model);
}
export async function getUserStateApi(obj) {
  return fetch.post(urls.getUserInfo, obj);
}

export async function instanceOverviewChartApi(obj) {
  return fetch.post(urls.instanceOverview, obj);
}
export async function instanceOverviewListApi(obj) {
  return fetch.post(urls.instanceOverviewList, {
    userId: obj.userId,
    pageIndex: obj.pageNo,
    pageSize: obj.pageSize,
    param: obj.param
  });
}
export async function licenseOverviewChartApi(obj) {
  return fetch.post(urls.licenseOverview, obj);
}
export async function licenseOverviewListApi(obj) {
  const model = _.cloneDeep(urls.licenseOverviewList);
  return fetch.post(model, obj);
}
export async function usageOverviewChartApi(obj) {
  return fetch.post(urls.usageOverview, { userId: obj.userId });
}
export async function usageOverviewListApi(obj) {
  return fetch.post(urls.usageOverviewList, {
    userId: obj.userId,
    pageIndex: obj.pageNo,
    pageSize: obj.pageSize,
    param: obj.param
  });
}
export async function distributionApi(obj) {
  const model = _.cloneDeep(urls.distribution);
  return fetch.post(model, obj);
}
export async function disconneCamApi(obj) {
  const model = _.cloneDeep(urls.disconnectCamera);
  const { url } = model;
  model.url = `${url}/${obj.id}`;
  return fetch.del(model);
}
export async function disconnectUserApi(obj) {
  return fetch.post(urls.disconnectUser, {
    auditUuid: obj.auditUuid,
    loginUserId: obj.loginUserId
  });
}
export async function uploadLicenseApi(obj) {
  return fetch.post(vapUrls.uploadLicense, obj);
}

export async function assignLicenseListApi(array) {
  return fetch.post(urls.saveDistribution, array);
}

export async function getSystemStatusApi() {
  return fetch.get(urls.getSystemStatus);
}
