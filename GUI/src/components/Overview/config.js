import { I18n } from 'react-i18nify';
import moment from 'moment';
import { DATE_FORMAT } from 'commons/constants/const';

const color = [
  '#dd6b66',
  '#759aa0',
  '#e69d87',
  '#8dc1a9',
  '#ea7e53',
  '#eedd78',
  '#73a373',
  '#73b9bc',
  '#7289ab',
  '#91ca8c',
  '#f49f42'
];

// common chart config: pie and donut chart
export const pieDonut = {
  title: {
    text: '',
    left: 'center',
    textStyle: { color: '#ccc' }
  },
  legend: {
    orient: 'vertical',
    x: 'left',
    bottom: 20,
    // top: 'center',
    // right: '10%',
    textStyle: { color: '#ccc' },
    data: ['In Use', 'Remaining']
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b} : {c} ({d}%)',
    confine: true
  },
  series: {
    name: '',
    type: 'pie',
    startAngle: 0,
    radius: '75%',
    data: [],
    center: ['50%', '50%'],
    color,
    label: { position: 'inside', formatter: '{c} ({d}%)', fontStyle: 'normal' },
    itemStyle: {
      emphasis: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
    },
    animationType: 'scale',
    animationEasing: 'elasticOut',
    animationDelay() {
      return Math.random() * 200;
    },
    labelLine: { normal: { show: false } }
  }
};

export const lineChart = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    textStyle: {
      color: '#c1bebe' // c7c4c4 797676
    }
  },
  dataset: {
    source: [
      ['product', '2015', '2016'],
      ['Matcha Latte', 43.3, 85.8],
      ['Milk Tea', 83.1, 73.4],
      ['Cheese Cocoa', 86.4, 65.2],
      ['Walnut Brownie', 72.4, 53.9]
    ]
  },
  xAxis: {
    type: 'category'
  },
  yAxis: { type: 'value' },
  series: [
    { type: 'line', color: color[0] },
    { type: 'line', color: color[1] },
    { type: 'line', color: color[2] }
  ],
  textStyle: {
    color: '#c1bebe'
  }
};

export const barChart = {
  legend: {
    textStyle: {
      orient: 'vertical',
      x: 'left',
      color: '#c1bebe' // c7c4c4 797676
    }
  },
  tooltip: {},
  dataset: {
    source: [
      ['product', '2015', '2016', '2017'],
      ['Matcha Latte', 43.3, 85.8, 93.7],
      ['Milk Tea', 83.1, 73.4, 55.1],
      ['Cheese Cocoa', 86.4, 65.2, 82.5],
      ['Walnut Brownie', 72.4, 53.9, 39.1]
    ]
  },
  xAxis: {},
  yAxis: { type: 'category' },
  // Declare several bar series, each will be mapped
  // to a column of dataset.source by default.
  series: [
    { type: 'bar', color: color[0] },
    { type: 'bar', color: color[1] },
    { type: 'bar', color: color[2] }
  ],
  textStyle: {
    color: '#c1bebe'
  }
};

export const xBarChart = {
  legend: {
    textStyle: {
      color: '#c1bebe'
    }
  },
  tooltip: {},
  dataset: {
    source: [
      ['Overall', 'Total License', 'License Remaining', 'License In Use'],
      ['VITB Latte', 1500, 1000, 2000],
      ['VITM Tea', 3000, 1000, 2008],
      ['VTTM Cocoa', 2000, 1000, 2000],
      ['VA Engine Gateway', 1200, 1000, 3000],
      ['VA Engine Category', 2200, 2000, 2000],
      ['Walnut Brownie', 3500, 2000, 2000]
    ]
  },
  xAxis: { type: 'category' },
  yAxis: {},
  // Declare several bar series, each will be mapped
  // to a column of dataset.source by default.
  series: [
    { type: 'bar', color: color[0] },
    { type: 'bar', color: color[1] },
    { type: 'bar', color: color[2] }
  ],
  textStyle: {
    color: '#c1bebe'
  }
};

