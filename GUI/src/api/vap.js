import _ from 'lodash';
import getUrls from '../utils/urls/index';
import fetch from '../utils/request';

export async function getApps(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.appList.url = `${urls.appList.url}?pindex=${obj.pindex}&psize=${obj.psize}&userId=${
    obj.userId
  }${obj.name ? `&name=${obj.name}` : ''}`;
  return fetch.get(urls.appList);
}

export async function getEnginesListApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  return fetch.post(urls.enginesList, obj);
}

export async function getAllAppsApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  return fetch.post(urls.allAppList, obj);
}

export async function upgradeAppFileApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.upgradeApp.url = urls.upgradeApp.url.replace('{id}', obj.id);
  return fetch.fileUpload(urls.upgradeApp, obj);
}
export async function getAppById(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.getAppById.url = `${urls.getAppById.url}/${obj.id}`;
  return fetch.get(urls.getAppById);
}

export async function updateAppInfo(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.updateAppInfo.url = urls.updateAppInfo.url.replace('{id}', obj.id);
  const { name, description, vendor, labels } = obj;

  return fetch.put(urls.updateAppInfo, {
    name,
    description,
    vendor,
    labels
  });
}

export async function getLiveStreamApi({
  type = 'rtsp/h264',
  deviceId,
  channelId,
  streamId = '0',
  userId,
  ptzInd = 'N'
}) {
  const urls = _.cloneDeep(getUrls.vap);
  return fetch.post(urls.getLiveStream, {
    type,
    deviceId,
    channelId,
    streamId,
    userId,
    ptzInd
  });
}

export async function getPlaybackStreamApi({
  type = 'rtsp/h264',
  deviceId,
  channelId,
  streamId = '0',
  from,
  to,
  userId
}) {
  const urls = _.cloneDeep(getUrls.vap);
  return fetch.post(urls.playback, {
    type,
    deviceId,
    channelId,
    streamId,
    from,
    to,
    userId
  });
}
export async function installNewAppApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  return fetch.fileUpload(urls.installNewApp, obj);
}

export async function getGatewayListApi() {
  const urls = _.cloneDeep(getUrls.vap);
  return fetch.get(urls.getGatewayList);
}

export async function getLabelListApi() {
  const urls = _.cloneDeep(getUrls.vap);
  return fetch.get(urls.getLabelList);
}

export async function addLabelsApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  return fetch.post(urls.addLabels, obj);
}

export async function updateLabelsApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.updateLabels.url = urls.updateLabels.url.replace('{name}', obj.oldName);
  return fetch.put(urls.updateLabels, {
    name: obj.name,
    description: obj.description
  });
}
export async function deleteLabelsApi(name) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.deleteLabels.url = urls.deleteLabels.url.replace('{name}', name);
  return fetch.del(urls.deleteLabels);
}
export async function changeActionApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  const { appId, enabled } = obj;
  urls.changeAction.url = urls.changeAction.url.replace('{id}', appId);
  urls.changeAction.url = `${urls.changeAction.url}?enabled=${!(enabled === 'true')}`;
  return fetch.post(urls.changeAction);
}

export async function deleteOneAppApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.deleteOneApp.url = urls.deleteOneApp.url.replace('{id}', obj.appId);
  return fetch.del(urls.deleteOneApp);
}

export async function queryInstallerFilesApi() {
  const urls = _.cloneDeep(getUrls.vap);
  return fetch.get(urls.queryInstallerFiles);
}

export async function downloadInstallerFilesApi(id) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.downloadInstallerFiles.url = urls.downloadInstallerFiles.url.replace('{id}', id);
  return fetch.fileDownload(urls.downloadInstallerFiles, 'GET');
}

export async function deleteInstallerFilesApi(id) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.deleteInstallerFiles.url = urls.deleteInstallerFiles.url.replace('{id}', id);
  return fetch.del(urls.deleteInstallerFiles);
}

export async function createLiveVAInstanceApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  return fetch.post(urls.createLiveVAInstance, obj);
}

