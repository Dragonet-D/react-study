import materialKeys from '../materialKeys';

const namespace = 'user';

const user = {
  'IVH-GROUP-API': {
    Address: '/api',
    Path: '/ummi-admin/',
    URLS: {
      pwdConfigTest: {
        url: 'usermanagement/updatePwdPolicy',
        materialKey: materialKeys['M4-18']
      },
      findStatus: {
        url: 'usermanagement/findByPwdPolicy',
        materialKey: materialKeys['M4-17']
      },
      userGroupSave: {
        url: 'userGroup/save',
        materialKey: materialKeys['M4-5']
      },
      searchUserGroup: {
        url: 'userGroup/page',
        materialKey: materialKeys['M4-4']
      },
      userGroupList: {
        url: 'userGroup/list',
        materialKey: materialKeys['M3-41']
      },
      saveUserGroup: {
        url: 'userGroup/assign/user',
        materialKey: materialKeys['M4-59']
      },
      getUsersByGroupId: {
        url: 'userGroup/users',
        materialKey: materialKeys['M3-41']
      },
      getDevicesByGroupId: {
        url: 'userGroup/devices',
        materialKey: materialKeys['M3-41']
      },
      saveDeviceToGroup: {
        url: 'userGroup/assign/device',
        materialKey: materialKeys['M3-41']
      },
      findUserGroupById: {
        url: 'userGroup/getUserGroupInfo',
        materialKey: materialKeys['M4-8']
      },
      userGroupDelete: {
        url: 'userGroup/delete',
        materialKey: materialKeys['M4-7']
      },
      batchDeleteUserGroup: {
        url: 'userGroup/batch_delete',
        materialKey: materialKeys['M4-7']
      },
      newListGroup: {
        url: 'userGroup/listGroup',
        materialKey: materialKeys['M3-41']
      },
      newListGroupNoRecording: {
        url: 'userGroup/initialListGroup',
        materialKey: materialKeys['M3-41']
      },
      userGroupTree: {
        url: 'userGroup/tree',
        materialKey: materialKeys['M3-41']
      },
      searchUserGroupTree: {
        url: 'userGroup/tree',
        materialKey: materialKeys['M4-8']
      },
      userGroupUserList: {
        url: '/usermanagement/userList.gid',
        materialKey: materialKeys['M4-4']
      },
      groupListForAddrole: {
        url: 'userGroup/groupListForAddrole',
        materialKey: materialKeys['M3-41']
      },
      getDomainList: {
        url: 'userGroup/getDomain',
        materialKey: materialKeys['M3-41']
      },
      saveGroupWDomain: {
        url: 'userGroup/saveGroupWDomain',
        materialKey: materialKeys['M3-41']
      }
    }
  },
  'IVH-USER-MANAGEMENT-API': {
    Address: '/api',
    Path: '/ummi-admin/',
    URLS: {
      userList: {
        url: 'usermanagement/list',
        materialKey: materialKeys['M4-4']
      },
      userAdd: {
        url: 'usermanagement/addOrUpdate',
        materialKey: materialKeys['M4-1']
      },
      userUpdate: {
        url: 'usermanagement/addOrUpdate',
        materialKey: materialKeys['M4-2']
      },
      userDelete: {
        url: 'usermanagement/delete',
        materialKey: materialKeys['M4-3']
      },
      getUserRoles: {
        url: 'userRole/rolelist',
        materialKey: materialKeys['M3-1']
      },
      saveUserRoles: {
        url: 'userAndRole/addOrUpdate',
        materialKey: materialKeys['M4-56']
      },
      userDevices: {
        url: 'userAndDevice/getDeviceListByUserId',
        materialKey: materialKeys['M3-1']
      },
      saveUserDevices: {
        url: '/userAndDevice/addOrUpdate',
        materialKey: materialKeys['M3-1']
      },
      searchDevices: {
        url: 'search/device',
        materialKey: materialKeys['M3-1']
      },
      searchableUserList: {
        url: 'usermanagement/userList',
        materialKey: materialKeys['M4-4']
      }
    }
  },
  'IVH-ROLE-MANAGEMENT-API': {
    Address: '/api',
    Path: '/ummi-admin/',
    URLS: {
      roleList: {
        url: 'userRole/roleList',
        materialKey: materialKeys['M3-3']
      },
      addRole: {
        url: 'userRole/addRole',
        materialKey: materialKeys['M4-9']
      },
      searchRoleName: {
        url: 'userRole/searchRoleName',
        materialKey: materialKeys['M4-12']
      },
      searchRoleNameNew: {
        url: 'userRole/rolelist',
        materialKey: materialKeys['M4-12']
      },
      upDateRole: {
        url: 'userRole/updateRole',
        materialKey: materialKeys['M4-10']
      },
      deleteRole: {
        url: 'userRole/deleteRole',
        materialKey: materialKeys['M4-11']
      },
      deleteRoles: {
        url: 'userRole/deleteRoles',
        materialKey: materialKeys['M4-11']
      },

      rolefeaturelist: {
        url: 'feature/featureAndRole',
        materialKey: materialKeys['M4-57']
      },
      paramfeaturelist: {
        url: 'feature/featureAndParam',
        materialKey: materialKeys['M3-3']
      },
      saveFeature: {
        url: 'feature/featureAndRole/saveOrUpdateFeature',
        materialKey: materialKeys['M4-57']
      },
      saveFeatureFunc: {
        url: 'feature/featureAndFuntion/saveOrUpdateFunction',
        materialKey: materialKeys['M4-13']
      },
      filterByFeatureName: {
        url: 'feature/searchFeatureByName',
        materialKey: materialKeys['M4-16']
      }
    }
  },
  'IVH-SYNC-UP-AD-API': {
    Address: '/api',
    Path: '/ummi-admin/',
    URLS: {
      getUserDomainInfo: {
        url: 'security/syncup',
        materialKey: materialKeys['M3-42']
      },
      syncUpDomain: {
        url: 'security/syncdown',
        materialKey: materialKeys['M3-42']
      }
    }
  },
  'IVH-SYNC-UP-VMS-API': {
    Address: '/api',
    Path: '/ummi-device/vms/',
    URLS: {
      syncUpDevices: {
        url: 'syncUpDevices',
        materialKey: materialKeys['M4-125']
      },
      syncUpChannels: {
        url: 'syncUpChannels',
        materialKey: materialKeys['M4-126']
      }
    }
  },
  'IVH-USER-PROFILE-API': {
    Address: '/api',
    Path: '/ummi-admin/',
    URLS: {
      getUserInfoByUserId: {
        url: 'usermanagement/findOneByUserId',
        materialKey: materialKeys['M3-5']
      }
    }
  }
};

export default { user, namespace };
