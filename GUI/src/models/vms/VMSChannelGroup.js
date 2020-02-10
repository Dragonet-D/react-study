import {
  initChannelsApi,
  getChannelGroupTreeApi,
  createGroupApi,
  updateGroupApi,
  deleteChannelGroupApi,
  updateGroupMappingApi
  // getGroupDetailsByIdApi
} from 'api/vms';
import { isSuccess } from 'utils/helpers';
import msgCenter from 'utils/messageCenter';

export default {
  namespace: 'VMSChannelGroup',
  state: {
    namespace: 'VMSChannelGroup',
    addPageStatus: false,
    channelList: { items: [] },
    groupDetails: {},
    groupTree: [],
    channelTree: []
  },
  effects: {
    *changeAddPageStatus({ payload }, { put }) {
      yield put({
        type: 'setAddPageStatus',
        addPageStatus: payload.status
      });
    },
    *getChannelList({ payload }, { call, put }) {
      const result = yield call(initChannelsApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getChannelListSuccess',
          channelList: result.data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Video Channel Group');
      }
    },
    *getChannelTree({ payload }, { call, put }) {
      const result = yield call(getChannelGroupTreeApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getChannelTreeSuccess',
          channelTree: result.data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Video Channel Group');
      }
    },
    *getGroupDetailsById({ payload }, { put }) {
      // const result = yield call(getGroupDetailsByIdApi, payload);
      // if (isSuccess(result)) {
      //   yield put({
      //     type: 'getGroupDetailsByIdSuccess',
      //     groupDetails: result.data
      //   });
      // }
      yield put({
        type: 'getGroupDetailsByIdSuccess',
        groupDetails: payload
      });
    },
    *createNewGroup({ payload }, { call }) {
      const result = yield call(createGroupApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msgCenter.error(result.message, 'Video Channel Group');
      }
    },
    *updateGroup({ payload }, { call }) {
      const result = yield call(updateGroupApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msgCenter.error(result.message, 'Video Channel Group');
      }
    },
    *deleteGroup({ payload }, { call }) {
      const result = yield call(deleteChannelGroupApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msgCenter.error(result.message, 'Video Channel Group');
      }
    },
    *assignChannelToGroup({ payload }, { call }) {
      const result = yield call(updateGroupMappingApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msgCenter.error(result.message, 'Video Channel Group');
      }
    },
    *clearDetails({ payload }, { put }) {
      yield put({
        type: 'getGroupDetailsByIdSuccess',
        groupDetails: payload
      });
    }
  },
  reducers: {
    setAddPageStatus(state, { addPageStatus }) {
      return {
        ...state,
        addPageStatus
      };
    },
    getChannelListSuccess(state, { channelList }) {
      return {
        ...state,
        channelList
      };
    },
    getChannelTreeSuccess(state, { channelTree }) {
      return {
        ...state,
        channelTree: [channelTree]
      };
    },
    getGroupDetailsByIdSuccess(state, { groupDetails }) {
      return {
        ...state,
        groupDetails
      };
    }
  }
};
