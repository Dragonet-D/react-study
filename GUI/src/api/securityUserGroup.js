import _ from 'lodash';
import fetch from 'utils/request';
import getUrls from '../utils/urls/index';

const urls = getUrls.user;
const vmsUrls = getUrls.vms;
const vapUrls = getUrls.vap;

export async function getUserGroupApi(userId) {
  const newListGroupNoRecording = _.cloneDeep(urls.newListGroupNoRecording);
  newListGroupNoRecording.url = `${newListGroupNoRecording.url}/${userId}`;
  return fetch.get(newListGroupNoRecording);
}

export async function addUserGroupApi(userGroup = {}, mk) {
  const materialKey = mk || null;
  return fetch.post(urls.userGroupSave, userGroup, { materialKey });
}

export async function searchUserGroupApi(msg) {
  return fetch.post(urls.searchUserGroup, msg);
}

export async function deleteUserGroupApi(groupId) {
  const userGroupDelete = _.cloneDeep(urls.userGroupDelete);
  userGroupDelete.url = `${userGroupDelete.url}/${groupId}`;
  return fetch.del(userGroupDelete);
}

export async function getUserByGroupIdApi(groupId) {
  const getUsersByGroupId = _.cloneDeep(urls.getUsersByGroupId);
  getUsersByGroupId.url = `${getUsersByGroupId.url}/${groupId}`;
  return fetch.get(getUsersByGroupId);
}

export async function findUserGroupByIdApi(obj) {
  const findUserGroupById = _.cloneDeep(urls.findUserGroupById);
  // findUserGroupById.url = `${findUserGroupById.url}/${obj.groupId}?userId=${obj.userId}``;
  return fetch.post(findUserGroupById, { groupId: obj.groupId, userId: obj.userId });
}
// Fixed for JIRA-IVHFATOSAT-452 by Chen Yu Long on 19/07/2019 start---
export async function saveUserGroupApi(objUser = {}) {
  return fetch.post(urls.saveUserGroup, {
    createdId: objUser.users.createdId,
    groupId: objUser.users.groupId,
    lastUpdatedId: objUser.users.lastUpdatedId,
    userList: objUser.users.userList,
    descriptionFields: objUser.descriptionFields
  });
}
// Fixed for JIRA-IVHFATOSAT-452 by Chen Yu Long on 19/07/2019 end---
export async function saveDeviceToGroupApi(objDevice) {
  return fetch.post(vmsUrls.assignChannelsIntoGroup, objDevice);
}

export async function getDeviceApi(pageNo = 0, pageSize = 5, groupId) {
  return fetch.post(vmsUrls.channels, {
    pageNo,
    pageSize,
    userGroupId: groupId
  });
}

export async function batchDeleteUserGroup(obj) {
  return fetch.post(urls.batchDeleteUserGroup, obj);
}

export async function getUserGroupTreeApi(userId) {
  // const userGroupTree = _.cloneDeep(urls.userGroupTree);
  // userGroupTree.url = `${userGroupTree.url}`;
  return fetch.post(urls.userGroupTree, { userId });
}

export async function getUserGroupUserList(obj) {
  return fetch.post(urls.userGroupUserList, obj);
}

export async function getAllDeviceApi(obj) {
  return fetch.post(vmsUrls.getChannelList, obj);
}

// Added for Search Function , by Kevin on 2019/3/24 16:56:54 - Start
export async function searchUserGroupTreeApi(userId, filter) {
  const searchUserGroupTree = _.cloneDeep(urls.searchUserGroupTree);
  searchUserGroupTree.url = `${searchUserGroupTree.url}?userId=${userId}&filter=${filter}`;
  return fetch.get(searchUserGroupTree);
}
// Added for Search Function - End

export async function getDomainListApi(userId) {
  const getDomainList = _.cloneDeep(urls.getDomainList);
  getDomainList.url = `${getDomainList.url}/${userId}`;
  return fetch.get(getDomainList);
}

export async function saveGroupWDomainApi(obj) {
  return fetch.post(urls.saveGroupWDomain, obj);
}

export async function initModelsApi(pageNo, pageSize) {
  const model = _.cloneDeep(vmsUrls.model);
  const { url } = model;
  model.url = `${url}?pindex=${pageNo}&psize=${pageSize}`;
  return fetch.get(model);
}

export async function getEnginesListApi(obj) {
  return fetch.post(vapUrls.enginesList, obj);
}

export async function assignEngineToGroupApi(obj) {
  return fetch.post(vapUrls.assignEngineToGroup, obj);
}
