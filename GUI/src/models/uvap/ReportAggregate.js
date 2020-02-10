import { getAggregateReportsApi, getEventHandlersApi, getUserUploadFilesApi } from 'api/vap';
import { initChannelsApi } from 'api/vms';
import { isSuccess } from 'utils/helpers';
import _ from 'lodash';

export default {
  namespace: 'ReportAggregate',
  state: {
    namespace: 'ReportAggregate',
    reportList: {},
    reportTypeList: [],
    fileBlobList: [],
    reportListWithSrc: [],
    channelList: {},
    fileList: {}
  },
  effects: {
    *getReportList({ payload }, { call, put }) {
      const temp = {
        type: payload.type,
        time: {
          from: payload.timefr,
          to: payload.timeto,
          timeZone: payload.timezone,
          unit: payload.timeunit
        },
        page: {
          index: payload.pindex,
          size: payload.psize,
          sort: payload.sort
        },
        sources: [],
        vaInstances: [
          {
            id: payload.vainstanceid === undefined ? '' : payload.vainstanceid,
            type: payload.vainstancetype,
            appId: ''
          }
        ]
      };
      if (payload.srcprovider === 'vap_device_stream' && !_.isEmpty(payload.multipleDeivceItems)) {
        payload.multipleDeivceItems.forEach(item => {
          temp.sources.push({
            provider: payload.srcprovider,
            // deviceProviderId: payload.srcdeviceproviderid,
            deviceProviderId: 'uvms',
            deviceId: item.deviceId,
            deviceChannelId: item.channelId,
            fileId: '',
            url: ''
          });
        });
      }
      if (payload.srcprovider === 'vap_storage_file' && !_.isEmpty(payload.multipleDeivceItems)) {
        payload.multipleDeivceItems.forEach(item => {
          temp.sources.push({
            provider: payload.srcprovider,
            // deviceProviderId: payload.srcdeviceproviderid,
            deviceProviderId: 'uvms',
            deviceId: '',
            deviceChannelId: '',
            fileId: item.id,
            url: ''
          });
        });
      }
      const result = yield call(getAggregateReportsApi, temp);
      if (isSuccess(result)) {
        yield put({
          type: 'getReportListSuccess',
          reportList: result.data
        });
      }
    },
    *getReportTypeList({ payload }, { call, put }) {
      const result = yield call(getEventHandlersApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getReportTypeListSuccess',
          reportTypeList: result.data
        });
      }
    },
    *getChannelList({ payload }, { call, put }) {
      const result = yield call(initChannelsApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getChannelListSuccess',
          channelList: result.data
        });
      }
    },
    *getFilesList({ payload }, { call, put }) {
      const result = yield call(getUserUploadFilesApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getFilesListSuccess',
          fileList: result.data
        });
      }
    }
  },
  reducers: {
    getReportListSuccess(state, { reportList }) {
      return {
        ...state,
        reportList
      };
    },
    getReportTypeListSuccess(state, { reportTypeList }) {
      return {
        ...state,
        reportTypeList
      };
    },
    resetVapReportAggregateState() {
      return {
        namespace: 'ReportAggregate',
        reportList: {},
        reportTypeList: [],
        fileBlobList: [],
        reportListWithSrc: []
      };
    },
    getChannelListSuccess(state, { channelList }) {
      return {
        ...state,
        channelList
      };
    },
    getFilesListSuccess(state, { fileList }) {
      return {
        ...state,
        fileList
      };
    }
  }
};
