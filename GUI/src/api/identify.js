import _ from 'lodash';
import tokenHelper from 'utils/tokenHelper';
import fetch from 'utils/request';
import getUrl from '../utils/urls/index';

const globalUrls = getUrl.global;

export async function logout(uuid, userId) {
  return fetch.post(globalUrls.logout, { auditUuid: uuid, loginUserId: userId });
}

export async function login(userName, password) {
  return fetch.post(globalUrls.login, {
    username: userName,
    password,
    codeCategory: 'IVH_VERSION_CODE',
    codeValue: 'VERSION'
  });
}

export async function loginAD(userName, password, adName) {
  return fetch.post(globalUrls.adlogin, {
    param: userName,
    password,
    adName,
    codeCategory: 'IVH_VERSION_CODE',
    codeValue: 'VERSION'
  });
}

export async function updateSessionApi() {
  return fetch.post(globalUrls.updateSession, {
    token: tokenHelper.get()
  });
}

export async function getIdpParameterApi() {
  return fetch.get(globalUrls.getIdpParameter);
}

export async function initIdpApi(anchor) {
  const initIdpData = _.cloneDeep(globalUrls.initIdpData);
  initIdpData.url = `${initIdpData.url}?${anchor}`;
  return fetch.get(initIdpData);
}

export async function adfsLoginApi(id) {
  const adfsLogin = _.cloneDeep(globalUrls.adfsLogin);
  adfsLogin.url = `${adfsLogin.url}/${id}`;
  return fetch.get(adfsLogin);
}

export async function getADFSLogoutUrlApi() {
  return fetch.get(globalUrls.getIdpLogoutParameter);
}
