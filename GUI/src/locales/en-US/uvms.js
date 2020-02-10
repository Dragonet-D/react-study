export default {
  uvms: {
    videoDevice: {
      deviceName: 'Device Name',
      uri: 'Device URl',
      deviceType: 'Type',
      model: 'Model',
      channelCount: 'Available Channels',
      vmsStatus: 'Status',
      userName: 'User Name',
      password: 'Password',
      deleteDeviceConfirm: 'You are trying to delete the selected device(s). please confirm.',
      deleteDevice: 'Delete Device'
    },
    channel: {
      channelName: 'Channel Name',
      parentDevice: 'Parent Device',
      uri: 'URI',
      groupName: 'Group Name',
      recordingSchedule: 'Recording Schedule',
      model: 'Model',
      status: 'Status',
      action: 'Action',
      confirmExecutingThisOperationtion: 'Confirm executing this operation ?',
      deleteChannelConfirm: 'You are trying to delete the selected channel(s). please confirm.',
      // removeChannelFromGroup: 'Remove Channel From Group',
      deleteSchedule: 'Delete Schedule',
      deleteChannel: 'Delete Channel',
      name: 'Name',
      sunday: 'Sunday',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      periodSelection: 'Period Selection',
      addStoragePlan: 'Add Storage Plan',
      updateSchedule: 'Update Schedule',
      storageInfo: ' Storage Info',
      basicInfo: 'Basic Info',
      channelDetails: 'Channel Details',
      deviceUri: 'Device URI',
      streamType: 'Stream Type',
      resolution: 'Resolution',
      channelType: 'Channel Type',
      description: 'Description',
      storagePlan: 'Storage Plan',
      installationInfo: ' Installation Info',
      videoFileStorageExpiredTime: 'Video File Storage Expired Time',
      days: 'Days',
      address: 'Address',
      location: 'Location(longitude-latitude)',
      fieldOfView: 'Field Of View',
      fieldOfCoverage: 'Field Of Coverage',
      direction: 'Direction',
      distance: 'Distance',
      install: 'Install'
    },
    button: {
      begin: 'Begin'
    },
    channelGroup: {
      treeBox: {
        headTitle: 'Channel Group Tree'
      },
      detailsBox: {
        nullPageTitle: 'Please Select The Channel Group',
        headTitle: 'Channel Group Details',
        name: 'Channel Group Name',
        namePlaceholder: 'Input Channel Group Name',
        nameErrorMsg: 'Please Input Channel Group Name',
        description: 'Channel Group Description',
        descriptionPlaceholder: 'Input Channel Group Description',
        descriptionErrorMsg: 'Please Input Channel Group Description',
        parentGroup: 'Parent Group',
        parentGroupPlaceholder: 'Select Parent Group',
        parentGroupErrorMsg: 'Please Select Parent Group',
        assignChannelTableTitle: 'Assign Channel List',
        createNewGroupTitle: 'Create New Group',
        updateGroupTitle: 'Update The Group',
        deleteGroup: 'Delete Group',
        buildingName: 'Building Name',
        buildingNamePlaceholder: 'Input Building Name',
        buildingNameErrorMsg: 'Please Input Building Name',
        address: 'Address',
        addressPlaceholder: 'Input Address',
        addressErrorMsg: 'Please Input Address',
        location: 'Location',
        locationPlaceholder: 'Input Location (Longitude-Latitude)',
        locationErrorMsg: 'Please Input Location (Longitude-Latitude)',
        distance: 'Distance',
        distancePlaceholder: 'Input Distance',
        distanceErrorMsg: 'Please Input Distance',
        fieldView: 'Field Of View',
        fieldViewPlaceholder: 'Input Field Of View',
        fieldViewErrorMsg: 'Please Input Field Of View',
        fieldCoverage: 'Field Of Coverage',
        fieldCoveragePlaceholder: 'Input Field Of Coverage',
        fieldCoverageErrorMsg: 'Please Input Field Of Coverage',
        openLocationMap: 'Open Location Map',
        assignLicense: 'Assign License',
        assignChannel: 'Assign Channel',
        table: {
          name: 'Channel Name',
          device: 'Parent Device',
          uri: 'URI',
          groupName: 'Group Name',
          schedule: 'Recording Schedule',
          model: 'Model',
          status: 'Network Status'
        },
        headerAction: {
          assign: 'Assign To Group'
        }
      },
      confirm: {
        deleteTitle: 'Delete Channel Group',
        deleteMsg: 'You are trying to delete the channel group, please confirm.'
      }
    },
    approve: {
      confirmtoApproveRequest: 'Confirm To Approve Request?',
      confirmToRejectRequest: 'Confirm To Reject Request?',
      confirmToRevokeRequest: 'Confirm To Revoke Request?',
      approveRequest: 'Approve Request',
      rejectRequest: 'Reject Request',
      revokeRequest: 'Revoke Request'
    },
    live: {
      button: {
        save: 'Save',
        cancel: 'Cancel',
        filter: 'Filter',
        confirm: 'Confirm'
      },
      presetConfirm: {
        title: 'Confrim set configration of',
        presetName: 'Presets Name',
        helperText: 'Change presets Name'
      },
      preset: {
        presetName: 'Name',
        operation: 'Operation',
        placeholder: 'Name'
      }
    },
    requestAccess: {
      button: {
        save: 'Save',
        cancel: 'Cancel',
        filter: 'Filter',
        confirm: 'Confirm'
      },
      addRequest: {
        title: 'Request Access'
      },
      createDialog: {
        titleRA: 'Request Access',
        titleUR: 'Update Request',
        requestReason: 'Request Reason',
        requestPermission: 'Request Permission',
        currentGroup: 'Current Group:',
        error: 'Error',
        requestArea: 'Request Area',
        reuqestForm: 'Request Form',
        groupName: 'Group Name',
        description: 'Description'
      },
      page: {
        requestNo: 'Request ID',
        groupName: 'Group Name',
        requestByName: 'Request By',
        submittedDate: 'Request Date',
        requestReason: 'Request Reason',
        requestStatusDesc: 'Request Status'
      }
    },
    playback: {
      drawerRender: {
        bookmarkComments: 'Bookmark Name',
        bookmarkTimestamp: 'Bookmark Time',
        operation: 'Operation',
        title: 'Bookmark List',
        placeholder: 'Name',
        deleteBookMark: 'Delete Bookmark',
        bookmarkSeek: 'Seek Bookmark'
      },
      recordingRender: {
        startTime: 'Start Time',
        endTime: 'End Time',
        title: 'Recording in'
      }
    },
    recording: {
      button: {
        save: 'Save',
        cancel: 'Cancel',
        filter: 'Filter',
        confirm: 'Confirm',
        back: 'Back'
      },
      fileUpload: {
        upload: 'Upload',
        fileType: 'File Type',
        chooseFile: 'Choose File',
        uploadTime: 'Upload Time',
        expireDay: 'Video File Storage Expired Time(Days)'
      },
      recordingHeader: {
        viewUploadTask: 'View Upload Tasks',
        download: 'Download'
      },
      downloadData: {
        startTime: 'Start Time',
        endTime: 'End Time',
        parentDevice: 'Parent Device',
        channelName: 'Channel Name',
        groupName: 'Group',
        progress: 'Progress',
        title: 'Downloaded Data'
      },
      channelDetail: {
        channelInfo: 'Channel Info',
        startTime: 'Start Time',
        endTime: 'End Time',
        channelName: 'Channel Name',
        parentDevice: 'Parent Device',
        groupName: 'Group',
        recordingInfo: 'Recording Info',
        downloadAll: 'Download All'
      },
      viewTask: {
        fileName: 'File Name',
        channelName: 'Channel Name',
        parentDevice: 'Parent Device',
        groupName: 'Group',
        length: 'Task Details',
        status: 'Status',
        title: 'View Upload Tasks',
        startTime: 'Start Time',
        endTime: 'End Time'
      }
    },
    deleteHeader: {
      selected: 'selected'
    },
    firmware: {
      button: {
        save: 'Save',
        cancel: 'Cancel',
        filter: 'Filter',
        confirm: 'Confirm'
      },
      deleteFirmwareConfirm: 'You are trying to delete the selected firmware(s). please confirm.',
      deleteFirmware: 'Delete Firmware',
      firmwareUpgrade: {
        title: ' Device Listings',
        deviceName: 'Device Name',
        deviceType: 'Device Type',
        deviceModel: 'Device Model',
        uri: 'IP',
        model: 'Model',
        firmwareName: 'Frimware Name',
        firmwareVersion: 'Firmware Version',
        lastUpdatedBy: 'Last Updated By',
        lastUpdatedDate: 'Last Updated Date',
        status: 'Status',
        uploadTime: 'Upload Time'
      },
      firmwareUpload: {
        title: 'View Upgrade Task',
        deviceName: 'Device Name',
        firmwareName: 'Frimware Name',
        dueTime: 'Upgraded Date',
        progress: 'Progress',
        status: 'Status',
        deleteTask: 'Delete Task',
        startTime: 'Start Time',
        endTime: 'End Time'
      }
    },
    iconSetUp: {
      channelType: 'Channel Type',
      icon: 'Icon'
    }
  }
};
