import getUrls from '../utils/urls/index';
import fetch from '../utils/request';

const urls = getUrls.auditTrail;

export async function getAuditTrailListApi(obj) {
  return fetch.post(urls.searchAuditTrailList, obj);
}
export async function exportAudit(selected) {
  return fetch.downloadPost(urls.exportAudit, selected);
}
export async function exportAll(obj) {
  return fetch.downloadPost(urls.exportAuditAll, obj);
}
