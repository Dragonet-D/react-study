import materialKeys from '../materialKeys';

const namespace = 'security';
const security = {
  'IVH-SECURITY-APIKEY-API': {
    Address: '/api',
    Path: '/ummi-apicheck/apikey',
    URLS: {
      apikeyList: {
        url: 'apikeyList',
        materialKey: materialKeys['']
      },
      createApikey: {
        url: 'createApikey',
        materialKey: materialKeys['']
      },
      delete: {
        url: 'delete',
        materialKey: materialKeys['']
      },
      getApikey: {
        url: 'getApikey',
        materialKey: materialKeys['']
      },
      isPostpone: {
        url: 'isPostpone',
        materialKey: materialKeys['']
      },
      generateApiKey: {
        url: 'generate',
        materialKey: materialKeys['']
      }
    }
  },
  'IVH-SECURITY-PERMISSON-API': {
    Address: '/api',
    Path: '/ummi-apicheck/',
    URLS: {
      assignRole: {
        url: 'permission/binding/role',
        materialKey: materialKeys['']
      },
      assignGroup: {
        url: 'permission/binding/group',
        materialKey: materialKeys['']
      },
      vapRoleList: {
        url: 'permission/uvap/roleList',
        materialKey: materialKeys['']
      }
    }
  }
};
export default { security, namespace };
