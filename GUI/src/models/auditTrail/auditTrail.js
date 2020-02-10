import { getAuditTrailListApi, exportAudit, exportAll } from 'api/auditTrail';
import { isSuccess } from 'utils/helpers';

export default {
  namespace: 'auditTrail',
  state: {
    auditTrailList: {},
    auditTrailExportData: null,
    auditTrailExport: null
  },
  effects: {
    *callGetListSaga({ payload }, { call, put }) {
      const result = yield call(getAuditTrailListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'callGetListSagaSuccess',
          auditTrailList: result.data
        });
      }
    },
    *callGetAuditFileSaga({ payload }, { call, put }) {
      const result = yield call(exportAudit, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'callGetAuditFileSagaSuccess',
          auditTrailExport: result.data
        });
      }
    },
    *callExportAllSaga({ payload }, { call, put }) {
      const result = yield call(exportAll, payload);
      if (result) {
        yield put({
          type: 'callExportAllSagaSuccess',
          auditTrailExportData: result
        });
      }
    }
  },
  reducers: {
    callGetListSagaSuccess(state, { auditTrailList }) {
      return {
        ...state,
        auditTrailList
      };
    },
    callGetAuditFileSagaSuccess(state, { auditTrailExport }) {
      return {
        ...state,
        auditTrailExport
      };
    },
    callExportAllSagaSuccess(state, { auditTrailExportData }) {
      return {
        ...state,
        auditTrailExportData
      };
    },
    clearExportAuditTrailList(state) {
      return {
        ...state,
        auditTrailExportData: null
      };
    }
  }
};
