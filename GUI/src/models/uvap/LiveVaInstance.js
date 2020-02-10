import {
  getLiveInstanceListApi,
  activationOfLiveVAInstanceApi,
  restartLiveVAInstanceApi,
  deleteLiveVAinstanceApi,
  getLiveInstanceDetailsApi,
  getEnginesListApi,
  getVAGatewaysApi,
  getUserUploadFilesApi,
  createLiveVAInstanceApi,
  updateLiveVAInstanceApi,
  getCodeByCodeCategoryApi
} from 'api/vap';
import { getFrsGroupsByAppIdApi } from 'api/vapFace';
import { initChannelsApi, getChannelDetailListApi } from 'api/vms';
import { isSuccess } from 'utils/helpers';

export default {
  namespace: 'LiveVaInstance',
  state: {
    namespace: 'LiveVaInstance',
    instanceData: { items: [] },
    instanceDetails: {},
    engineList: {},
    vaGateway: [],
    channelList: {},
    fileList: {},
    recordingData: {},
    frsGroups: [],
    statusList: [],
    engineStatusList: []
  },
  effects: {
    *getInstanceList({ payload }, { call, put }) {
      const result = yield call(getLiveInstanceListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getInstanceListSuccess',
          instanceData: result.data
        });
      }
    },
    *deactivateInstance({ payload }, { call }) {
      const result = yield call(activationOfLiveVAInstanceApi, payload);
      return result;
    },
    *activateInstance({ payload }, { call }) {
      const result = yield call(activationOfLiveVAInstanceApi, payload);
      return result;
    },
    *deleteInstance({ payload }, { call }) {
      const result = yield call(deleteLiveVAinstanceApi, payload);
      return result;
    },
    *restartInstance({ payload }, { call }) {
      const result = yield call(restartLiveVAInstanceApi, payload);
      return result;
    },
    *getInstanceDetails({ payload }, { call, put }) {
      const result = yield call(getLiveInstanceDetailsApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getInstanceDetailsSuccess',
          instanceDetails: result.data
        });
      }
    },
    *getEngineList({ payload }, { call, put }) {
      const result = yield call(getEnginesListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getEngineListSuccess',
          engineList: result.data
        });
      }
    },
    *getVaGateway({ payload }, { call, put }) {
      const result = yield call(getVAGatewaysApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getVaGatewaySuccess',
          vaGateway: result.data
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
    *getFileList({ payload }, { call, put }) {
      const result = yield call(getUserUploadFilesApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getFileListSuccess',
          fileList: result.data
        });
      }
    },
    *getRecordingList({ payload }, { call, put }) {
      const result = yield call(getChannelDetailListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getRecordingListSuccess',
          recordingData: result.data
        });
      }
    },
    *createNewInstance({ payload }, { call }) {
      const result = yield call(createLiveVAInstanceApi, payload);
      return result;
    },
    *updateInstance({ payload }, { call }) {
      const result = yield call(updateLiveVAInstanceApi, payload);
      return result;
    },
    *getFrsGroups({ payload }, { call, put }) {
      const result = yield call(getFrsGroupsByAppIdApi, payload);
      yield put({
        type: 'getFrsGroupsSuccess',
        frsGroups: result.data
      });
    },
    *getInstanceStatusList({ payload }, { call, put }) {
      const result = yield call(getCodeByCodeCategoryApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getInstanceStatusListSuccess',
          statusList: result.data
        });
      }
    },
    *getEngineStatusList({ payload }, { call, put }) {
      const result = yield call(getCodeByCodeCategoryApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getEngineStatusListSuccess',
          engineStatusList: result.data
        });
      }
    }
  },
  reducers: {
    resetInstanceDetailsState(state) {
      return {
        ...state,
        instanceDetails: {}
      };
    },
    getInstanceListSuccess(state, { instanceData }) {
      return {
        ...state,
        instanceData
      };
    },
    getInstanceDetailsSuccess(state, { instanceDetails }) {
      return {
        ...state,
        instanceDetails
      };
    },
    getEngineListSuccess(state, { engineList }) {
      return {
        ...state,
        engineList
      };
    },
    getVaGatewaySuccess(state, { vaGateway }) {
      return {
        ...state,
        vaGateway
      };
    },
    getChannelListSuccess(state, { channelList }) {
      return {
        ...state,
        channelList
      };
    },
    getFileListSuccess(state, { fileList }) {
      return {
        ...state,
        fileList
      };
    },
    getRecordingListSuccess(state, { recordingData }) {
      return {
        ...state,
        recordingData
      };
    },
    getFrsGroupsSuccess(state, { frsGroups }) {
      return {
        ...state,
        frsGroups
      };
    },
    getInstanceStatusListSuccess(state, { statusList }) {
      return {
        ...state,
        statusList
      };
    },
    getEngineStatusListSuccess(state, { engineStatusList }) {
      return {
        ...state,
        engineStatusList
      };
    }
  }
};