export async function getLiveInstanceListApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  // let newLabels = '';
  // if (labels.length) {
  //   newLabels = labels;
  //   newLabels = JSON.stringify(newLabels);
  //   newLabels = newLabels.replace('[', '%5B');
  //   newLabels = newLabels.replace(']', '%5D');
  // } else {
  //   newLabels = '';
  // }
  // urls.getLiveVAIstanceList.url = `${urls.getLiveVAIstanceList.url}?pindex=${pindex}&psize=${psize}&instanceName=${instanceName}&appName=${appName}&labels=${newLabels}&status=${status}&userId=${userId}`;
  return fetch.post(urls.getLiveVAIstanceList, obj);
}

export async function updateLiveVAInstanceApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.updateLiveVAInstance.url = `${urls.updateLiveVAInstance.url}/${obj.id}`;
  return fetch.put(urls.updateLiveVAInstance, obj);
}

export async function deleteLiveVAinstanceApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.deleteLiveVAinstance.url = `${urls.updateLiveVAInstance.url}/${obj.id}/${obj.userId}`;
  return fetch.del(urls.deleteLiveVAinstance);
}

export async function activationOfLiveVAInstanceApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.activationOfLiveVAInstance.url = urls.activationOfLiveVAInstance.url.replace('{id}', obj.id);
  urls.activationOfLiveVAInstance.url = `${urls.activationOfLiveVAInstance.url}?enabled=${obj.enabled}`;
  return fetch.post(urls.activationOfLiveVAInstance);
}

export async function restartLiveVAInstanceApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.restartLiveVAInstance.url = urls.restartLiveVAInstance.url.replace('{id}', obj.id);
  return fetch.post(urls.restartLiveVAInstance);
}

export async function getVAGatewaysApi() {
  const urls = _.cloneDeep(getUrls.vap);
  return fetch.get(urls.getVAGateways);
}

export async function getLiveInstanceDetailsApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.getLiveInstanceDetails.url = urls.getLiveInstanceDetails.url.replace('{id}', obj.instanceId);
  return fetch.get(urls.getLiveInstanceDetails);
}

// job va instances
export async function getJobInstanceDetailsApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.getJobInstanceDetails.url = urls.getJobInstanceDetails.url.replace('{id}', obj.instanceId);
  return fetch.get(urls.getJobInstanceDetails);
}
export async function getJobInstanceListApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  // let newLabels = '';
  // if (labels.length) {
  //   newLabels = JSON.stringify(labels);
  //   newLabels = newLabels.replace('[', '%5B');
  //   newLabels = newLabels.replace(']', '%5D');
  // } else {
  //   newLabels = '';
  // }
  // urls.getJobVAInstancesList.url = `${urls.getJobVAInstancesList.url}?pindex=${pindex}&psize=${psize}&instanceName=${instanceName}&appName=${appName}&labels=${newLabels}&status=${status}&userId=${userId}`;
  return fetch.post(urls.getJobVAInstancesList, obj);
}

export async function deleteJobVAinstanceApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.deleteJobVAinstance.url = `${urls.deleteJobVAinstance.url}/${obj.id}/${obj.userId}`;
  return fetch.del(urls.deleteJobVAinstance);
}

export async function createJobVAInstanceApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  return fetch.post(urls.createJobVAInstance, obj);
}

export async function updateJobVAInstanceApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.updateJobVAInstance.url = `${urls.updateJobVAInstance.url}/${obj.id}`;
  return fetch.put(urls.updateJobVAInstance, obj);
}

export async function startJobVAInstanceApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.startJobVAInstance.url = urls.startJobVAInstance.url.replace('{id}', obj.id);
  return fetch.post(urls.startJobVAInstance);
}

export async function stopJobVAInstanceApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.stopJobVAInstance.url = urls.stopJobVAInstance.url.replace('{id}', obj.id);
  return fetch.post(urls.stopJobVAInstance);
}

// service va instance
export async function getServiceInstanceDetailsApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.getServiceInstanceDetails.url = urls.getServiceInstanceDetails.url.replace(
    '{id}',
    obj.instanceId
  );
  return fetch.get(urls.getServiceInstanceDetails);
}

