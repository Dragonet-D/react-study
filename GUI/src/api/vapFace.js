import _ from 'lodash';
import fetch from 'utils/request';
import getUrls from '../utils/urls/index';

const urls = getUrls.vap;
const urlsVms = getUrls.vms;

export async function getFrsGroupsApi(id) {
  const vapFrsGetGroups = _.cloneDeep(urls.vapFrsGetGroups);
  if (id) {
    vapFrsGetGroups.url = `${vapFrsGetGroups.url}?id=${id}`;
  }
  return fetch.get(vapFrsGetGroups);
}

export async function getFrsGroupsByAppIdApi(obj) {
  const vapGetGroupsByappId = _.cloneDeep(urls.vapGetGroupsByappId);
  return fetch.post(vapGetGroupsByappId, obj);
}

export async function getAllAppsApi(userId) {
  const appList = _.cloneDeep(urls.appList);
  appList.url = `${appList.url}?pindex=0&psize=99999999&userId=${userId}`;
  return fetch.get(appList);
}

export async function getEnginesListApi(userId) {
  return fetch.post(urls.enginesList, {
    pageNo: 0,
    pageSize: 99999999,
    userId
  });
}

export async function vapFrsAddGroupsApi(obj) {
  return fetch.post(urls.vapFrsAddGroups, obj);
}

// frs update group
export async function vapFrsUpdateGroupsApi(obj) {
  const vapFrsUpdateGroups = _.cloneDeep(urls.vapFrsUpdateGroups);
  vapFrsUpdateGroups.url = `${vapFrsUpdateGroups.url}/${obj.id}`;
  return fetch.put(vapFrsUpdateGroups, {
    // userId: obj.userId,
    ...obj.groupInfo
  });
}

export async function vapFrsAddPersonApi(obj) {
  return fetch.post(urls.vapFrsAddPerson, obj);
}

// vap delete a group
export async function vapFrsDeleteGroupApi(id) {
  const vapFrsDeleteGroup = _.cloneDeep(urls.vapFrsDeleteGroup);
  vapFrsDeleteGroup.url = `${vapFrsDeleteGroup.url}/${id}`;
  return fetch.del(vapFrsDeleteGroup);
}

export async function vapFrsUpdatePersonAssignedGroupApi(obj) {
  const vapFrsUpdatePersonAssignedGroup = _.cloneDeep(urls.vapFrsUpdatePersonAssignedGroup);
  vapFrsUpdatePersonAssignedGroup.url = vapFrsUpdatePersonAssignedGroup.url.replace(
    '{id}',
    obj.userId
  );
  return fetch.put(vapFrsUpdatePersonAssignedGroup, { groupIDs: obj.groupIDs });
}

export async function vapFrsGetPersonsApi(obj) {
  const vapFrsGetPersons = _.cloneDeep(urls.vapFrsGetPersons);
  vapFrsGetPersons.url = `${vapFrsGetPersons.url}?pindex=${obj.pindex}&psize=${
    obj.psize
  }&groupid=${obj.groupId || ''}&identityno=${obj.identityno || ''}&name=${obj.name || ''}`;
  return fetch.get(vapFrsGetPersons);
}

export async function vapFrsUpdatePersonApi(obj) {
  const vapFrsUpdatePerson = _.cloneDeep(urls.vapFrsUpdatePerson);
  vapFrsUpdatePerson.url = `${vapFrsUpdatePerson.url}/${obj.userId}`;
  return fetch.put(vapFrsUpdatePerson, obj.info);
}

// vap delete person
export async function vapFrsDeletePersonApi(id) {
  const vapFrsDeletePerson = _.cloneDeep(urls.vapFrsDeletePerson);
  vapFrsDeletePerson.url = `${vapFrsDeletePerson.url}/${id}`;
  return fetch.del(vapFrsDeletePerson);
}

// vap get person images
export async function vapFrsGetPersonImagesApi(id) {
  const vapFrsGetPersonImages = _.cloneDeep(urls.vapFrsGetPersonImages);
  vapFrsGetPersonImages.url = vapFrsGetPersonImages.url.replace('{id}', id);
  return fetch.get(vapFrsGetPersonImages);
}

