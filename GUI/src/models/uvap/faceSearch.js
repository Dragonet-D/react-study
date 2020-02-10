import {
  getTreeDataAPI,
  getFrsGroupsApi,
  vapFrsFaceSearchApi,
  vapFrsEventsSearchApi,
  vapFrsGetPersonImagesApi,
  getChannelGroupTreeApi,
  vapFrsExportSearchDataApi,
  getChannelByChannelGroupId,
  getChannelList
} from 'api/vapFace';
import _ from 'lodash';
import { isSuccess } from 'utils/helpers';
import { formatFeatureLayerNormalData } from 'commons/map/utils';
import msg from 'utils/messageCenter';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import { getStartTime, getEndTime } from 'utils/dateHelper';

const faceSearch = 'Face Search';

const initialState = {
  channelTreeData: [],
  groupsData: [],
  faceSearchFacesResult: [],
  eventsDataList: {},
  personImages: [],
  exportSearchResultData: null,
  searchParameters: {
    personId: '',
    data: [
      {
        field: 'personId',
        operator: 'eq',
        value: {}
      }
    ],
    page: {
      index: PAGE_NUMBER,
      size: PAGE_SIZE,
      sort: 'desc'
    },
    sources: [
      {
        provider: 'url',
        deviceProviderId: 'string',
        deviceId: 'string',
        deviceChannelId: 'string',
        fileId: 'string',
        location: {
          address: 'string',
          latitude: 0,
          longitude: 0
        },
        url: 'string'
      }
    ],
    time: {
      from: getStartTime(),
      to: getEndTime()
    },
    type: 'vap.event.frs.person',
    vaInstances: [
      {
        id: '',
        type: 'LIVE_VA',
        appId: ''
      }
    ]
  }
};

export default {
  namespace: 'faceSearch',
  state: {
    ...initialState
  },
  effects: {
    *getTreeData({ payload }, { call, put }) {
      const result = yield call(getTreeDataAPI, payload);
      if (isSuccess(result)) {
        const channelData = formatFeatureLayerNormalData(result.data);
        yield put({
          type: 'getTreeDataSuccess',
          channelTreeData: channelData
        });
      } else if (result) {
        msg.error(result.message, faceSearch);
      }
    },
    *getFrsGroups({ payload }, { call, put }) {
      const result = yield call(getFrsGroupsApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getFrsGroupsSuccess',
          groupsData: result.data
        });
      } else if (result) {
        msg.error(result.message, faceSearch);
      }
    },
    *vapFrsFaceSearch({ payload }, { call, put }) {
      const result = yield call(vapFrsFaceSearchApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'vapFrsFaceSearchSuccess',
          faceSearchFacesResult: result.data
        });
      } else if (result) {
        msg.error(result.message, faceSearch);
      }
      return result;
    },
    *vapFrsEventsSearch({ payload }, { call, put }) {
      const result = yield call(vapFrsEventsSearchApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'vapFrsEventsSearchSuccess',
          eventsDataList: result.data
        });
      } else if (result) {
        msg.error(result.message, faceSearch);
      }
    },
    *vapFrsGetPersonImages({ payload }, { call, put }) {
      const result = yield call(vapFrsGetPersonImagesApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'vapFrsGetPersonImagesSuccess',
          personImages: result.data
        });
      } else if (result) {
        msg.error(result.message, faceSearch);
      }
      return result;
    },
    *getChannelGroup({ payload }, { call }) {
      const result = yield call(getChannelGroupTreeApi, payload);
      if (isSuccess(result)) {
        return result.data;
      } else if (result) {
        msg.error(result.message, faceSearch);
        return {};
      }
    },
    *vapFrsExportSearchData({ payload }, { call, put }) {
      const result = yield call(vapFrsExportSearchDataApi, payload);
      if (result && result.size > 0) {
        yield put({
          type: 'vapFrsExportSearchDataSuccess',
          exportSearchResultData: result
        });
      } else if (result) {
        msg.error(result.message, faceSearch);
      }
    },
    *getChannelByChannelGroupId({ payload }, { call }) {
      const result = yield call(getChannelByChannelGroupId, payload);
      if (isSuccess(result)) {
        return result.data;
      } else if (result) {
        // msg.error(result.message, faceSearch);
        return {};
      }
    },
    *channelList({ payload }, { call }) {
      const result = yield call(getChannelList, payload);
      if (isSuccess(result)) {
        return result.data;
      } else if (result) {
        msg.error(result.message, faceSearch);
        return {};
      }
    }
  },
  reducers: {
    getTreeDataSuccess(state, { channelTreeData }) {
      return {
        ...state,
        channelTreeData
      };
    },
    getFrsGroupsSuccess(state, { groupsData }) {
      return {
        ...state,
        groupsData
      };
    },
    vapFrsFaceSearchSuccess(state, { faceSearchFacesResult }) {
      return {
        ...state,
        faceSearchFacesResult
      };
    },
    vapFrsEventsSearchSuccess(state, { eventsDataList }) {
      return {
        ...state,
        eventsDataList
      };
    },
    changeSearchParameters(state, { payload }) {
      const { searchParameters } = state;
      return {
        ...state,
        searchParameters: _.merge(searchParameters, payload)
      };
    },
    initEventsParameters(state) {
      return {
        ...state,
        ...initialState
      };
    },
    vapFrsGetPersonImagesSuccess(state, { personImages }) {
      return {
        ...state,
        personImages
      };
    },
    clearFaceSearchFacesResult(state) {
      return {
        ...state,
        faceSearchFacesResult: [],
        eventsDataList: {}
      };
    },
    vapFrsExportSearchDataSuccess(state, { exportSearchResultData }) {
      return {
        ...state,
        exportSearchResultData
      };
    },
    clearVapFrsExportSearchData(state) {
      return {
        ...state,
        exportSearchResultData: null
      };
    }
  }
};