export async function getServiceInstanceListApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  // let newLabels = '';
  // if (labels.length) {
  //   newLabels = JSON.stringify(labels);
  //   newLabels = newLabels.replace('[', '%5B');
  //   newLabels = newLabels.replace(']', '%5D');
  // } else {
  //   newLabels = '';
  // }
  // urls.getServiceVAInstancesList.url = `${urls.getServiceVAInstancesList.url}?pindex=${pindex}&psize=${psize}&instanceName=${instanceName}&appName=${appName}&labels=${newLabels}&status=${status}&userId=${userId}`;
  return fetch.post(urls.getServiceVAInstancesList, obj);
}

export async function createServiceVAInstanceApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  return fetch.post(urls.createServiceVAInstance, obj);
}

export async function updateServiceVAInstanceApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.updateServiceVAInstance.url = `${urls.updateServiceVAInstance.url}/${obj.id}`;
  return fetch.put(urls.updateServiceVAInstance, obj);
}

export async function deleteServiceVAinstanceApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.deleteServiceVAinstance.url = `${urls.deleteServiceVAinstance.url}/${obj.id}/${obj.userId}`;
  return fetch.del(urls.deleteServiceVAinstance);
}

export async function activationOfServiceVAInstanceApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.activationOfServiceVAInstance.url = urls.activationOfServiceVAInstance.url.replace(
    '{id}',
    obj.id
  );
  urls.activationOfServiceVAInstance.url = `${urls.activationOfServiceVAInstance.url}?enabled=${obj.enabled}`;
  return fetch.post(urls.activationOfServiceVAInstance);
}

export async function restartServiceVAInstanceApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.restartServiceVAInstance.url = urls.restartServiceVAInstance.url.replace('{id}', obj.id);
  return fetch.post(urls.restartServiceVAInstance);
}

// vap files
export async function getUserUploadFilesApi({ pageNo, pageSize, name, mimetype }) {
  const urls = _.cloneDeep(getUrls.vap);
  const nameQuery = `&name=${name}`;
  const mimetypeQuery = `&mimetype=${mimetype}`;
  urls.getUserUploadFiles.url = `${urls.getUserUploadFiles.url}?pIndex=${pageNo}&pSize=${pageSize}${
    name ? nameQuery : ''
  }${mimetype ? mimetypeQuery : ''}`;
  return fetch.get(urls.getUserUploadFiles);
}

export async function deleteUserUploadFilesApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.deleteUserUploadFiles.url = `${urls.deleteUserUploadFiles.url}/${obj.id}`;
  return fetch.del(urls.deleteUserUploadFiles);
}

export async function downloadUserUploadFilesApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.downloadUserUploadFiles.url = urls.downloadUserUploadFiles.url.replace('{id}', obj.id);
  return fetch.downloadGet(urls.downloadUserUploadFiles);
}

export async function getFileBinaryBobApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.getFileBinaryBob.url = urls.getFileBinaryBob.url.replace('{id}', obj.id);
  return fetch.downloadGet(urls.getFileBinaryBob);
}

export async function getFileDetailsApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.getFileDetails.url = urls.getFileDetails.url.replace('{id}', obj.id);
  return fetch.get(urls.getFileDetails);
}

export async function getUserUploadFilesSrcApi(id) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.getUserUploadFilesSrc.url = urls.getUserUploadFilesSrc.url.replace('{id}', id);
  return fetch.getBlob(urls.getUserUploadFilesSrc);
}

export async function createUserUploadFilesApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  return fetch.fileUpload(urls.createUserUploadFiles, obj);
}

export async function updateUserUploadFilesApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.updateUserUploadFiles.url = `${urls.updateUserUploadFiles.url}/${obj.id}`;
  return fetch.put(urls.updateUserUploadFiles, obj);
}

// vap licenses
export async function getLicensesByAppIdApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.getLicensesByAppId.url = urls.getLicensesByAppId.url.replace('{id}', obj.engineId);
  return fetch.get(urls.getLicensesByAppId);
}

export async function addNewLicenseApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.addNewLicense.url = urls.addNewLicense.url.replace('{id}', obj.appId);
  return fetch.fileUpload(urls.addNewLicense, obj);
}