// vap update person image
export async function vapFrsUpdatePersonImagesApi(obj) {
  const vapFrsUpdatePersonImages = _.cloneDeep(urls.vapFrsUpdatePersonImages);
  vapFrsUpdatePersonImages.url = vapFrsUpdatePersonImages.url.replace('{id}', obj.userId);
  return fetch.post(vapFrsUpdatePersonImages, obj.imageInfo);
}

// vap delete person image
export async function vapFrsDeletePersonImageApi(obj) {
  const vapFrsDeletePersonImage = _.cloneDeep(urls.vapFrsDeletePersonImage);
  vapFrsDeletePersonImage.url = vapFrsDeletePersonImage.url.replace('{id}', obj.userId);
  vapFrsDeletePersonImage.url = vapFrsDeletePersonImage.url.replace('{imageId}', obj.imageId);
  return fetch.del(vapFrsDeletePersonImage);
}

// get channel tree data
export async function getTreeDataAPI(userId, filter) {
  const channelGroupTree = _.cloneDeep(urlsVms.channelGroupTree);
  channelGroupTree.url = channelGroupTree.url.replace('{userId}', userId);
  channelGroupTree.url = filter ? `${channelGroupTree.url}?filter=${filter}` : channelGroupTree.url;
  return fetch.get(channelGroupTree);
}

// face search
export async function vapFrsFaceSearchApi(obj) {
  return fetch.post(urls.vapFrsFaceSearch, obj);
}

// event search
export async function vapFrsEventsSearchApi(obj) {
  return fetch.post(urls.vapFrsEventsSearch, obj);
}

export async function vapFrsFaceCompareApi(obj) {
  return fetch.post(urls.vapFrsFaceCompare, obj);
}

export async function vapFrsPersonEnrollmentsApi(obj) {
  const vapFrsPersonEnrollments = _.cloneDeep(urls.vapFrsPersonEnrollments);
  vapFrsPersonEnrollments.url = vapFrsPersonEnrollments.url.replace('{id}', obj.id);
  vapFrsPersonEnrollments.url = vapFrsPersonEnrollments.url.replace('{imageId}', obj.imageId);
  return fetch.get(vapFrsPersonEnrollments);
}

export async function vapFrsDownloadMultipleFRSTemplateApi() {
  return fetch.downloadGet(urls.vapFrsDownloadMultipleFRSTemplate);
}

export async function vapFrsAddPersonsFileOfZipApi(obj) {
  return fetch.fileUpload(urls.vapFrsAddPersonsFileOfZip, obj);
}

export async function vapFrsUploadRecordListApi(obj) {
  return fetch.post(urls.vapFrsUploadRecordList, obj);
}

export async function vapFrsExportSearchDataApi(obj) {
  return fetch.downloadPost(urls.vapFrsExportSearchData, obj);
}

// function handleUrls(url, obj) {
//   const urlTemp = _.cloneDeep(url);
//   const objTemp = _.cloneDeep(obj);
//   let urlString = urlTemp.url;
//   if (_.isEmpty(objTemp)) {
//     return urlString;
//   } else {
//     for (const key in objTemp) {
//       if (objTemp.hasOwnProperty(key)) {
//         if (objTemp[key] !== undefined) {
//           urlString += `${key}=${objTemp[key]}&`;
//         }
//       }
//     }
//   }
//   return urlString;
// }

// channel function

export async function getChannelGroupTreeApi(obj) {
  const getChannelGroupTree = _.cloneDeep(urlsVms.getChannelGroupTree);
  getChannelGroupTree.url = getChannelGroupTree.url.replace('{userId}', obj.userId);
  return fetch.get(getChannelGroupTree);
}

export async function getChannelByChannelGroupId(obj) {
  return fetch.post(urlsVms.getChannelByChannelGroupId, obj);
}

export async function getChannelList(obj) {
  return fetch.post(urlsVms.getChannelList, obj);
}
