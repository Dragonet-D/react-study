import _ from 'lodash';
import fetch from 'utils/request';
import getUrl from '../utils/urls/index';

const urls = getUrl.user;

export async function initRolesApi(obj) {
  return fetch.post(urls.roleList, {
    userId: obj.userId,
    pageNo: obj.pageNo,
    pageSize: obj.pageSize,
    roleName: obj.roleName,
    roleDesc: obj.roleDesc
  });
}
export async function findRoleApi(key) {
  return fetch.post(urls.searchRoleName, {
    roleName: key
  });
}

// Added for change api searching role , by Kevin on 2019/03/28 09:57:57 - Start
export async function searchRoleApi(userId, text) {
  const searchRoleNameNew = _.cloneDeep(urls.searchRoleNameNew);
  const { url } = searchRoleNameNew;
  searchRoleNameNew.url = `${url}/${userId}?targetUserId=""&parameter=${text}`;
  return fetch.get(searchRoleNameNew);
}
// Added for change api searching role - End

export async function deleteRoleApi(roleId, LastUpDatedId) {
  return fetch.post(urls.deleteRole, {
    roleId,
    lastUpdatedId: LastUpDatedId
  });
}
export async function deleteRolesApi(LastUpDatedId, roleIds, roleNames) {
  return fetch.post(urls.deleteRoles, {
    lastUpdatedId: LastUpDatedId,
    roleIds,
    roleNames
  });
}
export async function roleFeaturelistApi(roleId, userId) {
  const rolefeaturelist = _.cloneDeep(urls.rolefeaturelist);
  rolefeaturelist.url = `${rolefeaturelist.url}/${roleId}/${userId}`;
  return fetch.get(rolefeaturelist);
}
export async function paramfeaturelistApi(featureUuid) {
  const paramfeaturelist = _.cloneDeep(urls.paramfeaturelist);
  paramfeaturelist.url = `${paramfeaturelist.url}/${featureUuid}`;
  return fetch.get(paramfeaturelist);
}
export async function saveFeatureApi(features) {
  return fetch.post(urls.saveFeature, features);
}
export async function saveFeatureFuncApi(functionUuid, paramUuid, status, createdId) {
  return fetch.post(urls.saveFeatureFunc, {
    functionUuid,
    paramUuid,
    status,
    createdId
  });
}

export async function searchFeatureByNameApi(featureName) {
  return fetch.post(urls.filterByFeatureName, {
    featureName
  });
}

export async function groupListForAddroleApi(userId, roleId) {
  const groupListForAddrole = _.cloneDeep(urls.groupListForAddrole);
  groupListForAddrole.url = `${groupListForAddrole.url}/${userId}/${roleId}`;
  return fetch.post(groupListForAddrole);
}

export async function getUserGroupTreeApi(userId) {
  const userGroupTree = _.cloneDeep(urls.userGroupTree);
  userGroupTree.url = `${userGroupTree.url}?userId=${userId}`;
  return fetch.get(userGroupTree);
}

export async function addRoleApi(role) {
  return fetch.post(urls.addRole, {
    createdId: role.createdId,
    groupIds: role.groupIds,
    isAdmin: role.isAdmin,
    roleDesc: role.roleDesc,
    roleId: role.roleId,
    roleName: role.roleName,
    descriptionFields: role.descriptionFields
  });
}

export async function updateRoleApi(role) {
  return fetch.post(urls.upDateRole, {
    roleName: role.roleName,
    roleDesc: role.roleDesc,
    lastUpdatedId: role.lastUpdatedId,
    roleId: role.roleId,
    isAdmin: role.isAdmin,
    descriptionFields: role.descriptionFields
  });
}
