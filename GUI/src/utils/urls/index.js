import env from '../envconfig';
import alarm from './alarm';
import vap from './vap';
import vms from './vms';
import user from './user';
import vade from './vade';
import security from './security';
import overview from './overview';
import auditTrail from './auditTrail';
import websocket from './websocket';
import map from './map';
import globals from './global';

const urlsData = [
  alarm,
  vap,
  vms,
  user,
  vade,
  overview,
  auditTrail,
  websocket,
  map,
  security,
  globals
];

function convertUrl(json, namespace) {
  const result = {};
  for (const key in json) {
    if (!json.hasOwnProperty(key)) {
      return;
    }

    const serverItem = json[key];
    let path = serverItem.Path || '';
    path = path.startsWith('/') ? path.substring(1, path.length) : path;
    path = path.endsWith('/') ? path.substring(0, path.length - 1) : path;

    let template = `${serverItem.Address}${path === '' ? `/` : `/${path}/`}`;
    if (
      env.env !== 'development' &&
      serverItem.Address &&
      serverItem.Address.indexOf('wss:') !== -1
    ) {
      const localIp = window.location.host;
      const wsUrl = `wss://${localIp}`;
      template = `${wsUrl}${path === '' ? `/` : `/${path}/`}`;
    }
    for (const key in serverItem.URLS) {
      if (!serverItem.URLS.hasOwnProperty(key)) {
        return;
      }

      let { url } = serverItem.URLS[key];
      const { materialKey } = serverItem.URLS[key];
      url = url.startsWith('/') ? url.substring(1, url.length) : url;

      const item = { url: null, materialKey: null };
      item.url = template + url;
      item.materialKey = materialKey;
      result[key] = item;
    }
  }
  return { [namespace]: result };
}

function getUrls(data) {
  let result = {};
  data.forEach(item => {
    result = Object.assign({}, result, { ...convertUrl(item[item.namespace], item.namespace) });
  });
  return result;
}

export default getUrls(urlsData);
