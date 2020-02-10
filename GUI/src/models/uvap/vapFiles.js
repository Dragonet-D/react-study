import {
  getUserUploadFilesApi,
  getFileDetailsApi,
  updateUserUploadFilesApi,
  deleteUserUploadFilesApi,
  downloadUserUploadFilesApi,
  createUserUploadFilesApi
} from 'api/vap';
import { isSuccess } from 'utils/helpers';

export default {
  namespace: 'vapFiles',
  state: {
    namespace: 'vapFiles',
    fileList: {},
    fileDetails: {},
    fileBlob: new Blob()
  },
  effects: {
    *getFilesList({ payload }, { call, put }) {
      const result = yield call(getUserUploadFilesApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getFilesListSuccess',
          fileList: result.data
        });
      }
    },
    *getFileDetails({ payload }, { call, put }) {
      const result = yield call(getFileDetailsApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getFileDetailsSuccess',
          fileDetails: result.data
        });
      }
    },
    *updateFileDetails({ payload }, { call }) {
      const result = yield call(updateUserUploadFilesApi, payload);
      return result;
    },
    *deleteFile({ payload }, { call }) {
      const result = yield call(deleteUserUploadFilesApi, payload);
      return result;
    },
    *downloadFile({ payload }, { call, put }) {
      const result = yield call(downloadUserUploadFilesApi, payload);
      yield put({
        type: 'getFileBlobSuccess',
        fileBlob: result
      });
    },
    *uploadFile({ payload }, { call }) {
      const result = yield call(createUserUploadFilesApi, payload);
      return result;
    }
  },
  reducers: {
    getFilesListSuccess(state, { fileList }) {
      return {
        ...state,
        fileList
      };
    },
    getFileDetailsSuccess(state, { fileDetails }) {
      return {
        ...state,
        fileDetails
      };
    },
    getFileBlobSuccess(state, { fileBlob }) {
      return {
        ...state,
        fileBlob
      };
    },
    resetVapFileState() {
      return {
        namespace: 'vapFiles',
        fileList: [],
        fileDetails: {},
        fileBlob: new Blob()
      };
    }
  }
};
