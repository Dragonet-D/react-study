import { fileTypeListApi, saveDataTypeApi, getEntryListApi, deleteFileTypeApi } from 'api/vade';
import { isSuccess } from 'utils/helpers';
import msg from 'utils/messageCenter';

const msgTitle = 'VADE Data Type';
export default {
  namespace: 'vadeDataType',
  state: {
    dataTypeList: {},
    entryList: []
  },
  effects: {
    *getDataTypeList({ payload }, { call, put }) {
      const result = yield call(fileTypeListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getDataTypeListSuccess',
          dataTypeList: result.data
        });
      } else {
        msg.error(result.message, msgTitle);
      }
    },
    *saveDataType({ payload }, { call }) {
      const result = yield call(saveDataTypeApi, payload);
      return result;
    },
    *delDataType({ payload }, { call }) {
      const result = yield call(deleteFileTypeApi, payload.ids);
      return result;
    },
    *getEntryList({ payload }, { call, put }) {
      const result = yield call(getEntryListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getEntryListSuccess',
          entryList: result.data
        });
      } else {
        msg.error(result.message, msgTitle);
      }
    }
  },
  reducers: {
    getDataTypeListSuccess(state, { dataTypeList }) {
      return {
        ...state,
        dataTypeList
      };
    },
    getEntryListSuccess(state, { entryList }) {
      return {
        ...state,
        entryList
      };
    }
  }
};
