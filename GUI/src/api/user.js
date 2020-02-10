import _ from 'lodash';
import fetch from 'utils/request';
import getUrl from '../utils/urls/index';

const urls = getUrl.user;
const globalUrls = getUrl.global;

export async function userPwdUpdate(newpwd, userId) {
  return fetch.post(globalUrls.userPwdUpdate, {
    userPassword: newpwd,
    userId
  });
}
export async function userOldPwdCheckAPI(oldpwd, newpwd, userId) {
  return fetch.post(globalUrls.userOldPwdCheck, {
    userId,
    oldPassword1: oldpwd,
    userPassword: newpwd
  });
}

export async function getPwdPolicyAPI() {
  return fetch.get(globalUrls.getPwdPolicy);
}

export async function getForgotPasswordAPI(object) {
  const forgetPssword = _.cloneDeep(globalUrls.forgetPssword);
  const { url } = forgetPssword;
  forgetPssword.url = `${url}/userId/${object.userId}/email/${object.formatemail}`;
  return fetch.get(forgetPssword);
}

export async function getUserInfoByUserIdApi(userId) {
  const getUserInfoByUserId = _.cloneDeep(urls.getUserInfoByUserId);
  getUserInfoByUserId.url = `${getUserInfoByUserId.url}/${userId}`;
  return fetch.get(getUserInfoByUserId);
}

export async function updateUserApi(user = {}) {
  user.userName = user.userFullName;
  return fetch.post(urls.userUpdate, user);
}
