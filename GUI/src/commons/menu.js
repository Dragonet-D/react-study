import { I18n } from 'react-i18nify';
import materialKeys from '../utils/materialKeys';
import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: I18n.t('menu.security.name'),
    path: 'security',
    authority: [materialKeys['M2-1']],
    icon: 'Security',
    hideInMenu: false,
    children: [
      {
        name: I18n.t('menu.security.children.userManagement'),
        path: 'user',
        authority: [materialKeys['M3-1']]
      },
      {
        name: I18n.t('menu.security.children.userGroup'),
        path: 'user-group',
        authority: [materialKeys['M3-41']]
      },
      {
        name: I18n.t('menu.security.children.roleManagement'),
        path: 'role',
        authority: [materialKeys['M3-3']]
      },
      {
        name: I18n.t('menu.security.children.syncUpVMSInformation'),
        path: 'sync-up-vms-information',
        authority: [materialKeys['M3-49']]
      },
      {
        name: I18n.t('menu.security.children.syncUpADAccounts'),
        path: 'sync-up-ad-accounts',
        authority: [materialKeys['M3-42']]
      },
      {
        name: I18n.t('menu.security.children.apiKey'),
        path: 'api-key',
        authority: [materialKeys['M3-54']]
      }
    ]
  },
  {
    name: I18n.t('menu.alarm.name'),
    path: 'alarm',
    authority: [materialKeys['M2-2']],
    icon: 'Notifications',
    hideInMenu: false,
    children: [
      {
        name: I18n.t('menu.alarm.children.alarmRealtime'),
        path: 'realtime',
        authority: [materialKeys['M3-7']]
      },
      {
        name: I18n.t('menu.alarm.children.alarmHistory'),
        path: 'history',
        authority: [materialKeys['M3-6']]
      },
      {
        name: I18n.t('menu.alarm.children.alarmConfiguration'),
        path: 'configuration',
        authority: [materialKeys['M3-8']]
      },
      {
        name: I18n.t('menu.alarm.children.alarmSubscribe'),
        path: 'subscribe',
        authority: [materialKeys['M3-9']]
      },
      {
        name: I18n.t('menu.alarm.children.eventQuery'),
        path: 'event-query',
        authority: [materialKeys['M3-43']]
      }
    ]
  },
  {
    name: I18n.t('menu.vade.name'),
    path: 'vade',
    authority: [materialKeys['M2-6']],
    icon: 'Timeline',
    children: [
      {
        name: I18n.t('menu.vade.children.task'),
        path: 'task',
        authority: [materialKeys['M3-22']]
      },
      {
        name: I18n.t('menu.vade.children.data'),
        path: 'data',
        authority: [materialKeys['M3-23']]
      },
      {
        name: I18n.t('menu.vade.children.program'),
        path: 'program',
        authority: [materialKeys['M3-24']]
      },
      {
        name: I18n.t('menu.vade.children.dataType'),
        path: 'datatype',
        authority: [materialKeys['M3-25']]
      },
      {
        name: I18n.t('menu.vade.children.taskType'),
        path: 'tasktype',
        authority: [materialKeys['M3-26']]
      },
      {
        name: I18n.t('menu.vade.children.resourceMonitor'),
        path: 'resource-monitor',
        authority: [materialKeys['M3-44']]
      }
    ]
  },
  {
    name: I18n.t('menu.uvms.name'),
    path: 'uvms',
    authority: [materialKeys['M2-4']],
    icon: 'Videocam',
    children: [
      {
        name: I18n.t('menu.uvms.children.videoDevice'),
        path: 'videoDevice',
        authority: [materialKeys['M3-14']]
      },
      {
        name: I18n.t('menu.uvms.children.channel'),
        path: 'channel',
        authority: [materialKeys['M3-16']]
      },
      {
        name: I18n.t('menu.uvms.children.channelGroup'),
        path: 'channelGroup',
        authority: [materialKeys['M3-48']]
      },
      {
        name: I18n.t('menu.uvms.children.firmware'),
        path: 'firmware',
        authority: [materialKeys['M3-17']]
      },
      {
        name: I18n.t('menu.uvms.children.liveView'),
        path: 'liveView',
        authority: [materialKeys['M3-19']]
      },
      {
        name: I18n.t('menu.uvms.children.playback'),
        path: 'playback',
        authority: [materialKeys['M3-20']]
      },
      {
        name: I18n.t('menu.uvms.children.recording'),
        path: 'recording',
        authority: [materialKeys['M3-35']]
      },
      {
        name: I18n.t('menu.uvms.children.requestAccess'),
        path: 'requestAccess',
        authority: [materialKeys['M3-39']]
      },
      {
        name: I18n.t('menu.uvms.children.approveAccess'),
        path: 'approveAccess',
        authority: [materialKeys['M3-40']]
      },
      {
        name: I18n.t('menu.uvms.children.iconSetUp'),
        path: 'icon-set-up',
        authority: []
      }
    ]
  },
  {
    name: I18n.t('menu.uvap.name'),
    path: 'uvap',
    authority: [materialKeys['M2-3']],
    icon: 'VideoCall',
    children: [
      {
        name: I18n.t('menu.uvap.children.face.name'),
        path: 'face',
        authority: [materialKeys['M3-10']],
        children: [
          {
            name: I18n.t('menu.uvap.children.face.children.faceEnrollment'),
            path: 'face-enrollment',
            authority: [materialKeys['M4-29']]
          },
          {
            name: I18n.t('menu.uvap.children.face.children.faceSearch'),
            path: 'face-search',
            authority: [materialKeys['M4-30']]
          },
          {
            name: I18n.t('menu.uvap.children.face.children.faceCompare'),
            path: 'face-compare',
            authority: [materialKeys['M4-31']]
          },
          {
            name: I18n.t('menu.uvap.children.face.children.specialWatchList'),
            path: 'special-watch-list',
            authority: [materialKeys['M4-32']]
          }
        ]
      },
      {
        name: I18n.t('menu.uvap.children.files'),
        path: 'files',
        authority: [materialKeys['M3-11']]
      },
      {
        name: I18n.t('menu.uvap.children.vaengines'),
        path: 'va-engines',
        authority: [materialKeys['M3-12']]
      },
      {
        name: I18n.t('menu.uvap.children.vaInstance.name'),
        path: 'va-instance',
        authority: [materialKeys['M3-13']],
        children: [
          {
            name: I18n.t('menu.uvap.children.vaInstance.children.jobVaInstance'),
            path: 'job-va-instance',
            authority: [materialKeys['M4-36']]
          },
          {
            name: I18n.t('menu.uvap.children.vaInstance.children.liveVaInstance'),
            path: 'live-va-instance',
            authority: [materialKeys['M4-37']]
          },
          {
            name: I18n.t('menu.uvap.children.vaInstance.children.serviceVaInstance'),
            path: 'service-va-instance',
            authority: []
            // authority: [materialKeys['M4-158']]
          }
        ]
      },
      {
        name: I18n.t('menu.uvap.children.license.name'),
        path: 'license',
        authority: [materialKeys['M3-51']]
      },
      {
        name: I18n.t('menu.uvap.children.postIncident.name'),
        path: 'post-incident',
        authority: [materialKeys['M3-52']]
      },
      {
        name: I18n.t('menu.uvap.children.report.name'),
        path: 'report',
        authority: [materialKeys['M3-53']],
        children: [
          {
            name: I18n.t('menu.uvap.children.report.children.reportSearch'),
            path: 'report-search',
            authority: [materialKeys['M4-161']]
          },
          {
            name: I18n.t('menu.uvap.children.report.children.reportAggregate'),
            path: 'report-aggregate',
            authority: [materialKeys['M4-162']]
          },
          {
            name: I18n.t('menu.uvap.children.report.children.trendAnalysis'),
            path: 'trend-analysis',
            authority: []
          }
        ]
      }
    ]
  },
  {
    name: I18n.t('menu.overview.name'),
    path: 'overview',
    authority: [materialKeys['M1-2']],
    icon: 'Dashboard'
  },
  {
    name: 'Audit Trail',
    path: 'auditTrail',
    authority: [materialKeys['M2-8']],
    icon: 'Info'
  }
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
