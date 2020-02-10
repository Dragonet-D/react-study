/**
 * The default 'totalNum' of TablePagination.
 */
export const TOTALNUM = 'totalNum';

/**
 * The default validMsg when create or update data
 */
export const VALIDMSG_NOTNULL = 'Mandatory Field';
export const VALIDMSG_NOTCHANGE = 'No Change';
export const VALIDMSG_NOTMATCH = 'Not Match';
export const VIDEO_TYPE = [
  'video/avi',
  'video/mp4',
  'video/quicktime',
  'video/x-ms-wmv',
  'video/mpeg',
  'video/mpg',
  'video/3gpp',
  'video/3gpp2',
  'video/x-ms-asf',
  'video/x-msvideo'
];

/**
 * The default common constants in vap
 */
export const VAP_COMMON = {
  installerTypes: ['PACKAGE', 'CONFIG_FILE'],
  vaInstanceType: ['JOB_VA', 'LIVE_VA'],
  srcprovider: ['vap_storage_file', 'vap_device_stream'],
  sort: ['asc', 'desc'],
  timeunit: ['hourly', 'daily'],
  timezone: ['Asia/Singapore'],
  incidentType: ['Face Detection', 'Vichel License Detection', 'Suspicous Recongnition'],
  provider: {
    device: 'vap_device_stream',
    file: 'vap_storage_file',
    url: 'url'
  },
  // priority: ['HIGH', 'NORMAL'],
  days: [
    { name: 'Monday', value: 'MONDAY' },
    { name: 'Tuesday', value: 'TUESDAY' },
    { name: 'Wednesday', value: 'WEDNESDAY' },
    { name: 'Thursday', value: 'THURSDAY' },
    { name: 'Friday', value: 'FRIDAY' },
    { name: 'Saturday', value: 'SATURDAY' },
    { name: 'Sunday', value: 'SUNDAY' }
  ],
  // NONE, STRING, FILE
  // keyType: [
  //   { name: 'NONE', value: 'NONE' },
  //   { name: 'STRING', value: 'STRING' },
  //   { name: 'FILE', value: 'FILE' }
  // ]
  keyType: ['NONE', 'STRING', 'FILE']
};
