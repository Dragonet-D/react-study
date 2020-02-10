/*
 * @Description: Map Setting
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-07-10 09:57:52
 * @LastEditTime: 2019-09-25 18:25:13
 * @LastEditors: Kevin
 */

import envconfig from 'utils/envconfig';

export const urls = {
  module: {
    current: {
      js: `${envconfig.arcgisLibraryAddress.js}/4.11`,
      css: `${envconfig.arcgisLibraryAddress.css}/4.11/esri/themes/dark-blue/main.css`
    },
    js: {
      '4.11': 'https://js.arcgis.com/4.11/',
      '4.12': 'https://js.arcgis.com/4.12/'
    },
    css: {
      '4.11': 'https://js.arcgis.com/4.11/esri/css/main.css',
      '4.12': 'https://js.arcgis.com/4.12/esri/css/main.css'
    }
  },
  layer: {
    ivhChannels: `${envconfig.arcgisAddress}/arcgis/rest/services/Main/AllAndAlarmCamera/FeatureServer/1`,
    ivhChannelsAlarm: `${envconfig.arcgisAddress}/arcgis/rest/services/Main/AllAndAlarmCamera/FeatureServer/0`,
    ivhCameraImageLayer: `${envconfig.arcgisAddress}/arcgis/rest/services/Main/AllAndAlarmCamera/MapServer`,
    basemapLayer: `${envconfig.arcgisAddress}/arcgis/rest/services/Basemaps/IVHBasemapTiled/MapServer`
  },
  tool: {
    geometryServer: `${envconfig.arcgisAddress}/arcgis/rest/services/Utilities/Geometry/GeometryServer`,
    geoAddressServer: `${envconfig.arcgisAddress}/arcgis/rest/services/Main/IVHGeodataService/GeocodeServer`
  }
};

export const imageLayerId = {
  mapFeatureLayerAlarm: 0,
  mapFeatureLayerNormal: 1
};

export const layerId = {
  normal: 'mapFeatureLayerNormal',
  alarm: 'mapFeatureLayerAlarm',
  image: 'mapImageLayerLabel',
  graphic: 'mapGraphicsLayer',
  clusterAlarm: 'mapClusterLayerAlarm',
  clusterNormal: 'mapClusterLayerNormal'
};

export const ivhPopupTemplate = {
  title: 'IVH Camera Information',
  content: [
    {
      type: 'text', // TextContentElement
      text: "Channel Name: <b>{channelName}</b><br/><br/><img src='' width='100%' height='100%'/>"
    },
    {
      type: 'fields',
      fieldInfos: [
        {
          fieldName: 'channelName',
          label: 'Channel Name',
          visible: true
        },
        {
          fieldName: 'channelDescription',
          label: 'Description',
          visible: true
        },
        {
          fieldName: 'channelAddress',
          label: 'Address',
          visible: true
        },
        {
          fieldName: 'buildingName',
          label: 'Building Name',
          visible: true
        },
        {
          fieldName: 'longitude',
          label: 'Longitude',
          visible: true
        },
        {
          fieldName: 'latitude',
          label: 'Latitude',
          visible: true
        }
      ]
    }
  ]
};

export const layerSearchSourceOptions = {
  baseFeatureOptions: {
    layer: {}, // configurable
    searchFields: ['channelName', 'channelDescription', 'channelAddress'], // configurable
    displayField: 'channelName', // configurable
    popupTemplate: ivhPopupTemplate, // configurable
    exactMatch: false,
    resultSymbol: {}, // configurable
    outFields: ['*'],
    name: 'Camera Information', // configurable
    placeholder: 'Name / Description / Address', // configurable
    maxResults: 6,
    maxSuggestions: 6,
    suggestionsEnabled: true,
    minSuggestCharacters: 0,
    getSuggestions: () => {}, // configurable
    getResults: () => {} // configurable
  },
  baseLocatorOptions: {
    locator: {}, // configurable
    singleLineFieldName: 'SingleLine',
    outFields: ['*'],
    exactMatch: false,
    countryCode: 'SG',
    name: 'ArcGIS World Geocoding Service',
    localSearchOptions: {
      minScale: 300000,
      distance: 50000
    },
    autoNavigate: true,
    popupEnabled: true,
    placeholder: 'Search Geocoder',
    maxResults: 6,
    maxSuggestions: 6,
    suggestionsEnabled: true,
    minSuggestCharacters: 0
  }
};

