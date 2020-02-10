import fetch from 'utils/request';
import getUrl from '../utils/urls/index';

const urls = getUrl.user;

export async function getUserDomainInfoApi(userId) {
  return fetch.post(urls.getUserDomainInfo, {
    userId
  });
}
export async function syncUpDomainApi(userid, domainName, pass) {
  return fetch.post(urls.syncUpDomain, {
    userId: userid,
    domainName,
    password: pass
  });
}
