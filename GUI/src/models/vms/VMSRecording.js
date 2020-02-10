import { isSuccess } from 'utils/helpers';
import {
  initRecordingChannelsApi,
  getDownloadRecordingListApi,
  getChannelDetailListApi,
  exportRecordingDownloadPostApi,
  recordingTaskListApi,
  uploadRecordingApi,
  batchDeleteApi,
  downloadApi
} from 'api/vms';
import msgCenter from 'utils/messageCenter';
// import tools from 'utils/treeTools';

export default {
  namespace: 'VMSRecording',
  state: {
    channelDataSource: {},
    recordingDataSource: { recordPeriod: [] },
    downloadDataSource: []
  },
  effects: {
    *getChannel({ payload }, { call, put }) {
      const result = yield call(initRecordingChannelsApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getChannelSuccess',
          channelDataSource: result.data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Recording Management');
      }
    },
    *getRecords({ payload }, { call, put }) {
      const result = yield call(getChannelDetailListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getRecordsSuccess',
          recordingDataSource: result.data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Recording Management');
      }
      return result;
    },
    *getDownloadData({ payload }, { call, put }) {
      const result = yield call(getDownloadRecordingListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getDownloadDataSuccess',
          downloadDataSource: result.data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Recording Management');
      }
    },
    *fileUpload({ payload }, { call }) {
      const result = yield call(uploadRecordingApi, payload);
      if (isSuccess(result)) {
        msgCenter.success(result.message, 'Recording Management');
        return result;
      } else if (result) {
        msgCenter.error(result.message, 'Recording Management');
      }
    },
    *exportRecording({ payload }, { call }) {
      const result = yield call(exportRecordingDownloadPostApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msgCenter.error(result.message, 'Recording Management');
      }
    },
    *getTaskList({ payload }, { call, put }) {
      const result = yield call(recordingTaskListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getTaskListSuccess',
          taskList: result.data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Recording Management');
      }
    },
    *viewTaskDelete({ payload, getTaskList }, { call, put }) {
      const result = yield call(batchDeleteApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'viewTaskDeleteSuccess'
        });
        const getList = yield call(recordingTaskListApi, getTaskList);
        if (isSuccess(getList)) {
          yield put({
            type: 'getTaskListSuccess',
            taskList: getList.data
          });
        } else if (result) {
          msgCenter.error(result.message, 'Recording Management');
        }
      } else if (result) {
        msgCenter.error(result.message, 'Recording Management');
      }
    },
    *downloadRecording({ payload }, { call, put }) {
      const result = yield call(downloadApi, payload);

      if (result.status && result.status !== 200) {
        msgCenter.error(result.message);
      } else {
        yield put({
          type: 'downloadRecordingSuccess',
          exportData: result
        });
      }
    }
  },
  reducers: {
    getChannelSuccess(state, { channelDataSource }) {
      return {
        ...state,
        channelDataSource
      };
    },
    getRecordsSuccess(state, { recordingDataSource }) {
      return {
        ...state,
        recordingDataSource
      };
    },
    getDownloadDataSuccess(state, { downloadDataSource }) {
      return {
        ...state,
        downloadDataSource
      };
    },
    getTaskListSuccess(state, { taskList }) {
      return {
        ...state,
        taskList
      };
    },
    downloadRecordingSuccess(state, { exportData }) {
      return {
        ...state,
        exportData
      };
    },
    clearExportDataActionData(state) {
      return {
        ...state,
        exportData: null
      };
    }
  }
};
