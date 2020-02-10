import _ from 'lodash';
import fetch from 'utils/request';
import getUrl from '../utils/urls/index';

const urls = getUrl.user;

export async function getUserApi(pageNum = 1, size = 5, searchText = '') {
  return fetch.post(urls.userList, {
    pageNo: pageNum,
    pageSize: size,
    pram: searchText
  });
}

export async function searchUserApi(pageNo = 1, pageSize = 5, pram = '') {
  return fetch.post(urls.userList, {
    pageNo,
    pageSize,
    pram
  });
}

export async function addUserApi(user = {}) {
  return fetch.post(urls.userAdd, user);
}

export async function updateUserApi(user = {}) {
  const userUpdating = {
    ...user,
    userName: user.userFullName
  };
  return fetch.post(urls.userUpdate, userUpdating);
}

export async function batchDeleteUsersApi(users) {
  return fetch.post(urls.userDelete, users);
}

export async function deleteUserApi(user) {
  const userDelete = _.cloneDeep(urls.userDelete);
  const { url } = userDelete;
  userDelete.url = `${url}/${user.userUuid}/${user.userId}`;
  return fetch.post(userDelete, user);
}

export async function getUserRolesApi(userId, id) {
  const getUserRoles = _.cloneDeep(urls.getUserRoles);
  const { url } = urls.getUserRoles;
  getUserRoles.url = `${url}/${userId}?targetUserId=${id}`;
  return fetch.get(getUserRoles);
}

export async function saveUserRolesApi(roles) {
  return fetch.post(urls.saveUserRoles, roles);
}

export async function getDevicesApi(id) {
  const userDevices = _.cloneDeep(urls.userDevices);
  const { url } = urls.userDevices;
  userDevices.url = `${url}/${id}`;
  return fetch.get(userDevices);
}

export async function saveDevicesApi(devices) {
  return fetch.post(urls.saveUserDevices, devices);
}

export async function searchDevicesApi(content) {
  return fetch.post(urls.searchDevices, {
    content
  });
}

export async function getUserListApi(obj) {
  return fetch.post(urls.searchableUserList, {
    searchUserId: obj.searchUserId,
    userId: obj.userId,
    userFullName: obj.userFullName,
    userName: obj.userName,
    userEmail: obj.userEmail,
    pageNo: obj.pageNo,
    pageSize: obj.pageSize
  });
}
