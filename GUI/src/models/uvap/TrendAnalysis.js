import {
  getSearchReportsApi,
  getEventHandlersApi,
  getGenerateCrowdChartApi,
  getAggregateReportsApi
} from 'api/vap';
import { initChannelsApi } from 'api/vms';
import { isSuccess } from 'utils/helpers';
import _ from 'lodash';

export default {
  namespace: 'TrendAnalysis',
  state: {
    namespace: 'TrendAnalysis',
    reportList: {},
    reportTypeList: [],
    reportCrowdChart: {},
    channelList: {},
    AggregateList: {}
  },
  effects: {
    *getReportList({ payload }, { call, put }) {
      console.log(payload.multipleDeivceItems);
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
      if (!_.isEmpty(payload.multipleDeivceItems)) {
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
      const result = yield call(getSearchReportsApi, temp);
      if (isSuccess(result)) {
        yield put({
          type: 'getReportListSuccess',
          reportList: result.data
        });
      }
    },
    *getGenerateCrowdChart({ payload }, { call, put }) {
      // const temp = {
      //   type: payload.type,
      //   time: {
      //     from: payload.timefr,
      //     to: payload.timeto
      //   },
      //   page: {
      //     index: payload.pindex,
      //     size: payload.psize,
      //     sort: payload.sort
      //   },
      //   sources: [],
      //   vaInstances: [
      //     {
      //       id: payload.vainstanceid === undefined ? '' : payload.vainstanceid,
      //       type: 'LIVE_VA',
      //       appId: ''
      //     }
      //   ],
      //   data: []
      // };
      payload.vainstancetype = 'LIVE_VA';
      payload.type = 'vap.event.crowd';
      // if (!_.isEmpty(payload.multipleDeivceItems)) {
      //   payload.multipleDeivceItems.forEach(item => {
      //     temp.sources.push({
      //       provider: payload.srcprovider,
      //       deviceProviderId: 'uvms',
      //       deviceId: item.deviceId,
      //       deviceChannelId: item.channelId,
      //       fileId: '',
      //       url: ''
      //     });
      //   });
      // }
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
    *getAggregateReportList({ payload }, { call, put }) {
      const temp = {
        type: 'vap.event.peoplecount',
        time: {
          from: payload.timefr,
          to: payload.timeto,
          timeZone: 'Asia/Singapore',
          unit: 'hourly'
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
            type: 'LIVE_VA',
            appId: ''
          }
        ]
      };
      if (!_.isEmpty(payload.multipleDeivceItems)) {
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
      const result = yield call(getAggregateReportsApi, temp);
      if (isSuccess(result)) {
        yield put({
          type: 'getAggregateListSuccess',
          AggregateList: result.data
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
        namespace: 'TrendAnalysis',
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
    getAggregateListSuccess(state, { AggregateList }) {
      return {
        ...state,
        AggregateList
      };
    }
  }
};
