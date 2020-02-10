import materialKeys from '../materialKeys';

const namespace = 'alarm';
const alarm = {
  'IVH-ALARM-EVENT-MANAGEMENT-API': {
    Address: '/api',
    Path: '/ummi-alarm/',
    URLS: {
      selectAllEvent: {
        url: 'alarm/event/findAll',
        materialKey: materialKeys['M2-7']
      },
      filterAllEvent: {
        url: 'alarm/event/pageQuery',
        materialKey: materialKeys['M3-43']
      },
      getEventQueryList: {
        url: 'alarm/event/eventQueryList',
        materialKey: materialKeys['M3-43']
      },
      deleteEvent: {
        url: 'alarm/event/deleteEvent',
        materialKey: materialKeys['M2-7']
      },
      updateEvent: {
        url: 'alarm/event/updateEvent',
        materialKey: materialKeys['M2-7']
      },
      createEvent: {
        url: 'alarm/event/addEvent',
        materialKey: materialKeys['M2-7']
      },
      export: {
        url: 'alarm/event/export',
        materialKey: materialKeys['M4-79']
      },
      createAlarm: {
        url: 'alarm/createAlarm',
        materialKey: materialKeys['M2-7']
      }
    }
  },
  'IVH-ALARM-HISTORY-API': {
    Address: '/api',
    Path: '/ummi-alarm/',
    URLS: {
      alarmConfigurationList: {
        url: 'alarm/alarmConfigurationList',
        materialKey: materialKeys['M3-8']
      },
      alarmHistoryList: {
        url: 'alarm/alarmHistoryList',
        materialKey: materialKeys['M3-6']
      },
      alarmSubscribeSettingList: {
        url: 'alarm/alarmSubscribeSettingList',
        materialKey: materialKeys['M2-7']
      },
      alarmHandlingList: {
        url: 'alarm/alarmHandlingList',
        materialKey: materialKeys['M4-19']
      },
      getAction: {
        url: 'alarm/getAction',
        materialKey: materialKeys['M4-78']
      },
      updateAlarmDetailsStatus: {
        url: 'alarm/updateAlarmDetailsStatus',
        materialKey: materialKeys['M4-77']
      },
      createAlarm: {
        url: 'alarm/createAlarm',
        materialKey: materialKeys['M2-7']
      },
      alarmDownload: {
        url: 'alarm',
        materialKey: ''
      },
      updateActionWithoutFile: {
        url: 'alarm/updateAlarmDetailsAction',
        materialKey: materialKeys['M4-77']
      }
    }
  },
  'IVH-ALARM-REALTIME-API': {
    Address: '/api',
    Path: '/ummi-alarm/',
    URLS: {
      getRealTimeAlarm: {
        url: 'alarm/getRealTimeAlarm',
        materialKey: materialKeys['M3-7']
      },
      getRealTimeAlarmForVMS: {
        url: 'alarm/getRealTimeAlarmForVMS',
        materialKey: materialKeys['M3-7']
      },
      getAction: {
        url: 'alarm/getAction',
        materialKey: materialKeys['M4-78']
      },
      updateAlarmDetailsStatus: {
        url: 'alarm/updateAlarmDetailsStatus',
        materialKey: materialKeys['M4-77']
      },
      createAlarm: {
        url: 'alarm/createAlarm',
        materialKey: materialKeys['M2-7']
      },
      getRealTimeAlarmForVAP: {
        url: 'alarm/getRealTimeAlarmForVAP',
        materialKey: materialKeys['M3-7']
      },
      updateAlarmFalsePositiveStatus: {
        url: 'vapAlarm/updateAlarmFalsePositiveStatus'
      }
    }
  },
  'IVH-ALARM-CONFIGURATION-API': {
    Address: '/api',
    Path: '/ummi-alarm/',
    URLS: {
      searchAlarms: {
        url: 'alarm/searchAlarms',
        materialKey: materialKeys['M4-81']
      },
      searchOne: {
        url: 'alarm/searchOne',
        materialKey: materialKeys['M4-24']
      },
      updateAlarmSetting: {
        url: 'alarm/updateAlarmSettings',
        materialKey: materialKeys['M4-61']
      },
      deliverTo: {
        url: 'alarm/deliverTo',
        materialKey: materialKeys['M4-62']
      },
      createAlarm: {
        url: 'alarm/createAlarm',
        materialKey: materialKeys['M3-8']
      },
      deleteAlarms: {
        url: 'alarm/deleteAlarms',
        materialKey: materialKeys['M4-80']
      },
      saveAlarm: {
        url: 'alarm/saveAlarm',
        materialKey: materialKeys['M4-63']
      },
      updateAlarm: {
        url: 'alarm/updateAlarm',
        materialKey: materialKeys['M4-25']
      }
    }
  },
  'IVH-ALARM-SUBSCRIBE-API': {
    Address: '/api',
    Path: '/ummi-alarm/',
    URLS: {
      subscribeSetting: {
        url: 'alarm/subscribeSetting',
        materialKey: materialKeys['M4-82']
      },
      subscribeSettingSave: {
        url: 'alarm/subscribeSettingSave',
        materialKey: materialKeys['M4-27']
      },
      subscribeSearch: {
        url: 'alarm/subscribeSearch',
        materialKey: materialKeys['M4-26']
      }
    }
  },
  IVH_EXPORT_API: {
    Address: '/api',
    Path: '/ummi-admin/',
    URLS: {
      exportAlarm: {
        url: 'export/excel/alarmHandling',
        materialKey: materialKeys['M4-111']
      },
      exportAllEvent: {
        url: 'export/excel/eventQuery',
        materialKey: materialKeys['M4-79']
      }
    }
  }
};
export default { alarm, namespace };
