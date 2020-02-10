/**
 * The default message bus heartbeat interval.
 * Default value is 30 seconds
 */
export const MSG_BUS_HEARTBEAT_INTERVAL = 30000;

/**
 * The default clipping progress message bus heartbeat interval.
 * Default value is 5 seconds
 */
export const PROGRESS_MSG_BUS_HEARTBEAT_INTERVAL = 5000;

/**
 * The default the time of expired session.
 * Default value is 30 minutes.
 */
export const SESSION_EXPIRED_TIME = 30 * 60 * 1000;

/**
 * The default token key for each rest api and websocket.
 * Default value is 'Authorization'
 */
export const TOKEN_KEY = 'Authorization';

/**
 * The default device address key for each rest api and websocket.
 * Default value is 'clientIp'
 */
export const DEVICE_ADDRESS_KEY = 'clientIp';

/**
 * The default material key for each rest api and websocket.
 * Default value is 'materialKey'
 */
export const MATERIAL_KEY = 'materialKey';

/**
 * The default key for user info.
 * Default value is 'IVH-CURRENT-USER'
 */
export const USER_KEY = 'IVH-CURRENT-USER';

/**
 * The default key for previous user info.
 * Default value is 'IVH-PREVIOUS-USER'
 */
export const PREVIOUS_USER_KEY = 'IVH-PREVIOUS-USER';

/**
 * The default key for url config.
 * Default value is 'IVH-URL'
 */
export const URL_KEY = 'IVH-URL';

/**
 * The default key for all the setting.
 * Default value is 'IVH-SETTING'
 */
export const SETTING_KEY = 'IVH-SETTING';

/**
 * The default key for all the language.
 * Default value is 'IVH-LANGUAGE'
 */
export const LANGUAGE_KEY = 'IVH-LANGUAGE';

/**
 * The default path for url.json.
 * Default value is './static/config/url.json'
 */
export const URL_CONFIG_PATH = '/static/config/url.json';

/**
 * The default path for setting.json.
 * Default value is './static/config/setting.json'
 */
export const SETTING_CONFIG_PATH = '/static/config/setting.json';

/**
 * The default path for language.
 * Default value is './static/lang/{0}.json'
 */
export const LANG_CONFIG_PATH = '/static/lang/{0}.json';

export const DATA_INFO_NAME_STRING = [
  'deviceInfo',
  'channelInfo',
  'metadata',
  'timeInfo',
  'sessionIds'
];

export const DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss';
export const DATE_FORMAT_DATE_PICKER = 'DD/MM/YYYY HH:mm';
export const DATE_FORMAT_DD_MM_YYYY = 'DD/MM/YYYY';
export const TIME_FORMAT_HH_MM = 'HH:mm';
export const DATE_FORMAT_HH_MM_SS = 'hh:mm:ss';
export const DATE_FORMAT_DATE_T_TIME = 'YYYY-MM-DDTHH:mm';
export const PAGE_NUMBER = 0;
export const PAGE_SIZE = 5;
export const UPDATE_SESSION_TIMER = 1000 * 60 * 40;