// ------------------table columns of OverviewDetails------------------
export const cameraColumns = [
  {
    title: I18n.t('overview.title.cameraName'),
    dataIndex: 'cameraName'
  },
  {
    title: I18n.t('uvms.channel.parentDevice'),
    dataIndex: 'parentDevice'
  },
  {
    title: I18n.t('uvms.channel.uri'),
    dataIndex: 'uriAddress'
  },
  {
    title: I18n.t('uvms.channel.recordingSchedule'),
    dataIndex: 'scheduleName'
  },
  {
    title: I18n.t('uvms.channel.model'),
    dataIndex: 'model'
  },
  {
    title: I18n.t('overview.title.sessionStatus'),
    dataIndex: 'status'
  },
  {
    title: I18n.t('overview.title.connectedBy'),
    dataIndex: 'connectedBy'
  }
];
export const userColumns = [
  {
    title: I18n.t('overview.title.userID'),
    dataIndex: 'userId'
  },
  {
    title: I18n.t('overview.title.fullName'),
    dataIndex: 'userFullName'
  },
  {
    title: I18n.t('overview.title.email'),
    dataIndex: 'userEmail'
  },
  {
    title: I18n.t('overview.title.status'),
    dataIndex: 'userStatus'
  }
];
export const licenseColumns = [
  {
    title: I18n.t('overview.title.status'),
    dataIndex: 'appStatus'
  },
  {
    title: I18n.t('overview.title.vaEngineName'),
    dataIndex: 'appName'
  },
  {
    title: I18n.t('overview.title.version'),
    dataIndex: 'appVersion'
  },
  {
    title: I18n.t('overview.title.vaEngineGateway'),
    dataIndex: 'appGateway'
  },
  {
    title: I18n.t('overview.title.vaEngineCategory'),
    dataIndex: 'appCategory'
  },
  {
    title: I18n.t('overview.title.totalLicense'),
    dataIndex: 'total'
  },
  {
    title: I18n.t('overview.title.licenseRemaining'),
    dataIndex: 'remain'
  },
  {
    title: I18n.t('overview.title.licenseInUse'),
    dataIndex: 'inUse'
  }
];
export const instanceOverviewColumns = [
  {
    title: I18n.t('overview.title.type'),
    dataIndex: 'type'
  },
  {
    title: I18n.t('overview.title.status'),
    dataIndex: 'status'
  },
  {
    title: I18n.t('overview.title.name'),
    dataIndex: 'name'
  },
  {
    title: I18n.t('overview.title.vaEngineName'),
    dataIndex: 'engineName'
  },
  {
    title: I18n.t('overview.title.channel'),
    dataIndex: 'channel'
  },
  {
    title: I18n.t('overview.title.priority'),
    dataIndex: 'priority'
  },
  {
    title: I18n.t('overview.title.createDate'),
    dataIndex: 'createdDate',
    render: text => moment(text).format(DATE_FORMAT)
  }
];
export const vaIRUColumns = [
  {
    title: I18n.t('overview.title.name'),
    dataIndex: 'name'
  },
  {
    title: I18n.t('overview.title.vaEngineName'),
    dataIndex: 'engineName'
  },
  {
    title: I18n.t('overview.title.channel'),
    dataIndex: 'channel'
  },
  {
    title: I18n.t('overview.title.priority'),
    dataIndex: 'priority'
  },
  {
    title: I18n.t('overview.title.status'),
    dataIndex: 'status'
  },
  {
    title: I18n.t('overview.title.createDate'),
    dataIndex: 'createdDate'
  },
  {
    title: I18n.t('overview.title.phsicalMemory'),
    dataIndex: 'phsicalMemory'
  },
  {
    title: I18n.t('overview.title.vitualMemory'),
    dataIndex: 'visualMemory'
  },
  {
    title: I18n.t('overview.title.gpuMemory'),
    dataIndex: 'gpuMemory'
  }
];
export const crowdDetectionColumns = [
  {
    title: I18n.t('overview.title.status'),
    dataIndex: 'status'
  },
  {
    title: I18n.t('overview.title.vaEngineName'),
    dataIndex: 'vaEngineName'
  },
  {
    title: I18n.t('overview.title.version'),
    dataIndex: 'version'
  },
  {
    title: I18n.t('overview.title.vaEngineGateway'),
    dataIndex: 'vaEngineGateway'
  },
  {
    title: I18n.t('overview.title.vaEngineCategory'),
    dataIndex: 'vaEngineCategory'
  },
  {
    title: I18n.t('overview.title.totalLicense'),
    dataIndex: 'totalLicense'
  },
  {
    title: I18n.t('overview.title.licenseRemaining'),
    dataIndex: 'licenseRemaining'
  },
  {
    title: I18n.t('overview.title.licenseInUse'),
    dataIndex: 'licenseInUse'
  },
  {
    title: I18n.t('overview.title.actions'),
    dataIndex: 'actions'
  }
];
export const distributionColumns = [
  {
    title: I18n.t('overview.title.groupName'),
    dataIndex: 'groupName'
  },
  {
    title: I18n.t('overview.title.licenseAssigned'),
    dataIndex: 'assigned'
  },
  {
    title: I18n.t('overview.title.licenseRemaining'),
    dataIndex: 'remaining'
  },
  {
    title: I18n.t('overview.title.licenseInUse'),
    dataIndex: 'inuse'
  }
];
