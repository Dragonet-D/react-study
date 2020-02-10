export default {
  menu: {
    security: {
      name: 'Security',
      children: {
        userManagement: 'User Management',
        userGroup: 'User Group',
        roleManagement: 'Role Management',
        syncUpVMSInformation: 'Sync Up VMS Information',
        syncUpADAccounts: 'Sync Up AD Accounts',
        apiKey: 'Api Key'
      }
    },
    alarm: {
      name: 'Alarm',
      children: {
        alarmRealtime: 'Real-time Alarm',
        alarmHistory: 'Alarm History',
        alarmConfiguration: 'Alarm Configuration',
        alarmSubscribe: 'Alarm Subscribe',
        eventQuery: 'Event Query'
      }
    },
    vade: {
      name: 'VADE',
      children: {
        task: 'Task',
        data: 'Data',
        program: 'Program',
        dataType: 'Data Type',
        taskType: 'Task Type',
        resourceMonitor: 'Resource Monitor'
      }
    },
    uvms: {
      name: 'UVMS',
      children: {
        videoDevice: 'Video Device',
        channel: 'Channel',
        channelGroup: 'Channel Group',
        firmware: 'Firmware',
        liveView: 'Live View',
        playback: 'Playback',
        recording: 'Recording',
        requestAccess: 'Request Access',
        approveAccess: 'Approve Access',
        iconSetUp: 'Icon Set Up'
      }
    },
    uvap: {
      name: 'UVAP',
      children: {
        face: {
          name: 'Face',
          children: {
            faceEnrollment: 'Face Enrollment',
            faceSearch: 'Face Search',
            faceCompare: 'Face Compare',
            specialWatchList: 'Special Watch List'
          }
        },
        files: 'Files',
        vaengines: 'VA Engines',
        vaInstance: {
          name: 'VA Instance',
          children: {
            jobVaInstance: 'Job VA Instance',
            liveVaInstance: 'Live VA Instance',
            serviceVaInstance: 'Service VA Instance'
          }
        },
        report: {
          name: 'Report',
          children: {
            reportSearch: 'Report Search',
            reportAggregate: 'Report Aggregate',
            trendAnalysis: 'Trend Analysis'
          }
        },
        license: {
          name: 'License'
        },
        postIncident: {
          name: 'Post Incident'
        }
      }
    },
    overview: {
      name: 'Overview'
    }
  }
};
