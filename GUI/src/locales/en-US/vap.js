export default {
  vap: {
    event: {
      abandoned: 'Abandoned Object',
      anpr: {
        vehicle: 'ANPR Vehicle',
        group: 'ANPR Group'
      },
      frs: {
        group: 'FRS Group',
        person: 'FRS Person'
      },
      crowd: 'Crowd Counting',
      loitering: 'Loitering Detection',
      peoplecount: 'People Counting'
    },
    toolbar: {
      report: {
        reportType: 'Report Type',
        reportTypePlaceholder: 'Select Report Type',
        reportTypeErrorMsg: 'Please Select Report Type',
        instanceType: 'VA Instance Type',
        instanceTypePlaceholder: 'Select VA Instance Type',
        instanceTypeErrorMsg: 'Please Select VA Instance Type',
        instanceId: 'VA Instance ID',
        instanceIdPlaceholder: 'Input VA Instance ID',
        instanceIdErrorMsg: 'Please Input VA Instance ID',
        provider: 'Source Provider',
        providerPlaceholder: 'Select Source Provider',
        providerErrorMsg: 'Please Select Source Provider',
        fileId: 'Source File',
        fileIdPlaceholder: 'Input Source File',
        fileIdErrorMsg: 'Please Input Source File',
        deviceId: 'Source Device ID',
        deviceIdPlaceholder: 'Input Source Device ID',
        deviceIdErrorMsg: 'Please Input Source Device ID',
        channelId: 'Source Channel ID',
        channelIdPlaceholder: 'Input Source Channel ID',
        channelIdErrorMsg: 'Please Input Source Channel ID',
        from: 'From',
        to: 'To',
        fromErrorMsg: 'Please Select From Time',
        toErrorMsg: 'Please Select To Time',
        sort: 'Sort',
        sortPlaceholder: 'Select Sort',
        sortErrorMsg: 'Please Select Sort',
        deviceProviderId: 'Device Provider ID',
        deviceProviderIdPlaceholder: 'Input Device Provider ID',
        deviceProviderIdErrorMsg: 'Please Input Device Provider ID',
        timezone: 'Time Zone',
        timezoneErrorMsg: 'Please Select Time Zone',
        timeunit: 'Time Unit',
        timeunitErrorMsg: 'Please Select Time Unit',
        channel: 'Channel'
      },
      license: {
        app: 'VA Name',
        appErrorMsg: 'Please Select Engine',
        createBtnMsg: 'Create License'
      },
      incident: {
        params: 'Incident Name/Type/Status',
        paramsPlaceholder: 'Incident Name/Type/Status',
        incidentName: 'Incident Name',
        incidentType: 'Incident Type',
        incidentStatus: 'Incident Status',
        from: 'Period From',
        to: 'Period To',
        createBtnMsg: 'Create New Post Incident',
        details: 'Post Incident Details',
        createJob: 'Create New Job VA Instance',
        createLive: 'Create New Live VA Instance',
        createService: 'Create New Service VA Instance',
        updateTitle: 'Update Post Incident Details',
        back: 'Back To Post Incident Page',
        postIncidentDetails: 'Post Incident Details',
        instanceReport: 'Instance Report',
        showReportList: 'Show Report'
      },
      engines: {
        engineName: 'VA Name',
        label: 'VA Label',
        createEngine: 'Install New Engine'
      },
      instance: {
        createInstance: 'Create New Instance',
        appName: 'Engine Name',
        instanceName: 'Instance Name',
        status: 'Status'
      },
      files: {
        createFile: 'Upload New File'
      }
    },
    table: {
      common: {
        operation: 'Operation',
        createdTime: 'Created Time',
        operationMenu: {
          name: '',
          tipName: 'Menu'
        }
      },
      files: {
        name: 'Name',
        type: 'Mime Type',
        data: 'Meta Data',
        length: 'Size',
        operationMenu: {
          update: 'Edit Info',
          download: 'Download',
          delete: 'Delete'
        }
      },
      engines: {
        name: 'VA Name',
        vaEngineName: 'VA Engine Name',
        label: 'VA Label',
        provider: 'VA Provider Name',
        status: 'Status',
        version: 'VA Version',
        assignToGroup: 'Assign Engine To User Group',
        remaining: 'License Remaining',
        assignLicense: 'Assign License',
        description: 'VA Description',
        gateway: 'VA Gateway',
        vender: 'Vendor',
        operationMenu: {
          update: 'Edit Info',
          updateTitle: 'Edit Engine Info',
          upgrade: 'Upgrade',
          upgradeTitle: 'Upgrade Engine',
          deactivate: 'Deactivate',
          activate: 'Activate',
          activationTitle: 'Change Engine Activation',
          delete: 'Delete',
          deleteTitle: 'Delete Engine'
        }
      },
      instance: {
        status: 'Status',
        name: 'Instance Name',
        app: 'App',
        priority: 'Priority',
        provider: 'Source Provider',
        created: 'Created Time',
        appName: 'Engine Name',
        operationMenu: {
          update: 'Edit Configuration',
          stop: 'Stop',
          start: 'Start',
          delete: 'Delete',
          deactivate: 'Deactivate',
          activate: 'Activate',
          restart: 'Restart'
        }
      },
      report: {
        time: 'Time',
        provider: 'Source Provider',
        details: 'Source Details',
        data: 'Data',
        type: 'Type',
        snapshot: 'Snapshot'
      },
      license: {
        id: 'License ID',
        keyType: 'Key Type',
        status: 'Status',
        operationMenu: {
          update: 'Edit',
          deactivate: 'Deactivate',
          activate: 'Activate',
          delete: 'Delete',
          getKey: 'Get Key',
          download: 'Download Key'
        }
      },
      incident: {
        name: 'Incident Name',
        type: 'Incident Type',
        description: 'Incident Description',
        created: 'Created Time',
        createdBy: 'Created By',
        status: 'Status',
        operationMenu: {
          update: 'Edit',
          delete: 'Delete',
          close: 'Close'
        }
      }
    },
    dialog: {
      common: {
        name: 'Name',
        placeholderName: 'Input Name',
        nameErrorMsg: 'Please Input Name',
        description: 'Description',
        placeholderDescription: 'Input Description',
        descriptionErrorMsg: 'Please Input Description',
        uploadErrorMsg: 'Please Select File To Upload'
      },
      files: {
        createTitle: 'Upload File',
        updateTitle: 'Edit File Information',
        uploadMaxError: 'Upload files should not exceed '
      },
      engines: {
        upgradeTitle: 'Upgrade VA Engine',
        createTitle: 'Install New VA Engine',
        updateTitle: 'Edit VA Engine Information',
        currentName: 'Current Package Name',
        uploadMaxError: 'Engine App should not exceed ',
        vaGateway: 'VA Gateway',
        vaGatewayErrorMsg: 'Please Select VA Gateway',
        vaGatewayPlaceholder: 'Select VA Gateway',
        installerType: 'Installer Type',
        installerTypeErrorMsg: 'Please Select Installer Type',
        installerTypePlaceholder: 'Select Installer Type',
        diaplayName: 'VA Name',
        diaplayNameErrorMsg: 'Please Input VA Name',
        diaplayNamePlaceholder: 'Input VA Name',
        vendor: 'Vendor',
        vendorErrorMsg: 'Please Input Vendor',
        vendorPlaceholder: 'Input Vendor',
        description: 'VA Description',
        descriptionErrorMsg: 'Please Input VA Description',
        descriptionPlaceholder: 'Input VA Description',
        assignLicense: 'Assign License',
        remaining: 'License Remaining',
        labels: 'VA Label',
        labelsErrorMsg: 'Please Select VA Label',
        labelsPlaceholder: 'Select VA Label',
        bundle: 'Bundle',
        bandleErrorMsg: 'Please Select Bundle',
        detailsTitle: 'Engine Details',
        nextCheckTime: 'Next Check Time',
        licenseKeyRequired: 'License Key Required'
      },
      instance: {
        common: {
          infoTitle: 'Instance Information',
          sourceTilte: 'Source Settings',
          configTitle: 'Configuration',
          scheduleTitle: 'Schedule',
          name: 'VA Name',
          nameErrorMsg: 'Please Input VA Name',
          namePlaceholder: 'Input VA Name',
          priority: 'Priority',
          priorityErrorMsg: 'Please Input Priority',
          priorityPlaceholder: 'Input Priority',
          engineErrorMsg: 'Please Select Engine',
          channelErrorMsg: 'Please Select Channel',
          fileIdErrorMsg: 'Please Select File',
          sourceProvider: 'Source Provider',
          sourceProviderErrorMsg: 'Please Select Source Provider',
          streamType: 'Stream Stype',
          streamTypeErrorMsg: 'Please Select Stream Stype',
          live: 'Live',
          liveErrorMsg: 'Please Select Live',
          from: 'From',
          to: 'To',
          url: 'Url',
          urlPlaceholder: 'Input Url',
          urlErrorMsg: 'Please Input Url',
          recordingList: 'Recording',
          scheduleName: 'Schedule Name',
          scheduleNamePlaceholder: 'Input Schedule Name',
          scheduleNameErrorMsg: 'Please Input Schedule Name',
          timeZone: 'Time Zone',
          timeZoneErrorMsg: 'Please Select Time Zone',
          week: 'Day Of Week',
          weekErrorMsg: 'Please Select Day Of Week',
          startMinutes: 'Start Time',
          startMinutesErrorMsg: 'Please Select Start Minutes',
          endMinutes: 'End Time',
          endMinutesErrorMsg: 'Please Select End Minutes',
          addPeriods: 'Add Weekly Periods',
          periodsOverlap: 'Periods Must Not Overlap',
          ivalidPeriodRange: 'Invalid Period Range In Schedule',
          assignLibrary: 'Assign Library By Group',
          detailsTitle: 'Instance Details',
          status: 'Status',
          instanceName: 'Instance Name',
          engineName: 'Engine Name',
          engineId: 'Engine Id',
          processingStartTime: 'Processing Start Time',
          processingEndTime: 'Processing End Time',
          provider: 'Source Provider',
          deviceProvider: 'Device Provider',
          channelId: 'Channel Id',
          deviceId: 'Device Id'
        },
        job: {
          createTitle: 'Create Job VA Instance',
          updateTitle: 'Edit Job VA Instance'
        },
        live: {
          createTitle: 'Create Live VA Instance',
          updateTitle: 'Edit Live VA Instance'
        },
        service: {
          createTitle: 'Create Serivce VA Instance',
          updateTitle: 'Edit Serivce VA Instance'
        }
      },
      license: {
        createTitle: 'Create License',
        engineName: 'VA Name',
        engineNameErrorMsg: 'Please Select VA Name',
        updateTitle: 'Edit License',
        viewTitle: 'License Details',
        host: 'Host',
        hostPlaceholder: 'Input Host',
        hostErrorMsg: 'Please Input Host',
        port: 'Port',
        portPlaceholder: 'Input Port',
        portErrorMsg: 'Please Input Port',
        expiry: 'Expiry By',
        mac: 'Mac Address',
        macPlaceholder: 'Input Mac Address',
        macErrorMsg: 'Please Input Mac Address',
        keyTitle: 'License Key'
      },
      incident: {
        createTitle: 'Add Post Incident',
        editTitle: 'Edit Post Incident',
        name: 'Incident Name',
        namePlaceholder: 'Input Incident Name',
        nameErrorMsg: 'Please Input Incident Name',
        type: 'Incident Type',
        typeErrorMsg: 'Please Select Incident Type',
        file: 'File Name',
        fileErrorMsg: 'Please Select File',
        comment: 'Comments',
        commentErrorMsg: 'Please Input Comments'
      }
    },
    confirm: {
      files: {
        deleteTitle: 'Delete File',
        deleteMsg: 'You are trying to delete the file, please confirm.'
      },
      engines: {
        deleteTitle: 'Delete VA Engines',
        deleteMsg: 'You are trying to delete the VA engines, please confirm.'
      },
      instance: {
        job: {
          deleteTitle: 'Delete Job VA Instance',
          deleteMsg: 'You are trying to delete the Job VA instance, please confirm.',
          startTitle: 'Start Job VA Instance',
          startMsg: 'You are trying to start the Job VA instance, please confirm.',
          stopTitle: 'Stop Job VA Instance',
          stopMsg: 'You are trying to stop the Job VA instance, please confirm.'
        },
        live: {
          restartTitle: 'Restart Live VA Instance',
          restartMsg: 'You are trying to restart the Live VA instance, please confirm.',
          deactivateTitle: 'Deactivate Live VA Instance',
          deactivateMsg: 'You are trying to deactivate the Live VA instance, please confirm.',
          activateTitle: 'Activate Live VA Instance',
          activateMsg: 'You are trying to activate the Live VA instance, please confirm.',
          deleteTitle: 'Delete Live VA Instance',
          deleteMsg: 'You are trying to delete the Live VA instance, please confirm.'
        },
        service: {
          restartTitle: 'Restart Service VA Instance',
          restartMsg: 'You are trying to restart the Service VA instance, please confirm.',
          deactivateTitle: 'Deactivate Service VA Instance',
          deactivateMsg: 'You are trying to deactivate the Service VA instance, please confirm.',
          activateTitle: 'Activate Service VA Instance',
          activateMsg: 'You are trying to activate the Service VA instance, please confirm.',
          deleteTitle: 'Delete Service VA Instance',
          deleteMsg: 'You are trying to delete the Service VA instance, please confirm.'
        }
      },
      license: {
        deleteTitle: 'Delete License',
        deleteMsg: 'You are trying to delete the license, please confirm.',
        deactivateTitle: 'Deactivate License',
        deactivateMsg: 'You are trying to deactivate the license, please confirm.',
        activateTitle: 'Acrivate License',
        activateMsg: 'You are trying to acrivate the license, please confirm.'
      },
      incident: {
        deleteTitle: 'Delete Post Incident',
        deleteMsg: 'You are trying to delete the post incident, please confirm.',
        closeTitle: 'Close Post Incident',
        closeMsg: 'You are trying to close the post incident, please confirm.'
      }
    },
    face: {
      faceEnrollment: {
        personListing: 'Person Listing',
        group: 'Group',
        groupInfo: 'Group Info',
        groupName: 'Group Name',
        groupDescription: 'Group Description',
        confidenceScore: 'Confidence Score',
        pictureRecognitionThreshold: 'Picture Recognition Threshold',
        appRegistered: 'App Registered',
        enginesRegistered: 'Engines Registered',
        triggerAlarm: 'Trigger Alarm',
        personDetails: 'Person Details',
        name: 'Name',
        birthday: 'Birthday',
        address: 'Address',
        addGroup: 'Add Group',
        addSpecialWatchListGroup: 'Add Special Watch List Group',
        updateGroup: 'Update Group',
        editGroup: 'Edit Group',
        groupList: 'Group List',
        triggerAlarmInd: 'Trigger Alarm Ind',
        action: 'Action',
        taskListing: 'Task Listing',
        nric: 'NRIC',
        uploadFaceImage: 'Upload Face Image',
        taskID: 'Task ID',
        fileName: 'File Name',
        createTime: 'Create Time',
        status: 'Status',
        editUserInfo: 'Edit User Information',
        editDetails: 'Edit Details',
        edit: 'Edit',
        delete: 'Delete',
        uploadFaceImages: 'Upload Face Images',
        deleteAll: 'Delete All',
        identifyNo: 'Identification Number',
        uploadImages: 'Upload Images',
        updatePerson: 'Update Person',
        deletePerson: 'Delete Person',
        deletePersonMessage: 'Are you sure to delete',
        deleteImage: 'Delete Image',
        deleteGroup: 'Delete Group',
        basicInfo: 'Basic Info',
        faceImages: 'Face Images',
        assignedGroups: 'Assigned Groups',
        searchByPerson: 'Search By Person',
        searchByGroup: 'Search By Group'
      },
      faceSearch: {
        group: 'Group',
        personNRIC: 'Person NRIC',
        uploadFace: 'Upload Face',
        channelID: 'Channel ID',
        period: 'Period',
        faceAttributes: 'Face Attributes',
        gender: 'Gender',
        region: 'Region',
        age: 'Age',
        image: 'Image',
        eventTime: 'Event Time',
        eventType: 'Event Type',
        channels: 'Channels',
        source: 'Source',
        VAEngine: 'VA Engine',
        notificationGroup: 'Notification Group',
        map: 'Map',
        showChosenOnly: 'Show Chosen Only',
        searchResult: 'Search Result',
        referenceNo: 'Reference No',
        remarks: 'Remarks',
        vs: 'VS',
        confidence: 'Confidence'
      },
      faceCompare: {
        confidenceLevel: 'Confidence Level',
        compareResult: 'Compare Result',
        enrolledFace: 'Enrolled Face'
      },
      specialWatchList: {
        startWatch: 'Start Watch',
        viewSpecialWatchList: 'View Special Watch List',
        specialWatchList: 'Special Watch List',
        startFrom: 'Start From'
      }
    },
    button: {
      groupManagement: 'Group Management',
      faceEnrollment: 'Face Enrollment',
      batchEnrollment: 'Batch Enrollment',
      search: 'Search',
      compare: 'Compare'
    },
    label: {
      userID: 'User ID',
      personName: 'Person Name',
      searchGroup: 'Search Group',
      from: 'From',
      to: 'To',
      preview: 'Preview'
    },
    remindInformation: {
      noSpecialWatchList: 'please create "Special watch List" group  before you start to watch',
      goAndCreate: 'Go And Create',
      deleteImageRemind: 'You are trying to delete the face image, please confirm.',
      deleteGroupRemind: 'You are trying to delete the group, please confirm.'
    }
  }
};
