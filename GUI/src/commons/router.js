import { createElement } from 'react';
import { dynamic } from 'dva';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache
          });
      });
    }
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['global'], () => import('../layouts/BasicLayout'))
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout'))
    },
    '/user/login': {
      component: dynamicWrapper(app, ['user/user'], () => import('pages/User/Login'))
    },
    '/user/find-back-password': {
      component: dynamicWrapper(app, ['user/user'], () => import('pages/User/UserForgetPassword'))
    },
    '/user/reset-password': {
      component: dynamicWrapper(app, ['user/user'], () => import('pages/User/UserChangePassword'))
    },
    '/user/transfer': {
      component: dynamicWrapper(app, ['user/user'], () =>
        import('components/User/Login/LoginADFSTransfer')
      )
    },
    '/home': {
      component: dynamicWrapper(app, ['map/map'], () => import('pages/Map')),
      noLoading: true
    },
    '/security/user': {
      component: dynamicWrapper(app, ['security/securityUserManagement'], () =>
        import('pages/Security/UserManagement')
      )
    },
    '/security/role': {
      component: dynamicWrapper(app, ['security/securityRoleManagement'], () =>
        import('pages/Security/RoleManagement')
      )
    },
    '/security/user-group': {
      component: dynamicWrapper(app, ['security/securityUserGroup'], () =>
        import('pages/Security/UserGroup')
      )
    },
    '/security/sync-up-ad-accounts': {
      component: dynamicWrapper(app, ['security/securitySyncUpADAccounts'], () =>
        import('pages/Security/SyncUpADAccounts')
      )
    },
    '/security/sync-up-vms-information': {
      component: dynamicWrapper(app, ['security/securitySyncUpVMSInformation'], () =>
        import('pages/Security/SyncUpVMSInformation')
      )
    },
    '/security/api-key': {
      component: dynamicWrapper(
        app,
        ['security/securityApiKey', 'security/securityUserGroup'],
        () => import('pages/Security/ApiKey')
      )
    },
    '/alarm/realtime': {
      component: dynamicWrapper(app, ['alarm/alarmRealtime'], () =>
        import('pages/Alarm/AlarmRealtime')
      )
    },
    '/alarm/history': {
      component: dynamicWrapper(app, ['alarm/alarmHistory'], () =>
        import('pages/Alarm/AlarmHistory')
      )
    },
    '/alarm/configuration': {
      component: dynamicWrapper(app, ['alarm/alarmConfiguration'], () =>
        import('pages/Alarm/AlarmConfiguration')
      )
    },
    '/alarm/subscribe': {
      component: dynamicWrapper(app, ['alarm/alarmSubscribe'], () =>
        import('pages/Alarm/AlarmSubscribe')
      )
    },
    '/alarm/event-query': {
      component: dynamicWrapper(app, ['alarm/eventQuery'], () => import('pages/Alarm/EventQuery'))
    },
    '/uvms/icon-set-up': {
      component: dynamicWrapper(app, ['vms/VMSIconSetUp'], () => import('pages/VMS/IconSetUp'))
    },
    '/uvms/videoDevice': {
      component: dynamicWrapper(app, ['vms/VMSVideoDevice'], () => import('pages/VMS/Device'))
    },
    '/uvms/channel': {
      component: dynamicWrapper(app, ['vms/VMSChannel'], () => import('pages/VMS/Channel'))
    },
    '/uvms/channelGroup': {
      component: dynamicWrapper(app, ['vms/VMSChannelGroup'], () =>
        import('pages/VMS/ChannelGroup')
      )
    },
    '/uvms/firmware': {
      component: dynamicWrapper(app, ['vms/VMSFirmware'], () => import('pages/VMS/Firmware'))
    },
    '/uvms/liveView': {
      component: dynamicWrapper(app, ['vms/VMSLiveView'], () => import('pages/VMS/LiveView')),
      noLoading: true
    },
    '/uvms/playback': {
      component: dynamicWrapper(app, ['vms/VMSPlayback'], () => import('pages/VMS/Playback'))
      // noLoading: true
    },
    '/uvms/recording': {
      component: dynamicWrapper(app, ['vms/VMSRecording'], () => import('pages/VMS/Recording')),
      noLoading: true
    },
    '/uvms/requestAccess': {
      component: dynamicWrapper(app, ['vms/VMSRequestAccess'], () =>
        import('pages/VMS/RequestAccess')
      )
    },
    '/uvms/approveAccess': {
      component: dynamicWrapper(app, ['vms/VMSApproveAccess'], () =>
        import('pages/VMS/ApproveAccess')
      )
    },
    '/vade/tasktype': {
      component: dynamicWrapper(app, ['vade/vadeTaskType'], () => import('pages/VADE/VADETaskType'))
    },
    '/vade/datatype': {
      component: dynamicWrapper(app, ['vade/vadeDataType'], () => import('pages/VADE/VADEDataType'))
    },
    '/vade/program': {
      component: dynamicWrapper(app, ['vade/vadeProgram'], () => import('pages/VADE/VADEProgram'))
    },
    '/vade/data': {
      component: dynamicWrapper(app, ['vade/vadeData'], () => import('pages/VADE/VADEData'))
    },
    '/vade/task': {
      component: dynamicWrapper(app, ['vade/vadeTask'], () => import('pages/VADE/VADETask'))
    },
    '/vade/resource-monitor': {
      component: dynamicWrapper(app, ['vade/vadeResourceMonitor'], () =>
        import('pages/VADE/VADEResourceMonitor')
      ),
      noTitle: true
    },
    '/uvap/face/face-enrollment': {
      component: dynamicWrapper(app, ['uvap/faceEnrollment'], () =>
        import('pages/UVAP/Face/FaceEnrollment')
      ),
      noTitle: true
    },
    '/uvap/face/face-search': {
      component: dynamicWrapper(app, ['uvap/faceSearch'], () =>
        import('pages/UVAP/Face/FaceSearch')
      ),
      noTitle: true
    },
    '/uvap/face/face-compare': {
      component: dynamicWrapper(app, ['uvap/faceCompare'], () =>
        import('pages/UVAP/Face/FaceCompare')
      )
    },
    '/uvap/face/special-watch-list': {
      component: dynamicWrapper(app, ['uvap/specialWatchList'], () =>
        import('pages/UVAP/Face/SpecialWatchList')
      )
    },
    '/uvap/files': {
      component: dynamicWrapper(app, ['uvap/vapFiles'], () => import('pages/UVAP/Files'))
    },
    '/uvap/va-engines': {
      component: dynamicWrapper(app, ['uvap/VAEngines'], () => import('pages/UVAP/VAEngines'))
    },
    '/uvap/va-instance/job-va-instance': {
      component: dynamicWrapper(app, ['uvap/JobVaInstance', 'vms/VMSPlayback'], () =>
        import('pages/UVAP/VAInstance/JobVaInstance')
      )
    },
    '/uvap/va-instance/live-va-instance': {
      component: dynamicWrapper(app, ['uvap/LiveVaInstance', 'vms/VMSLiveView'], () =>
        import('pages/UVAP/VAInstance/LiveVaInstance')
      )
    },
    '/uvap/va-instance/service-va-instance': {
      component: dynamicWrapper(app, ['uvap/ServiceVaInstance'], () =>
        import('pages/UVAP/VAInstance/ServiceVaInstance')
      )
    },
    '/uvap/report/report-search': {
      component: dynamicWrapper(app, ['uvap/ReportSearch'], () =>
        import('pages/UVAP/Report/ReportSearch')
      ),
      noTitle: true
    },
    '/uvap/report/report-aggregate': {
      component: dynamicWrapper(app, ['uvap/ReportAggregate'], () =>
        import('pages/UVAP/Report/ReportAggregate')
      ),
      noTitle: true
    },
    '/uvap/report/trend-analysis': {
      component: dynamicWrapper(app, ['uvap/TrendAnalysis'], () =>
        import('pages/UVAP/Report/TrendAnalysis')
      ),
      noTitle: true
    },
    '/uvap/license': {
      component: dynamicWrapper(app, ['uvap/License'], () => import('pages/UVAP/License'))
    },
    '/uvap/post-incident': {
      component: dynamicWrapper(
        app,
        [
          'uvap/PostIncident',
          'uvap/JobVaInstance',
          'vms/VMSPlayback',
          'uvap/LiveVaInstance',
          'uvap/ServiceVaInstance'
        ],
        () => import('pages/UVAP/PostIncident')
      ),
      noTitle: true
    },
    '/overview': {
      component: dynamicWrapper(app, ['overview/overview'], () => import('pages/Overview'))
    },
    '/auditTrail': {
      component: dynamicWrapper(app, ['auditTrail/auditTrail'], () => import('pages/AuditTrail'))
    },
    '/exception': {
      component: dynamicWrapper(app, [], () => import('../layouts/ExceptionLayout'))
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('pages/Exception/Exception403'))
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('pages/Exception/Exception404'))
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('pages/Exception/Exception500'))
    },
    '/unauthorized': {
      component: dynamicWrapper(app, [], () => import('../layouts/UnauthorizedLayout'))
    },
    '/unauthorized/home': {
      component: dynamicWrapper(app, [], () => import('pages/Unauthorized/Home'))
    },
    '/playerTest': {
      component: dynamicWrapper(app, [], () => import('pages/VMS/player'))
    }
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority
    };
    routerData[path] = router;
  });
  return routerData;
};
