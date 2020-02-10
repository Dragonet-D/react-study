import _ from 'lodash';
import getUrls from '../utils/urls/index';
import fetch from '../utils/request';

const urls = getUrls.vade;
// task
export async function doTaskApi(obj) {
  return fetch.post(urls.doTask, {
    taskId: obj.taskId,
    flag: obj.flag
  });
}
export async function taskListApi(obj) {
  return fetch.post(urls.taskList, obj);
}
export async function saveTaskApi(obj) {
  return fetch.post(urls.tasks, {
    createUserId: obj.createUserId,
    category: obj.category,
    name: obj.name,
    desc: obj.desc,
    commandStr: JSON.stringify(obj.commandStr),
    commandTemplate: obj.commandTemplate,
    taskTypeId: obj.taskTypeId,
    taskTypeName: obj.taskTypeName,
    outputDataName: obj.outputDataName,
    outputDataDesc: obj.outputDataDesc,
    programId: obj.programId,
    uuid: obj.uuid
  });
}
export async function getOneTaskApi(id) {
  const model = _.cloneDeep(urls.tasks);
  const { url } = model;
  model.url = `${url}/${id}`;
  return fetch.get(model);
}
export async function deleteTaskApi(obj) {
  const model = _.cloneDeep(urls.tasks);
  const { url } = model;
  model.url = `${url}/${obj.ids}`;
  return fetch.del(model);
}
// task type
export async function taskTypeListApi(obj) {
  return fetch.post(urls.taskTypeList, obj);
}
export async function createTaskTypeApi(obj) {
  return fetch.post(urls.taskTypes, obj);
}
export async function getOneTaskTypeApi(id) {
  const model = _.cloneDeep(urls.taskTypes);
  const { url } = model;
  model.url = `${url}/${id}`;
  return fetch.get(model);
}
export async function deleteTaskTypeApi(id) {
  const model = _.cloneDeep(urls.taskTypes);
  const { url } = model;
  model.url = `${url}/${id}`;
  return fetch.del(model);
}
// program
export async function fileListApi(obj) {
  return fetch.post(urls.fileList, {
    pageNo: obj.pageNo,
    pageSize: obj.pageSize,
    category: obj.category,
    createUserId: obj.createUserId,
    fileName: obj.fileName,
    fileRealName: obj.fileRealName,
    fileTypeName: obj.fileTypeName,
    taskTypeName: obj.taskTypeName,
    fileTypeId: obj.fileTypeId,
    entry: obj.entry
  });
}
export async function getOneFileApi(id) {
  const model = _.cloneDeep(urls.files);
  const { url } = model;
  model.url = `${url}/${id}`;
  return fetch.get(model);
}
export async function updateFileApi(id) {
  const model = _.cloneDeep(urls.files);
  const { url } = model;
  model.url = `${url}/${id}`;
  return fetch.put(model);
}
export async function deleteFileApi(ids) {
  const model = _.cloneDeep(urls.files);
  const { url } = model;
  model.url = `${url}/${ids}`;
  return fetch.del(model);
}
export async function downloadFileApi(id) {
  const model = _.cloneDeep(urls.downloadFile);
  const { url } = model;
  model.url = `${url}/${id}`;
  // return fetch.downloadGet(model);
  const a = document.createElement('a');
  a.href = model.url;
  a.click();
}
export async function addModelApi(obj) {
  return fetch.post(urls.vadeAddModel, obj);
}
//
export async function uploadFileApi(obj) {
  return fetch.fileUpload(urls.uploadFile, {
    taskTypeId: obj.taskTypeId,
    file: obj.file,
    createUserId: obj.createUserId,
    parameters: JSON.stringify(obj.parameters),
    fileName: obj.fileName,
    fileDesc: obj.fileDesc,
    category: obj.category,
    entry: obj.entry,
    commandTemplate: obj.commandTemplate,
    fileTypeId: obj.fileTypeId
  });
}
export async function getEntryListApi(obj) {
  let category = '';
  const { category: a } = obj;
  if (a) {
    category = a;
  }
  const model = _.cloneDeep(urls.entry);
  const { url } = model;
  model.url = `${url}?category=${category}`;
  return fetch.get(model);
}
// file type(data/program)
export async function fileTypeListApi(obj) {
  return fetch.post(urls.fileTypeList, obj);
}
export async function saveDataTypeApi(obj) {
  return fetch.post(urls.fileTypes, {
    category: obj.category,
    entry: obj.entry,
    desc: obj.desc,
    name: obj.name,
    labeled: obj.labeled,
    // taskTypeId: obj.taskTypeId,
    createUserId: obj.createUserId
  });
}
export async function getOneFileTypeApi(id) {
  const model = _.cloneDeep(urls.fileTypes);
  const { url } = model;
  model.url = `${url}/${id}`;
  return fetch.get(model);
}
export async function deleteFileTypeApi(id) {
  const model = _.cloneDeep(urls.fileTypes);
  const { url } = model;
  model.url = `${url}/${id}`;
  return fetch.del(model);
}
// resource monitor
export async function getOneServerResourceApi(serverId) {
  urls.serverResource.url = `${urls.serverResource.url}/${serverId}`;
  return fetch.get(urls.serverResource);
}
export async function getServerResourceListApi(obj) {
  return fetch.post(urls.serverResource, {
    pageNo: obj.pageNo,
    pageSize: obj.pageSize
  });
}
export async function getServerResourceTotalApi() {
  return fetch.get(urls.serverResourceTotal);
}
export async function getOneTaskResourceApi(taskId) {
  const model = _.cloneDeep(urls.taskResource);
  const { url } = model;
  model.url = `${url}/${taskId}`;
  return fetch.get(model);
}
export async function getTaskResourceListApi(obj) {
  return fetch.post(urls.taskResource, {
    pageNo: obj.pageNo,
    pageSize: obj.pageSize
  });
}
