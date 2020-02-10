import fetch from 'utils/request';
import getUrl from '../utils/urls/index';

const urls = getUrl.user;

export async function syncUpDevicesApi(userid) {
  return fetch.post(urls.syncUpDevices, {
    userId: userid
  });
}
export async function syncUpChannelsApi(userid) {
  return fetch.post(urls.syncUpChannels, {
    userId: userid
  });
}
