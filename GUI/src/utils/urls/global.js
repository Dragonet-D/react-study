import materialKeys from '../materialKeys';

const namespace = 'global';
const global = {
  'IVH-PASSWORD-API': {
    Address: '/api',
    Path: '/ummi-admin/',
    URLS: {
      userPwdUpdate: {
        url: 'usermanagement/updateUserPassword',
        materialKey: materialKeys['M3-5']
      },
      userOldPwdCheck: {
        url: 'usermanagement/checkPassword',
        materialKey: materialKeys['M3-5']
      },
      getPwdPolicy: {
        url: 'usermanagement/findByPwdPolicy',
        materialKey: materialKeys['M3-5']
      },
      forgetPssword: {
        url: 'admin/forgetPassword',
        materialKey: ''
      }
    }
  },
  'IVH-SYSTEM-API': {
    Address: '/api',
    Path: '/ummi-admin/',
    URLS: {
      logout: {
        url: 'admin/loginOut',
        materialKey: ''
      },
      login: {
        url: 'admin/login',
        materialKey: ''
      },
      adlogin: {
        url: 'admin/adLogin',
        materialKey: ''
      },
      pwdReset: {
        url: 'admin/restpassword',
        materialKey: ''
      },
      updateSession: {
        url: 'admin/token/refresh',
        materialKey: ''
      },
      adfsLogin: {
        url: '/admin/adfsLogin',
        materialKey: materialKeys['M3-5']
      },
      getIdpLogoutParameter: {
        url: '/admin/idpLogout',
        materialKey: materialKeys['M3-5']
      }
    }
  },
  'IVH-CODE-CATEGORY': {
    Address: '/api',
    Path: '/ummi-admin/',
    URLS: {
      codeCategory: {
        url: 'code/getCodeByCodeCategory',
        materialKey: ''
      }
    }
  },
  'IVH-ADFS-LOGIN-API': {
    Address: '/api',
    Path: '/gateway',
    URLS: {
      getIdpParameter: {
        url: '/idpInitParameter',
        materialKey: materialKeys['M3-5']
      }
    }
  },
  'IVH-ADFS-API': {
    Address: '/api',
    Path: '/ummi-security/',
    URLS: {
      initIdpData: {
        url: 'saml/discovery',
        materialKey: materialKeys['M3-5']
      }
    }
  }
};
export default { global, namespace };
