import materialKeys from '../materialKeys';

const namespace = 'vap';
const vap = {
  'IVH-V.A.P-FRS-API': {
    Address: '/api',
    Path: '/ummi-vap/vap-product-frs/',
    URLS: {
      vapFrsGetGroups: {
        url: 'groups'
      },
      vapGetGroupsByappId: {
        url: 'groupsByappId'
      },
      vapFrsAddGroups: {
        url: 'groups'
      },
      vapFrsUpdateGroups: {
        url: 'groups'
      },
      vapFrsDeleteGroup: {
        url: 'groups'
      },
      vapFrsAddPerson: {
        url: 'persons'
      },
      vapFrsDeletePerson: {
        url: 'persons'
      },
      vapFrsGetPersons: {
        url: 'persons'
      },
      vapFrsGetPersonImages: {
        url: 'persons/{id}/images'
      },
      vapFrsUpdatePersonImages: {
        url: 'persons/{id}/images'
      },
      vapFrsDeletePersonImage: {
        url: 'persons/{id}/images/{imageId}'
      },
      vapFrsUpdatePersonAssignedGroup: {
        url: 'persons/{id}/groups'
      },
      vapFrsUpdatePerson: {
        url: 'persons'
      },
      vapFrsFaceSearch: {
        url: 'faces/search'
      },
      vapFrsFaceCompare: {
        url: 'compare/one_to_one'
      },
      vapFrsPersonEnrollments: {
        url: 'persons/{id}/images/{imageId}/enrollments'
      },
      vapFrsDownloadMultipleFRSTemplate: {
        url: 'downloadMultipleFRSTemplate'
      },
      vapFrsAddPersonsFileOfZip: {
        url: 'addPersonsFileOfZip'
      },
      vapFrsUploadRecordList: {
        url: 'uploadRecordList'
      }
    }
  },
  'IVH-V.A.P-EVENTS-API': {
    Address: '/api',
    Path: '/ummi-vap/vap-event/',
    URLS: {
      vapFrsEventsSearch: {
        url: 'reports/search'
      },
      vapFrsExportSearchData: {
        url: 'reports/search/export'
      }
    }
  },
  'IVH-V.A.P-APP-API': {
    Address: '/api',
    Path: '/ummi-vap/vap-analytics/',
    URLS: {
      enginesList: {
        url: 'vaEngineList',
        materialKey: materialKeys['M3-10']
      },
      enginesListNoPage: {
        url: 'appList',
        materialKey: materialKeys['M3-10']
      },
      appList: {
        url: 'apps',
        materialKey: materialKeys['M3-10']
      },
      allAppList: {
        url: 'appList',
        materialKey: materialKeys['M4-35']
      },
      getAppById: {
        url: 'apps',
        materialKey: materialKeys['M3-10']
      },
      updateAppInfo: {
        url: 'apps/{id}/info',
        materialKey: materialKeys['M4-156']
      },
      queryInstallerFiles: {
        url: 'installerfiles',
        materialKey: materialKeys['M3-10']
      },
      installNewApp: {
        url: 'apps/install',
        materialKey: materialKeys['M4-155']
      },
      getGatewayList: {
        url: 'vagateways',
        materialKey: materialKeys['M3-10']
      },
      getLabelList: {
        url: 'labels',
        materialKey: materialKeys['M3-10']
      },
      addLabels: {
        url: 'labels',
        materialKey: materialKeys['M3-10']
      },
      changeAction: {
        url: 'apps/{id}/activation',
        materialKey: materialKeys['M3-10']
      },
      deleteOneApp: {
        url: 'apps/{id}/uninstall',
        materialKey: materialKeys['M4-157']
      },
      downloadInstallerFiles: {
        url: 'installerfiles/{id}/download',
        materialKey: materialKeys['M3-10']
      },
      deleteInstallerFiles: {
        url: 'installerfiles/{id}',
        materialKey: materialKeys['M3-10']
      },
      updateLabels: {
        url: 'labels/{name}',
        materialKey: materialKeys['M3-10']
      },
      deleteLabels: {
        url: 'labels/{name}',
        materialKey: materialKeys['M3-10']
      },
      upgradeApp: {
        url: 'apps/{id}/update',
        materialKey: materialKeys['M4-154']
      },
      assignEngineToGroup: {
        url: 'assign/apps',
        materialKey: materialKeys['M3-10']
      }
    }
  },
  'IVH-V.A.P-LIVE-VA-INSTANCE-API': {
    Address: '/api',
    Path: '/ummi-vap/vap-instances/',
    URLS: {
      getLiveVAIstanceList: {
        url: 'getlivevainstances',
        materialKey: 'M3-10'
      },
      createLiveVAInstance: {
        url: 'livevainstances',
        materialKey: 'M3-10'
      },
      updateLiveVAInstance: {
        url: 'livevainstances',
        materialKey: 'M3-10'
      },
      deleteLiveVAinstance: {
        url: 'livevainstances',
        materialKey: 'M3-10'
      },
      activationOfLiveVAInstance: {
        url: 'livevainstances/{id}/activation',
        materialKey: 'M3-10'
      },
      restartLiveVAInstance: {
        url: 'livevainstances/{id}/restart',
        materialKey: 'M3-10'
      },
      getLiveInstanceDetails: {
        url: 'livevainstances/{id}',
        materialKey: 'M3-10'
      }
    }
  },
  'IVH-V.A.P-GATEWAYS-API': {
    Address: '/api',
    Path: '/ummi-vap/vap-analytics/',
    URLS: {
      getVAGateways: {
        url: 'vagateways',
        materialKey: 'M3-10'
      }
    }
  },
  'IVH-V.A.P-JOB-VA-API': {
    Address: '/api',
    Path: '/ummi-vap/vap-instances/',
    URLS: {
      getJobVAInstancesList: {
        url: 'getjobvainstances',
        materialKey: 'M3-10'
      },
      createJobVAInstance: {
        url: 'jobvainstances',
        materialKey: 'M3-10'
      },
      updateJobVAInstance: {
        url: 'jobvainstances',
        materialKey: 'M3-10'
      },
      deleteJobVAinstance: {
        url: 'jobvainstances',
        materialKey: 'M3-10'
      },
      startJobVAInstance: {
        url: 'jobvainstances/{id}/start',
        materialKey: 'M3-10'
      },
      stopJobVAInstance: {
        url: 'jobvainstances/{id}/stop',
        materialKey: 'M3-10'
      },
      getJobInstanceDetails: {
        url: 'jobvainstances/{id}',
        materialKey: 'M3-10'
      }
    }
  },
  'IVH-V.A.P-SERVICE-VA-API': {
    Address: '/api',
    Path: '/ummi-vap/vap-instances/',
    URLS: {
      getServiceVAInstancesList: {
        url: 'getservicevainstances',
        materialKey: 'M3-10'
      },
      createServiceVAInstance: {
        url: 'servicevainstances',
        materialKey: 'M3-10'
      },
      updateServiceVAInstance: {
        url: 'servicevainstances',
        materialKey: 'M3-10'
      },
      deleteServiceVAinstance: {
        url: 'servicevainstances',
        materialKey: 'M3-10'
      },
      activationOfServiceVAInstance: {
        url: 'servicevainstances/{id}/activation',
        materialKey: 'M3-10'
      },
      restartServiceVAInstance: {
        url: 'servicevainstances/{id}/restart',
        materialKey: 'M3-10'
      },
      getServiceInstanceDetails: {
        url: 'servicevainstances/{id}',
        materialKey: 'M3-10'
      }
    }
  },
  'IVH-V.A.P-STORAGE-DOWNLOAD-API': {
    Address: '',
    Path: '/vap-storage/',
    URLS: {
      downloadUserUploadFiles: {
        url: 'files/user_upload/{id}/blob',
        materialKey: materialKeys['M4-150']
      }
    }
  },
  'IVH-V.A.P-STORAGE-API': {
    Address: '/api',
    Path: '/ummi-vap/vap-storage/',
    URLS: {
      getUserUploadFiles: {
        url: 'files/user_upload',
        materialKey: materialKeys['M4-152']
      },
      deleteUserUploadFiles: {
        url: 'files/user_upload',
        materialKey: materialKeys['M4-151']
      },
      // downloadUserUploadFiles: {
      //   url: 'files/user_upload/{id}/blob',
      //   materialKey: materialKeys['M4-150']
      // },
      createUserUploadFiles: {
        url: 'files/user_upload',
        materialKey: 'M3-10'
      },
      updateUserUploadFiles: {
        url: 'files/user_upload',
        materialKey: materialKeys['M4-34']
      },
      getFileDetails: {
        url: 'files/user_upload/{id}',
        materialKey: 'M3-10'
      },
      getFileBinaryBob: {
        url: 'files/event_binary/{id}/blob',
        materialKey: 'M3-10'
      },
      getFileBinary: {
        url: 'files/event_binary/{id}',
        materialKey: 'M3-10'
      },
      vaFilesUploadFileBlock: {
        url: 'files/uploadBlock',
        materialKey: 'M3-10'
      }
    }
  },
  'IVH-V.A.P-LICENSES-API': {
    Address: '/api',
    Path: '/ummi-vap/vap-analytics/',
    URLS: {
      getLicensesByAppId: {
        url: 'apps/{id}/licenses',
        materialKey: 'M3-10'
      },
      addNewLicense: {
        url: 'apps/{id}/licenses',
        materialKey: 'M3-10'
      },
      updateLicense: {
        url: 'apps/{id}/licenses/{license-id}',
        materialKey: 'M3-10'
      },
      deleteLicense: {
        url: 'apps/{id}/licenses/{license-id}',
        materialKey: 'M3-10'
      },
      activateLicense: {
        url: 'apps/{id}/licenses/{license-id}/activation',
        materialKey: 'M3-10'
      },
      getLicenseKey: {
        url: 'apps/{id}/licenses/{license-id}/getkey',
        materialKey: 'M3-10'
      },
      downloadLicenseKey: {
        url: 'apps/{id}/licenses/{license-id}/downloadkey',
        materialKey: 'M3-10'
      }
    }
  },
  'IVH-V.A.P-NEW-LICENSES-API': {
    Address: '/api',
    Path: '/ummi-vap/vap-license/',
    URLS: {
      uploadLicense: {
        url: 'app-licenses',
        materialKey: 'M3-10'
      }
    }
  },
  'IVH-V.A.P-INCIDENT-API': {
    Address: '/api',
    Path: '/ummi-vap/vap-incident/',
    URLS: {
      getIncidentList: {
        url: 'searchIncident',
        materialKey: 'M3-10'
      },
      addIncident: {
        url: 'addIncident',
        materialKey: materialKeys['M4-160']
      },
      deleteIncident: {
        url: 'deleteIncident',
        materialKey: 'M3-10'
      },
      bindToJobvainstances: {
        url: 'bindToJobvainstances/{incidentId}',
        materialKey: 'M3-10'
      },
      bindToLivevainstances: {
        url: 'bindToLivevainstances/{incidentId}',
        materialKey: 'M3-10'
      },
      bindToServicevainstances: {
        url: 'bindToServicevainstances/{incidentId}',
        materialKey: 'M3-10'
      },
      findInstancesByIncidentId: {
        url: 'findInstancesByIncidentId',
        materialKey: 'M3-10'
      },
      updateIncident: {
        url: 'updateIncident',
        materialKey: 'M3-10'
      },
      closeIncident: {
        url: 'closeIncident',
        materialKey: 'M3-10'
      }
    }
  },
  'IVH-V.A.P-EVENT-API': {
    Address: '/api',
    Path: '/ummi-vap/vap-event/',
    URLS: {
      getEventHandlers: {
        url: 'handlers',
        materialKey: 'M3-10'
      },
      getSearchReports: {
        url: 'reports/search',
        materialKey: 'M3-10'
      },
      getGenerateCrowdChart: {
        url: 'reports/generateCrowdChart',
        materialKey: 'M3-10'
      },
      deleteReports: {
        url: 'reports',
        materialKey: 'M3-10'
      },
      getAggregateReports: {
        url: 'reports/aggregate',
        materialKey: 'M3-10'
      }
    }
  },
  'IVH-VAP-UPLOAD-FILE-API': {
    Address: '/api',
    Path: '/ummi-vap/vap-analytics/apps/install/',
    URLS: {
      vaEngineUploadFileBlock: {
        url: 'uploadFileBlock',
        materialKey: ''
      }
    }
  },
  'IVH-VAP-UPGRADE-FILE-API': {
    Address: '/api',
    Path: '/ummi-vap/vap-analytics/apps/upgrade/',
    URLS: {
      vaEngineUpgradeFileBlock: {
        url: 'uploadFileBlock',
        materialKey: ''
      }
    }
  }
};

export default { vap, namespace };
