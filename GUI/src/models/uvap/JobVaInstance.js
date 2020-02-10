import {
  getJobInstanceListApi,
  startJobVAInstanceApi,
  stopJobVAInstanceApi,
  deleteJobVAinstanceApi,
  getJobInstanceDetailsApi,
  getEnginesListApi,
  getVAGatewaysApi,
  getUserUploadFilesApi,
  createJobVAInstanceApi,
  updateJobVAInstanceApi,
  downloadUserUploadFilesApi,
  getCodeByCodeCategoryApi
} from 'api/vap';
import { getFrsGroupsByAppIdApi } from 'api/vapFace';
import { initChannelsApi, getChannelDetailListApi } from 'api/vms';
import { isSuccess } from 'utils/helpers';

export default {
  namespace: 'JobVaInstance',
  state: {
    namespace: 'JobVaInstance',
    instanceData: { items: [] },
    instanceDetails: {},
    engineList: {},
    vaGateway: [],
    channelList: {},
    fileList: {},
    recordingData: {},
    fileNode: {},
    frsGroups: [],
    statusList: [],
    priorityList: [],
    engineStatusList: []
  },
  effects: {
    *getInstanceList({ payload }, { call, put }) {
      const result = yield call(getJobInstanceListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getInstanceListSuccess',
          instanceData: result.data
        });
      }
    },
    *startInstance({ payload }, { call }) {
      const result = yield call(startJobVAInstanceApi, payload);
      return result;
    },
    *stopInstance({ payload }, { call }) {
      const result = yield call(stopJobVAInstanceApi, payload);
      return result;
    },
    *deleteInstance({ payload }, { call }) {
      const result = yield call(deleteJobVAinstanceApi, payload);
      return result;
    },
    *getInstanceDetails({ payload }, { call, put }) {
      const result = yield call(getJobInstanceDetailsApi, payload);
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
      const result = yield call(createJobVAInstanceApi, payload);
      return result;
    },
    *updateInstance({ payload }, { call }) {
      const result = yield call(updateJobVAInstanceApi, payload);
      return result;
    },
    *getFileBlob({ payload }, { call, put }) {
      const result = yield call(downloadUserUploadFilesApi, payload);
      const urlCreator = window.URL || window.webkitURL;
      const url = urlCreator.createObjectURL(result);
      yield put({
        type: 'getFileBlobSuccess',
        fileNode: { url, id: payload.id, name: result.fileName }
      });
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
    *getInstancePriorityList({ payload }, { call, put }) {
      const result = yield call(getCodeByCodeCategoryApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getInstancePriorityListSuccess',
          priorityList: result.data
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
        instanceDetails: {},
        fileNode: {}
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
    getFileBlobSuccess(state, { fileNode }) {
      return {
        ...state,
        fileNode
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
    getInstancePriorityListSuccess(state, { priorityList }) {
      return {
        ...state,
        priorityList
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
