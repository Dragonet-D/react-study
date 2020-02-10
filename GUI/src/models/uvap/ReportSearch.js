import {
  getSearchReportsApi,
  getEventHandlersApi,
  getGenerateCrowdChartApi,
  getUserUploadFilesApi
} from 'api/vap';
import { initChannelsApi } from 'api/vms';
import { isSuccess } from 'utils/helpers';
import _ from 'lodash';

export default {
  namespace: 'ReportSearch',
  state: {
    namespace: 'ReportSearch',
    reportList: {},
    reportTypeList: [],
    reportCrowdChart: {},
    channelList: {},
    fileList: {}
  },
  effects: {
    *getReportList({ payload }, { call, put }) {
      const temp = {
        type: payload.type,
        time: {
          from: payload.timefr,
          to: payload.timeto
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
        ],
        data: []
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
      const result = yield call(getSearchReportsApi, temp);
      if (isSuccess(result)) {
        yield put({
          type: 'getReportListSuccess',
          reportList: result.data
        });
      }
    },
    *getGenerateCrowdChart({ payload }, { call, put }) {
      const result = yield call(getGenerateCrowdChartApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getGenerateCrowdChartSuccess',
          reportCrowdChart: result.data
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
    getGenerateCrowdChartSuccess(state, { reportCrowdChart }) {
      return {
        ...state,
        reportCrowdChart
      };
    },
    getReportTypeListSuccess(state, { reportTypeList }) {
      return {
        ...state,
        reportTypeList
      };
    },
    resetVapReportSearchState() {
      return {
        namespace: 'ReportSearch',
        reportList: {},
        reportTypeList: []
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