export const featureForm = null;

export default {
  urls,
  ivhPopupTemplate,
  featureForm,
  imageLayerId,
  layerId
};

// data test
export const alarmDataTest = [
  {
    alarmSeverity: 'L',
    sourceId:
      '{"deviceId":"d5391fc3fe0f4e7d8c24e618ac7cc9e8","channelId":"d5391fc3fe0f4e7d8c24e618ac7cc9e8-1","sourceName": "hikvision-ipc111111111111111111111"}',
    note: '',
    data:
      '{"deviceInfo":{"deviceType":"ipc","name":"hik_test","model":"hikvision-ipc","id":"18440e02e5cc47c78c7aa5d66f69ab5a","uri":"tcp://10.20.0.101:8000"}}',
    latitude: 1.3724021,
    longitude: 103.8016641,
    alarmStatus: 'Enabled',
    alarmType: 'vms.device.added',
    alarmDetailsUuid: '1d107c6c-9928-4347-b797-4ab7d80129b2',
    jsonData: '',
    alarmDefId: '940c6161-9502-4802-96db-9834d6a1eac0',
    action: null,
    time: '2019-04-10T10:28:29.170+0000',
    ownedBy: '',
    status: 'Open'
  },
  {
    alarmSeverity: 'L',
    sourceId:
      '{"deviceId":"d5391fc3fe0f4e7d8c24e618ac7cc9e8","channelId":"d5391fc3fe0f4e7d8c24e618ac7cc9e8-1","sourceName": "hikvision-ipc"}',
    note: '',
    data:
      '{"deviceInfo":{"deviceType":"ipc","name":"hik_test","model":"hikvision-ipc","id":"18440e02e5cc47c78c7aa5d66f69ab5a","uri":"tcp://10.20.0.101:8000"}}',
    latitude: 1.3724021,
    longitude: 103.8016641,
    alarmStatus: 'Enabled',
    alarmType: 'vms.device.added',
    alarmDetailsUuid: '39d5f5ad-4207-4c7a-ab35-9798466732dc',
    jsonData: '',
    alarmDefId: '940c6161-9502-4802-96db-9834d6a1eac0',
    action: null,
    time: '2019-04-10T10:28:25.210+0000',
    ownedBy: '',
    status: 'Open'
  },
  {
    alarmSeverity: 'L',
    sourceId:
      '{"deviceId":"d5391fc3fe0f4e7d8c24e618ac7cc9e8","channelId":"d5391fc3fe0f4e7d8c24e618ac7cc9e8-1","sourceName": "hikvision-ipc"}',
    note: '',
    data:
      '{"deviceInfo":{"deviceType":"ipc","name":"hik_test","model":"hikvision-ipc","id":"18440e02e5cc47c78c7aa5d66f69ab5a","uri":"tcp://10.20.0.101:8000"}}',
    latitude: 1.3724021,
    longitude: 103.8016641,
    alarmStatus: 'Enabled',
    alarmType: 'vms.device.added',
    alarmDetailsUuid: '4feabe04-9c15-4e51-b252-c9dfb2985943',
    jsonData: '',
    alarmDefId: '940c6161-9502-4802-96db-9834d6a1eac0',
    action: null,
    time: '2019-04-10T10:20:05.027+0000',
    ownedBy: '',
    status: 'Open'
  },
  {
    alarmSeverity: 'L',
    sourceId:
      '{"deviceId":"d5391fc3fe0f4e7d8c24e618ac7cc9e8","channelId":"d5391fc3fe0f4e7d8c24e618ac7cc9e8-2","sourceName": "hikvision-ipc"}',
    note: '',
    data:
      '{"deviceInfo":{"deviceType":"ipc","name":"hik_test4","model":"hikvision-ipc","id":"18440e02e5cc47c78c7aa5d66f69ab5a","uri":"tcp://10.20.0.101:8000"}}',
    latitude: 1.3724021,
    longitude: 103.8016641,
    alarmStatus: 'Enabled',
    alarmType: 'vms.device.added',
    alarmDetailsUuid: 'e9a22193-d509-4209-bff6-94a3c6b6da9f',
    jsonData: '',
    alarmDefId: '940c6161-9502-4802-96db-9834d6a1eac0',
    action: null,
    time: '2019-04-10T10:20:02.320+0000',
    ownedBy: '',
    status: 'Open'
  },
  {
    alarmSeverity: 'L',
    sourceId:
      '{"deviceId":"d5391fc3fe0f4e7d8c24e618ac7cc9e8","channelId":"d5391fc3fe0f4e7d8c24e618ac7cc9e8-2","sourceName": "hikvision-ipc"}',
    note: '',
    data:
      '{"deviceInfo":{"deviceType":"ipc","name":"hik_test4","model":"hikvision-ipc","id":"18440e02e5cc47c78c7aa5d66f69ab5a","uri":"tcp://10.20.0.101:8000"}}',
    latitude: 1.3724021,
    longitude: 103.8016641,
    alarmStatus: 'Enabled',
    alarmType: 'vms.device.added',
    alarmDetailsUuid: 'd64380c3-739c-4266-9533-14a3c53b8eef',
    jsonData: '',
    alarmDefId: '940c6161-9502-4802-96db-9834d6a1eac0',
    action: null,
    time: '2019-04-10T10:18:30.577+0000',
    ownedBy: '',
    status: 'Open'
  },
  {
    alarmSeverity: 'L',
    sourceId:
      '{"deviceId":"d5391fc3fe0f4e7d8c24e618ac7cc9e8","channelId":"d5391fc3fe0f4e7d8c24e618ac7cc9e8-2","sourceName": "hikvision-ipc"}',
    note: '',
    data:
      '{"deviceInfo":{"deviceType":"ipc","name":"hik_test4","model":"hikvision-ipc","id":"18440e02e5cc47c78c7aa5d66f69ab5a","uri":"tcp://10.20.0.101:8000"}}',
    latitude: 1.3724021,
    longitude: 103.8016641,
    alarmStatus: 'Enabled',
    alarmType: 'vms.device.added',
    alarmDetailsUuid: 'd75cc010-215e-4cda-9969-c30952d782ed',
    jsonData: '',
    alarmDefId: '940c6161-9502-4802-96db-9834d6a1eac0',
    action: null,
    time: '2019-04-10T10:18:27.907+0000',
    ownedBy: '',
    status: 'Open'
  },
  {
    alarmSeverity: 'L',
    sourceId:
      '{"deviceId":"d5391fc3fe0f4e7d8c24e618ac7cc9e8","channelId":"d5391fc3fe0f4e7d8c24e618ac7cc9e8-76","sourceName": "hikvision-ipc"}',
    note: '',
    data:
      '{"deviceInfo":{"deviceType":"ipc","name":"hik_test6","model":"hikvision-ipc","id":"18440e02e5cc47c78c7aa5d66f69ab5a","uri":"tcp://10.20.0.101:8000"}}',
    latitude: 1.43288,
    longitude: 103.824392,
    alarmStatus: 'Enabled',
    alarmType: 'vms.device.added',
    alarmDetailsUuid: 'd5ca3003-21e7-43d2-9003-36bb32155dc7',
    jsonData: '',
    alarmDefId: '940c6161-9502-4802-96db-9834d6a1eac0',
    action: null,
    time: '2019-04-10T10:17:37.687+0000',
    ownedBy: '',
    status: 'Open'
  },
  {
    alarmSeverity: 'L',
    sourceId:
      '{"deviceId":"d5391fc3fe0f4e7d8c24e618ac7cc9e8","channelId":"d5391fc3fe0f4e7d8c24e618ac7cc9e8-76","sourceName": "hikvision-ipc"}',
    note: '',
    data:
      '{"deviceInfo":{"deviceType":"ipc","name":"hik_test6","model":"hikvision-ipc","id":"18440e02e5cc47c78c7aa5d66f69ab5a","uri":"tcp://10.20.0.101:8000"}}',
    latitude: 1.43288,
    longitude: 103.824392,
    alarmStatus: 'Enabled',
    alarmType: 'vms.device.added',
    alarmDetailsUuid: '83d5f09e-9ea1-4b8a-a3f2-b007fc2a1eb8',
    jsonData: '',
    alarmDefId: '940c6161-9502-4802-96db-9834d6a1eac0',
    action: null,
    time: '2019-04-10T10:17:34.967+0000',
    ownedBy: '',
    status: 'Open'
  },
  {
    alarmSeverity: 'L',
    sourceId:
      '{"deviceId":"d5391fc3fe0f4e7d8c24e618ac7cc9e8","channelId":"d5391fc3fe0f4e7d8c24e618ac7cc9e8-9","sourceName": "hikvision-ipc"}',
    note: '',
    data:
      '{"deviceInfo":{"deviceType":"ipc","name":"hik_test8","model":"hikvision-ipc","id":"18440e02e5cc47c78c7aa5d66f69ab5a","uri":"tcp://10.20.0.101:8000"}}',
    latitude: 1.43288,
    longitude: 103.824392,
    alarmStatus: 'Enabled',
    alarmType: 'vms.device.added',
    alarmDetailsUuid: '4ccf5b08-d228-4f4b-932d-14b2d80184d2',
    jsonData: '',
    alarmDefId: '940c6161-9502-4802-96db-9834d6a1eac0',
    action: null,
    time: '2019-04-10T10:16:25.057+0000',
    ownedBy: '',
    status: 'Open'
  },
  {
    alarmSeverity: 'L',
    sourceId:
      '{"deviceId":"d5391fc3fe0f4e7d8c24e618ac7cc9e8","channelId":"d5391fc3fe0f4e7d8c24e618ac7cc9e8-10","sourceName": "hikvision-ipc"}',
    note: '',
    data:
      '{"deviceInfo":{"deviceType":"ipc","name":"hik_test7","model":"hikvision-ipc","id":"18440e02e5cc47c78c7aa5d66f69ab5a","uri":"tcp://10.20.0.101:8000"}}',
    latitude: 1.367668,
    longitude: 103.921896,
    alarmStatus: 'Enabled',
    alarmType: 'vms.device.added',
    alarmDetailsUuid: 'f21b2ff6-274e-4565-8eb6-0f0140665732',
    jsonData: '',
    alarmDefId: '940c6161-9502-4802-96db-9834d6a1eac0',
    action: null,
    time: '2019-04-10T10:16:22.297+0000',
    ownedBy: '',
    status: 'Open'
  }
];

