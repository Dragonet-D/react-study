import materialKeys from '../materialKeys';

const namespace = 'overview';
const overview = {
  'IVH-OVERVIEW-VAP-API': {
    Address: '/api',
    Path: '/ummi-vap/',
    URLS: {
      instanceOverview: {
        url: '/vap-overview/instanceOverview',
        materialKey: materialKeys['']
      },
      instanceOverviewList: {
        url: '/vap-overview/instanceOverviewList'
      },
      licenseOverview: {
        url: '/vap-overview/licenseOverview',
        materialKey: materialKeys['']
      },
      licenseOverviewList: {
        url: '/vap-license/licenses',
        materialKey: materialKeys['M4-159']
      },
      usageOverview: {
        url: '/vap-overview/usageOverview',
        materialKey: materialKeys['']
      },
      usageOverviewList: {
        url: '/vap-overview/usageOverviewList',
        materialKey: materialKeys['']
      },
      distribution: {
        url: '/vap-overview/distribution',
        materialKey: materialKeys['']
      },
      saveDistribution: {
        url: '/vap-overview/saveDistribution',
        materialKey: materialKeys['']
      }
    }
  },
  'IVH-OVERVIEW-UMMI-API': {
    Address: '/api',
    Path: '/ummi-admin/',
    URLS: {
      getOverviewSummary: {
        url: 'overview/summary',
        materialKey: materialKeys['M1-11']
      },
      getUserInfo: {
        url: 'overview/findUserStatusAndFilter',
        materialKey: materialKeys['M1-11']
      },
      getSystemStatus: {
        url: 'overview/monitor',
        materialKey: materialKeys['M1-11']
      },
      disconnectUser: {
        url: 'admin/disconnect',
        materialKey: materialKeys['M4-113']
      }
    }
  },
  'IVH-OVERVIEW-DEVICE-API': {
    Address: '/api',
    Path: '/ummi-device/',
    URLS: {
      disconnectCamera: {
        url: 'vms/sms/disconnect',
        materialKey: materialKeys['M4-115']
      }
    }
  }
};
export default { overview, namespace };