export async function updateLicenseApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.updateLicense.url = urls.updateLicense.url.replace('{id}', obj.appId);
  urls.updateLicense.url = urls.updateLicense.url.replace('{license-id}', obj.licenseId);
  return fetch.put(urls.updateLicense, obj);
}

export async function deleteLicenseApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.deleteLicense.url = urls.deleteLicense.url.replace('{id}', obj.appId);
  urls.deleteLicense.url = urls.deleteLicense.url.replace('{license-id}', obj.licenseId);
  return fetch.del(urls.deleteLicense);
}

export async function activateLicenseApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.activateLicense.url = urls.activateLicense.url.replace('{id}', obj.appId);
  urls.activateLicense.url = urls.activateLicense.url.replace('{license-id}', obj.licenseId);
  urls.activateLicense.url = `${urls.activateLicense.url}?enabled=${obj.enabled}`;
  return fetch.post(urls.activateLicense);
}

export async function getLicenseKeyApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.getLicenseKey.url = urls.getLicenseKey.url.replace('{id}', obj.appId);
  urls.getLicenseKey.url = urls.getLicenseKey.url.replace('{license-id}', obj.licenseId);
  return fetch.get(urls.getLicenseKey);
}

export async function downloadLicenseKeyApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.downloadLicenseKey.url = urls.downloadLicenseKey.url.replace('{id}', obj.appId);
  urls.downloadLicenseKey.url = urls.downloadLicenseKey.url.replace('{license-id}', obj.licenseId);
  return fetch.downloadGet(urls.downloadLicenseKey);
}

// post incident
export async function getIncidentApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  // urls.getIncidentList.url = `${urls.getIncidentList.url}?param=${
  //   obj.param ? obj.param : ''
  // }&endTime=${obj.endTime}${obj.psize ? `&psize=${obj.psize}` : ''}${
  //   obj.sort ? `&sort=${obj.sort}` : ''
  // }${obj.startTime ? `&startTime=${obj.startTime}` : ''}${
  //   obj.userId ? `&userId=${obj.userId}` : ''
  // }${obj.pindex !== '' && obj.pindex !== undefined ? `&pindex=${obj.pindex}` : ''}`;
  return fetch.post(urls.getIncidentList, obj);
}

export async function addIncidentApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  return fetch.fileUpload(urls.addIncident, obj);
}

export async function deleteIncidentApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  // urls.deleteIncident.url = `${urls.deleteIncident.url}/%5B${ids.join(
  //   "%2C"
  // )}%5D`;
  urls.deleteIncident.url = `${urls.deleteIncident.url}/${obj.ids.join()}`;
  return fetch.del(urls.deleteIncident);
}

export async function bindToJobvainstancesApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.bindToJobvainstances.url = `${urls.bindToJobvainstances.url.replace(
    '{incidentId}',
    obj.incidentUuid
  )}?userId=${obj.userId}`;
  return fetch.post(urls.bindToJobvainstances, obj);
}

export async function bindToLivevainstancesApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.bindToLivevainstances.url = `${urls.bindToLivevainstances.url.replace(
    '{incidentId}',
    obj.incidentUuid
  )}?userId=${obj.userId}`;
  return fetch.post(urls.bindToLivevainstances, obj);
}

export async function bindToServicevainstancesApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.bindToServicevainstances.url = `${urls.bindToServicevainstances.url.replace(
    '{incidentId}',
    obj.incidentUuid
  )}?userId=${obj.userId}`;
  return fetch.post(urls.bindToServicevainstances, obj);
}

export async function findInstancesByIncidentIdApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  return fetch.post(urls.findInstancesByIncidentId, obj);
}

export async function updateIncidentApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  return fetch.fileUpload(urls.updateIncident, obj);
}

export async function closeIncidentApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  return fetch.post(urls.closeIncident, obj);
}

// report
export async function getEventHandlersApi() {
  const urls = _.cloneDeep(getUrls.vap);
  return fetch.get(urls.getEventHandlers);
}