export const treeData = [
  {
    groupName: 'Singapore',
    belongToSearch: false,
    children: [
      {
        groupName: '4444444444',
        belongToSearch: false,
        children: [
          {
            fullPath: 'd6e60fbe-a135-471a-8cee-81d652a31064|ecd3609b-51ae-41e8-83e2-939b35278ae0',
            address: null,
            belongToSearch: false,
            groupId: 'd6e60fbe-a135-471a-8cee-81d652a31064',
            latitude: null,
            longitude: null,
            parentGroupId: 'ecd3609b-51ae-41e8-83e2-939b35278ae0',
            buildingName: null,
            groupName: '41414141',
            children: [
              {
                ptzInd: 'Y',
                installation: {
                  address: 'Cashew Villas, 96 Cashew Crescent, 679829, Singapore',
                  distance: null,
                  latitude: '1.360643638940831',
                  fieldOfView: null,
                  fieldOfCoverage: null,
                  longitude: '103.77',
                  direction: null
                },
                deviceId: '137fc012dc074290aec8ee12419ecc9f',
                channelName: 'D9527_8',
                channelId: '137fc012dc074290aec8ee12419ecc9f-1',
                status: 'OK',
                statusCode: 200
              }
            ],
            groupLevel: '3',
            isAddressRequired: null,
            status: 'A'
          }
        ],
        groupId: 'ecd3609b-51ae-41e8-83e2-939b35278ae0',
        parentGroupId: '80183152-bff1-40cc-b4ef-228c6ec5d70c',
        groupLevel: '2'
      },
      {
        fullPath: 'aeb9dc2a-579e-4f92-b0ca-bed8d991cd56|80183152-bff1-40cc-b4ef-228c6ec5d70c',
        address: null,
        belongToSearch: false,
        groupId: 'aeb9dc2a-579e-4f92-b0ca-bed8d991cd56',
        latitude: null,
        longitude: null,
        parentGroupId: '80183152-bff1-40cc-b4ef-228c6ec5d70c',
        buildingName: null,
        groupName: 'test',
        children: [
          {
            ptzInd: 'Y',
            installation: {
              address: '35 Murai Farmway, 709145, Singapore',
              distance: '1111.0',
              latitude: '1.3953092086248613',
              fieldOfView: null,
              fieldOfCoverage: null,
              longitude: '103.7',
              direction: '111.0'
            },
            deviceId: '32252535a6d845b7b3ecd83eb09e782f',
            channelName: 'Fixed Camera One',
            channelId: '32252535a6d845b7b3ecd83eb09e782f-1',
            status: 'OK',
            statusCode: 200
          }
        ],
        groupLevel: '2',
        isAddressRequired: null,
        status: 'A'
      }
    ],
    groupId: '80183152-bff1-40cc-b4ef-228c6ec5d70c',
    parentGroupId: '',
    longitude: '103.766199',
    latitude: '1.405251',
    groupLevel: '1'
  },
  {
    groupName: 'NoGroup',
    children: [
      {
        ptzInd: 'Y',
        installation: {
          address: '45 Kallang Place, 339173, Singapore',
          distance: null,
          latitude: '1.31',
          fieldOfView: null,
          fieldOfCoverage: null,
          longitude: '103.87',
          direction: null
        },
        deviceId: 'd5391fc3fe0f4e7d8c24e618ac7cc9e8',
        channelName: 'hik-ptz',
        channelId: 'd5391fc3fe0f4e7d8c24e618ac7cc9e8-1',
        status: 'OK',
        statusCode: 200
      },
      {
        ptzInd: 'Y',
        installation: {
          address: 'Singapore Changi Airport',
          distance: null,
          latitude: '1.3561816974768817',
          fieldOfView: null,
          fieldOfCoverage: null,
          longitude: '103.97',
          direction: null
        },
        deviceId: '1d926ee2be0e4be4b74762dd84142919',
        channelName: 'D9527_9',
        channelId: '1d926ee2be0e4be4b74762dd84142919-1',
        status: 'OK',
        statusCode: 200
      },
      {
        ptzInd: 'N',
        installation: {
          address: null,
          distance: null,
          latitude: null,
          fieldOfView: null,
          fieldOfCoverage: null,
          longitude: null,
          direction: null
        },
        deviceId: 'd5aa3fad999c447ea526d0eb809d1184',
        channelName: 'test for mq',
        channelId: 'd5aa3fad999c447ea526d0eb809d1184-1',
        status: 'OK',
        statusCode: 200
      }
    ],
    groupId: 'noGroup_groupId',
    longitude: '103.873659',
    latitude: '1.385687'
  }
];
