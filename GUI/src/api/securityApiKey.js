import _ from 'lodash';
import fetch from 'utils/request';
import getUrls from 'utils/urls/index';

const urls = getUrls.security;

export async function getApiKeyListApi(obj) {
  return fetch.post(urls.apikeyList, obj);
}
export async function createApikeyApi(obj) {
  return fetch.post(urls.createApikey, obj);
}
export async function deleteApiKeyApi(obj) {
  const model = _.cloneDeep(urls.delete);
  const { url } = model;
  model.url = `${url}/${obj.apikey}/${obj.createdId}`;
  return fetch.del(model);
}
export async function getApiKeyApi(obj) {
  const model = _.cloneDeep(urls.getApikey);
  const { url } = model;
  model.url = `${url}/${obj.userId}`;
  return fetch.get(model);
}
export async function isPostponeApi(obj) {
  const model = _.cloneDeep(urls.isPostpone);
  const { url } = model;
  model.url = `${url}/${obj.createdId}/${obj.userId}/${obj.validTime}`;
  return fetch.put(model);
}
export async function assignRoleApi(obj) {
  return fetch.post(urls.assignRole, obj);
}
export async function assignGroupApi(obj) {
  return fetch.post(urls.assignGroup, obj);
}
export async function getVapRoleListApi() {
  return fetch.get(urls.vapRoleList);
}
export async function generateApiKeyApi(obj) {
  return fetch.post(urls.generateApiKey, obj);
}
