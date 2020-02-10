export default {
  security: {
    userManagement: {
      userTable: {
        access: 'Access',
        action: 'Action',
        userId: 'User ID',
        fullName: 'Full Name',
        email: 'Email'
      },
      roleTable: {
        option: 'Option',
        name: 'Name',
        description: 'Description'
      },
      tableButton: {
        updateUser: 'Update',
        deleteUser: 'Delete',
        createUser: 'Create',
        assignRole: 'Role'
      },
      dialogButton: {
        save: 'Save',
        cancel: 'Cancel'
      },
      dialogMessage: {
        deleteMessage: 'You are trying to delete the selected user, please confirm.'
      },
      toolTips: {
        delete: 'Batch Delete',
        create: 'Create User'
      },
      title: {
        createUser: 'Create User',
        updateUser: 'Update User',
        userDetail: 'User Detail',
        assignRole: 'Assign Role',
        deleteUser: 'Delete User'
      },
      label: {
        userId: 'User ID*',
        fullName: 'Full Name*',
        email: 'Email*',
        phone: 'Phone*',
        adUser: 'AD User',
        createdBy: 'Created By',
        createdDate: 'Created Date',
        lastUpdatedBy: 'Last Updated By',
        lastUpdatedDate: 'Last Updated Date'
      }
    },
    userGroup: {
      pagination: {
        previousPage: 'Previous Page',
        nextPage: 'Next Page'
      },
      content: {
        pleaseSelectUserGroup: 'Please Select User Group',
        selected: 'selected',
        deteteGroup: 'You are trying to delete the user group, please confirm.',
        noParent: '--No Parent--',
        notAllowed: '--Not Allowed--'
      },
      label: {
        groupName: 'User Group Name*',
        groupDescription: 'User Group Description*',
        parentGroup: 'Parent Group*',
        domainName: 'Domain Name'
      },
      tabs: {
        assignUser: 'Assign Users',
        assignChannels: 'Assign Channels',
        assignVA: 'Assign VA Engines'
      },
      button: {
        filter: 'Filter',
        save: 'Save',
        cancel: 'Cancel',
        update: 'Update'
      },
      userTable: {
        userId: 'User ID',
        fullName: 'Full Name',
        email: 'Email',
        phone: 'Phone'
      },
      channelTable: {
        channelName: 'Channel Name',
        parentDevice: 'Parent Device',
        uri: 'URI',
        recordingSchedule: 'Recording Schedule',
        model: 'Model',
        networkStatus: 'Network Status'
      },
      enginesTable: {
        displayName: 'DisplayName',
        vaLabel: 'VA Label',
        vaProviderName: 'VA Provider Name',
        vaAppStatus: 'VA App Status',
        vaVersion: 'VA Version',
        operation: 'Operation'
      },
      placeholder: {
        userSearch: 'User ID / Full Name',
        channelSearch: 'Channel Name/Parent Device',
        enginesSearch: 'Engine Name',
        treeSearch: 'Group Name'
      },
      tooltips: {
        addGroup: 'Add User Group',
        deleteGroup: 'Delete User Group'
      },
      title: {
        deleteGroup: 'Delete User Group'
      }
    },
    roleManagement: {
      content: {
        selected: 'selected'
      },
      label: {
        name: 'Name*',
        description: 'Description*'
      },
      button: {
        feature: 'Feature',
        update: 'Update',
        delete: 'Delete',
        save: 'Save',
        cancel: 'Cancel',
        filter: 'Filter',
        assign: 'Assign'
      },
      roleTable: {
        name: 'Name',
        description: 'Description',
        access: 'Access',
        operation: 'Operation'
      },
      featureTable: {
        featureName: 'Feature Name',
        description: 'Description'
      },
      placeholder: {
        roleName: 'Name',
        roleDescription: 'Description',
        searchFeature: 'Name / Description'
      },
      tooltips: {
        addRole: 'Add Role',
        deleteRole: 'Delete Role'
      },
      title: {
        createRole: 'Add Role',
        deleteRole: 'Delete Role',
        updateRole: 'Update Role',
        assignFeature: 'Assign Feature',
        roleDetails: 'Role Details'
      }
    },
    apiKey: {
      createdBy: 'Created By',
      sysUser: 'Sys User',
      apiKey: 'Api Key',
      validTime: 'Valid Time(month)',
      expireDate: 'Expire Date',
      startDate: 'Start Date',
      targetSystem: 'Target System',
      deleteApiKey: 'Delete Api Key',
      deleteConfirm: 'You are trying to delete the api key. please confirm.',
      updateApiKey: 'Update Api Key',
      createApiKey: 'Create Api Key',
      createdId: 'Created Id',
      userEmail: 'User Email',
      userFullName: 'User FullName',
      userId: 'User Id',
      userPhone: 'User Phone',
      assignRole: 'Assign Role',
      assignGroup: 'Assign Group',
      featureList: 'Feature List',
      level: 'Level',
      resourceId: 'Resource Id',
      currentGroup: 'Current Group',
      generateApiKey: 'Generate Api Key'
    }
  }
};
