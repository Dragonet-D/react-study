import materialKeys from '../materialKeys';

const namespace = 'vms';

const vms = {
  'IVH-DEVICE-API': {
    Address: '/api',
    Path: '/ummi-device/vms/device/',
    URLS: {
      deviceModelList: {
        url: 'management/deviceModelList',
        materialKey: ''
      },
      deviceIconUpload: {
        url: 'deviceIcon/upload',
        materialKey: ''
      },
      deviceIconSave: {
        url: 'deviceIcon/save',
        materialKey: ''
      },
      deleteIcon: {
        url: 'deviceIcon/delete',
        materialKey: ''
      },
      model: {
        url: 'models',
        materialKey: materialKeys['M3-14']
      },
      devices: {
        url: 'devices',
        materialKey: materialKeys['M4-38']
      },
      videoDeviceList: {
        url: 'videoDeviceList',
        materialKey: materialKeys['M4-38']
      },
      addDevice: {
        url: 'devices',
        materialKey: materialKeys['M4-65']
      },
      updateDevice: {
        url: 'devices',
        materialKey: materialKeys['M4-66']
      },
      delDevice: {
        url: 'batchDelete',
        materialKey: materialKeys['M4-67']
      },
      deviceChannels: {
        url: 'devices/{device-id}/channels',
        materialKey: materialKeys['M4-39']
      },
      saveDevice: {
        url: 'save',
        materialKey: materialKeys['M4-69']
      },
      search: {
        url: 'search',
        materialKey: materialKeys['M4-38']
      },
      deleteDevice: {
        url: 'delete',
        materialKey: materialKeys['M4-67']
      },
      assignToGroup: {
        url: 'assignToGroup',
        materialKey: ''
      },
      getDeviceByGroupId: {
        url: 'getDeviceByGroupId',
        materialKey: ''
      },
      getChannelPTZstatus: {
        url: 'devices/{device-id}/channels/{channel-id}/ptz-statuses',
        materialKey: materialKeys['M3-14']
      },
      channelPTZpreset: {
        url: 'devices/{device-id}/channels/{channel-id}/ptz-presets',
        materialKey: materialKeys['M3-92']
      },
      controlPTZ: {
        url: 'devices/{device-id}/channels/{channel-id}/ptz-controls',
        materialKey: materialKeys['M3-91']
      },
      releasePTZcontrol: {
        url: 'devices/{device-id}/channels/{channel-id}/releaseControl',
        materialKey: materialKeys['M3-91']
      },
      getCameraInfo: {
        url: 'cameraUsage',
        materialKey: materialKeys['M1-11']
      },
      addMultipleDevice: {
        url: 'addMultipleDevice',
        materialKey: materialKeys['M5-6']
      },
      downloadTemplate: {
        url: 'multipleDeviceTemplate',
        materialKey: materialKeys['M5-5']
      },
      downloadFailedDevices: {
        url: 'multipleDeviceResult/{uuid}/download',
        materialKey: materialKeys['M1-11']
      },
      batchUploadTaskList: {
        url: 'uploadRecordList',
        materialKey: materialKeys['M5-4']
      }
    }
  },
  'IVH-CHANNEL-API': {
    Address: '/api',
    Path: '/ummi-device/vms/channel/',
    URLS: {
      assignChannelsIntoGroup: {
        url: 'assign/channels',
        materialKey: materialKeys['M4-60']
      },
      channels: {
        url: 'channels',
        materialKey: materialKeys['M4-44']
      },
      getChannelInfo: {
        url: 'getChannelInfoById',
        materialKey: ''
      },
      getChannelList: {
        url: 'channelList',
        materialKey: materialKeys['M4-44']
      },
      batchDeleteChannel: {
        url: 'batchDelete',
        materialKey: materialKeys['M4-117']
      },
      parentGroups: {
        url: 'parentGroups',
        materialKey: materialKeys['M3-14']
      },
      createGroup: {
        // url: 'createGroup',
        url: 'createGroupWithMapInfo',
        materialKey: materialKeys['M4-70']
      },
      updateGroup: {
        // url: 'updateGroup',
        url: 'updateChannelGroup',
        materialKey: materialKeys['M4-71']
      },
      createGroupMapping: {
        url: 'createGroupMapping',
        materialKey: materialKeys['M3-14']
      },
      updateGroupMapping: {
        url: 'updateGroupMappingWithMapInfo',
        materialKey: materialKeys['M4-45']
      },
      getGroups: {
        url: 'getGroups',
        materialKey: materialKeys['M3-14']
      },
      saveSchedule: {
        url: 'saveSchedule',
        materialKey: materialKeys['M5-1']
      }
    }
  },
  'IVH-CHANNEL-GROUP-API': {
    Address: '/api',
    Path: '/ummi-device/',
    URLS: {
      deleteChannelMapping: {
        url: 'channelgroup/deleteMapping',
        materialKey: materialKeys['M4-84']
      },
      channelgroup: {
        url: 'channelgroup/tree',
        materialKey: materialKeys['M3-20']
      },
      deleteChannelGroup: {
        url: 'vms/channel/delete/{channelGroupId}',
        materialKey: materialKeys['M4-85']
      },
      getChannelGroupTree: {
        // url: 'channelgroup/management/tree/{userId}',
        url: 'channelgroup/management/channelGroupTree/{userId}',
        materialKey: materialKeys['M4-44']
      },
      channelGroupTree: {
        url: 'channelgroup/management/treeList/{userId}',
        materialKey: materialKeys['M4-44']
      },
      getChannelByChannelGroupId: {
        url: 'channelgroup/channelList.gid',
        materialKey: materialKeys['M4-44']
      }
    }
  },
  IVH_ACCESS_AND_APPROVE_REQUEST: {
    Address: '/api',
    Path: '/ummi-device/',
    URLS: {
      access_AllRequests: {
        url: 'accessRequest/requests',
        materialKey: materialKeys['M3-39']
      },
      access_AllGroups: {
        url: 'accessRequest/groups',
        materialKey: materialKeys['M3-39']
      },
      getUserPermission: {
        url: 'accessRequest/getUserPermission',
        materialKey: materialKeys['M3-39']
      },
      access_approve_saveRequest: {
        url: 'accessRequest/saveRequest',
        materialKey: materialKeys['M4-122']
      },
      approve_AllRequest: {
        url: 'accessRequest/approve',
        materialKey: materialKeys['M3-40']
      },
      approveAccessList: {
        url: 'accessRequest/approveAccessList',
        materialKey: materialKeys['M3-40']
      },
      refreshRequestCount: {
        url: 'accessRequest/pendingRequest',
        materialKey: materialKeys['M3-39']
      },
      getRequestDetails: {
        url: 'accessRequest/viewRequestDetails',
        materialKey: materialKeys['M4-121']
      },
      updateAccessRequest: {
        url: 'accessRequest/updateRequest',
        materialKey: materialKeys['M4-123']
      }
    }
  },
  'IVH-RECORDING-API': {
    Address: '/api',
    Path: '/ummi-device/vms/',
    URLS: {
      getTaskList: {
        url: 'recording/taskList',
        materialKey: materialKeys['M4-75']
      },
      batchDelete: {
        url: 'recording/deleteRecording',
        materialKey: materialKeys['M4-86']
      },
      download: {
        url: 'recording/download',
        materialKey: materialKeys['M4-129']
      },
      uploadRecording: {
        url: 'recording/uploadRecording',
        materialKey: materialKeys['M4-76']
      },
      getChannelDetailList: {
        url: 'records',
        materialKey: materialKeys['M4-87']
      },
      getDownloadRecording: {
        url: 'recording/exportsRecording/findAll',
        materialKey: materialKeys['']
      },
      deleteDownloadRecording: {
        url: 'recording/exportsRecording/delete',
        materialKey: materialKeys['']
      },
      getSchedules: {
        url: 'ivh-schedule-by-user-group',
        materialKey: materialKeys['M3-35']
      },
      getExtraSchedules: {
        url: 'ivh-schedule/findById',
        materialKey: materialKeys['']
      },
      checkScheduleByName: {
        url: 'ivh-schedule/check-name',
        materialKey: materialKeys['M3-14']
      },
      records: {
        url: 'records',
        materialKey: materialKeys['M3-14']
      },
      saveChannel: {
        url: 'schedules/save',
        materialKey: materialKeys['M4-72']
      },
      updateSchedule: {
        url: 'schedules/update',
        materialKey: materialKeys['M3-14']
      },
      delSchedule: {
        url: 'schedules/delete',
        materialKey: materialKeys['M3-14']
      },
      getRecordRetentions: {
        url: 'record-retentions',
        materialKey: materialKeys['M3-14']
      },
      createRetention: {
        url: 'record-retentions/create',
        materialKey: materialKeys['M3-14']
      },
      updateRetention: {
        url: 'record-retentions/update',
        materialKey: materialKeys['M3-14']
      },
      delRetention: {
        url: 'record-retentions/delete',
        materialKey: materialKeys['M3-14']
      },
      startClipping: {
        url: 'clipping/start',
        materialKey: materialKeys['M3-14']
      },
      endClipping: {
        url: 'clipping/end',
        materialKey: materialKeys['M3-14']
      },
      exportChannelDetailRecording: {
        url: 'recording/downloadBlob/{id}/blob',
        materialKey: materialKeys['M4-88']
      },
      delRecordingSchedule: {
        url: 'schedules/delete',
        materialKey: materialKeys['M3-14']
      }
    }
  },
  'IVH-STREAM-API': {
    Address: '/api',
    Path: '/ummi-device/',
    URLS: {
      playback: {
        url: 'vms/sms/streams/playback',
        materialKey: materialKeys['M4-93']
      },
      getSnapshot: {
        url: 'vms/sms/streams/snapshot',
        materialKey: materialKeys['M1-2']
      },
      getLiveStream: {
        url: 'vms/sms/streams/live',
        materialKey: materialKeys['M3-19']
      },
      endStream: {
        url: 'vms/sms/streams',
        materialKey: materialKeys['M4-102']
      },
      batchEnd: {
        url: 'vms/sms/streams/batchEnd',
        materialKey: materialKeys['M4-102']
      },
      disconnectCamera: {
        url: 'vms/sms/disconnect',
        materialKey: materialKeys['M4-115']
      },
      saveBookmark: {
        url: 'vms/sms/bookmark/save',
        materialKey: materialKeys['M4-93']
      },
      getBookmark: {
        url: 'vms/sms/bookmarks',
        materialKey: materialKeys['M4-93']
      },
      initBookmark: {
        url: 'vms/sms/bookmark',
        materialKey: materialKeys['M4-93']
      },
      setDefault: {
        url: 'liveView/setDefault',
        materialKey: materialKeys['M3-93']
      },
      getDefault: {
        url: 'liveView/getDefault',
        materialKey: materialKeys['M3-93']
      },
      doClipping: {
        url: 'vms/recording/exportsRecording',
        materialKey: materialKeys['M4-97']
      },
      exportRecordingDownload: {
        url: 'vms/recording/exportsRecording',
        materialKey: materialKeys['M4-88']
      },
      exportClipping: {
        url: 'vms/recording/downloadBlob/{id}/blob',
        materialKey: materialKeys['M4-97']
      }
    }
  },
  'IVH-FIRMWARE-API': {
    Address: '/api',
    Path: '/ummi-device/vms/device/',
    URLS: {
      firmwares: {
        url: 'firmware/firmwareList_AllOrFilter',
        materialKey: materialKeys['M4-46']
      },
      uploadFirmware: {
        url: 'firmware/uploadFirmware',
        materialKey: materialKeys['M4-47']
      },
      deleteFirmware: {
        url: 'firmware/deleteFirmware',
        materialKey: materialKeys['M3-14']
      },
      updateFirmware: {
        url: 'firmware/updateFirmware',
        materialKey: materialKeys['M3-14']
      },
      getScheduleList: {
        url: 'firmware/getFirmwareUpgradeList',
        materialKey: materialKeys['M4-48']
      },
      createNewSchedule: {
        url: 'firmware/addSchedule',
        materialKey: materialKeys['M3-17']
      },
      deleteSchedule: {
        url: 'firmware/deleteUpgradeSchedule',
        materialKey: materialKeys['M3-17']
      },
      getUpgradeDeviceList: {
        url: 'firmware/getFirmwareUpgradeDeviceList',
        materialKey: materialKeys['M3-17']
      },
      updateFirmwareSchedule: {
        url: 'firmware/updateUpgrade',
        materialKey: materialKeys['M3-17']
      },
      getSelectedDeviceArray: {
        url: 'firmware/getSelectedDeviceArray',
        materialKey: materialKeys['M3-17']
      }
    }
  }
  // IVH_ICON_SET_UP: {
  //   Address: '/api',
  //   Path: '/ummi-device',
  //   URLS: {
  //     iconImg: {
  //       url: '',
  //       materialKey: materialKeys['']
  //     }
  //   }
  // }
};

export default { vms, namespace };
