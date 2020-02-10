/**
 *  global paths configuration
 *
 */

const arcgisAddress = `https://${window.gis_env.ARCGIS_HOST}:${window.gis_env.ARCGIS_PORT}`;
const envPublicURL = process.env.PUBLIC_URL; // env PUBLIC_URL
const env = process.env.NODE_ENV;
let imgURL;
let baseURL;
let arcgisGeoAddressAPI;
let arcgisLibraryAddress; // server address
if (env === 'development') {
  // arcgisLibraryAddress = {
  //   js: "https://js.arcgis.com",
  //   css: "https://js.arcgis.com"
  // };
  arcgisLibraryAddress = {
    js: `https://${window.location.host}/library/js`,
    css: `https://${window.location.host}/library/css`
  };
  baseURL = '';
  imgURL = '';
} else {
  arcgisLibraryAddress = {
    js: `https://${window.location.host}/library/js`,
    css: `https://${window.location.host}/library/css`
  };
  baseURL = '';
  imgURL = '/ivh-gui';
}

export default {
  env,
  imgURL,
  baseURL,
  envPublicURL,
  arcgisAddress,
  arcgisLibraryAddress,
  arcgisGeoAddressAPI
};