export async function getSearchReportsApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  return fetch.post(urls.getSearchReports, obj);
}
export async function getGenerateCrowdChartApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  const temp = {
    type: obj.type,
    time: {
      from: obj.timefr,
      to: obj.timeto
    },
    // page: {
    //   index: obj.pindex,
    //   size: obj.psize,
    //   sort: obj.sort
    // },
    sources: [],
    vaInstances: [
      {
        id: obj.vainstanceid === undefined ? '' : obj.vainstanceid,
        type: obj.vainstancetype,
        appId: ''
      }
    ],
    data: []
  };
  // if (obj.srcprovider !== undefined) {
  //   temp.sources.push({
  //     provider: obj.srcprovider,
  //     deviceProviderId: obj.srcdeviceproviderid,
  //     deviceId: obj.srcdeviceid,
  //     deviceChannelId: obj.srcdevicechannelid,
  //     fileId: '',
  //     url: ''
  //   });
  // }
  if (!_.isEmpty(obj.multipleDeivceItems)) {
    obj.multipleDeivceItems.forEach(item => {
      temp.sources.push({
        provider: obj.srcprovider,
        deviceProviderId: 'uvms',
        deviceId: item.deviceId,
        deviceChannelId: item.channelId,
        fileId: '',
        url: ''
      });
    });
  }
  return fetch.post(urls.getGenerateCrowdChart, temp);
}

export async function deleteReportsApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  urls.deleteReports.url = `${urls.deleteReports.url}?type=${obj.type}&timefr=${
    obj.timefr
  }&timeto=${obj.timeto}&pindex=${obj.pindex}&psize=${obj.psize}&sort=${obj.sort}${
    obj.srcprovider ? `&srcprovider=${obj.srcprovider}` : ''
  }${obj.srcdeviceproviderid ? `&srcdeviceproviderid=${obj.srcdeviceproviderid}` : ''}${
    obj.srcdeviceid ? `&srcdeviceid=${obj.srcdeviceid}` : ''
  }${obj.srcdevicechannelid ? `&srcdevicechannelid=${obj.srcdevicechannelid}` : ''}${
    obj.srcfileid ? `&srcfileid=${obj.srcfileid}` : ''
  }${obj.vainstanceid ? `&vainstanceid=${obj.vainstanceid}` : ''}${
    obj.vainstancetype ? `&vainstancetype=${obj.vainstancetype}` : ''
  }${obj.userid ? `&userid=${obj.userid}` : ''}${obj.filters ? `&filters=${obj.filters}` : ''}`;
  return fetch.del(urls.deleteReports);
}

// report aggregate
export async function getAggregateReportsApi(obj) {
  const urls = _.cloneDeep(getUrls.vap);
  return fetch.post(urls.getAggregateReports, obj);
  // urls.getAggregateReports.url = `${urls.getAggregateReports.url}?type=${obj.type}&timefr=${
  //   obj.timefr
  // }&timeto=${obj.timeto}&pindex=${obj.pindex}&psize=${obj.psize}&sort=${obj.sort}&timeunit=${
  //   obj.timeunit
  // }&timezone=${obj.timezone}${obj.srcprovider ? `&srcprovider=${obj.srcprovider}` : ''}${
  //   obj.srcdeviceproviderid ? `&srcdeviceproviderid=${obj.srcdeviceproviderid}` : ''
  // }${obj.srcdeviceid ? `&srcdeviceid=${obj.srcdeviceid}` : ''}${
  //   obj.srcdevicechannelid ? `&srcdevicechannelid=${obj.srcdevicechannelid}` : ''
  // }${obj.srcfileid ? `&srcfileid=${obj.srcfileid}` : ''}${
  //   obj.vainstanceid ? `&vainstanceid=${obj.vainstanceid}` : ''
  // }${obj.vainstancetype ? `&vainstancetype=${obj.vainstancetype}` : ''}${
  //   obj.userid ? `&userid=${obj.userid}` : ''
  // }${obj.filters ? `&filters=${obj.filters}` : ''}`;
  // return fetch.get(urls.getAggregateReports);
}

export async function getCodeByCodeCategoryApi(obj) {
  const urls = _.cloneDeep(getUrls.global);
  return fetch.post(urls.codeCategory, obj);
}
