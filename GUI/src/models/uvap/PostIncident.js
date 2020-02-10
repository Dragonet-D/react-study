/* eslint-disable no-unused-vars */
import {
  getIncidentApi,
  addIncidentApi,
  deleteIncidentApi,
  findInstancesByIncidentIdApi,
  updateIncidentApi,
  bindToJobvainstancesApi,
  bindToLivevainstancesApi,
  bindToServicevainstancesApi,
  getEventHandlersApi,
  getSearchReportsApi,
  getCodeByCodeCategoryApi,
  closeIncidentApi
} from 'api/vap';
import { isSuccess } from 'utils/helpers';

export default {
  namespace: 'PostIncident',
  state: {
    namespace: 'PostIncident',
    incidentList: {},
    incidentInstances: {},
    reportList: {},
    instanceStatusList: [],
    priorityList: [],
    engineStatusList: []
  },
  effects: {
    *getIncidentList({ payload }, { call, put }) {
      const result = yield call(getIncidentApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getIncidentListSuccess',
          incidentList: result.data
        });
      }
    },
    *createNewIncident({ payload }, { call }) {
      const result = yield call(addIncidentApi, payload);
      return result;
    },
    *deleteIncident({ payload }, { call }) {
      const result = yield call(deleteIncidentApi, payload);
      return result;
    },
    *getIncidentInstances({ payload }, { call, put }) {
      const result = yield call(findInstancesByIncidentIdApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getIncidentInstancesSuccess',
          incidentInstances: result.data
        });
      }
    },
    *updateIncident({ payload }, { call }) {
      const result = yield call(updateIncidentApi, payload);
      return result;
    },
    *createNewJobInstance({ payload }, { call }) {
      const result = yield call(bindToJobvainstancesApi, payload);
      return result;
    },
    *createNewLiveInstance({ payload }, { call }) {
      const result = yield call(bindToLivevainstancesApi, payload);
      return result;
    },
    *createNewServiceInstance({ payload }, { call }) {
      const result = yield call(bindToServicevainstancesApi, payload);
      return result;
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
    *getReportList({ payload }, { call, put }) {
      const result = yield call(getSearchReportsApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getReportListSuccess',
          reportList: result.data
        });
      }
    },
    *getInstanceStatusList({ payload }, { call, put }) {
      const result = yield call(getCodeByCodeCategoryApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getInstanceStatusListSuccess',
          instanceStatusList: result.data
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
    },
    *closeIncident({ payload }, { call, put }) {
      const result = yield call(closeIncidentApi, payload);
      return result;
    }
  },
  reducers: {
    getIncidentListSuccess(state, { incidentList }) {
      return {
        ...state,
        incidentList
      };
    },
    getIncidentInstancesSuccess(state, { incidentInstances }) {
      return {
        ...state,
        incidentInstances
      };
    },
    getReportTypeListSuccess(state, { reportTypeList }) {
      return {
        ...state,
        reportTypeList
      };
    },
    getReportListSuccess(state, { reportList }) {
      return {
        ...state,
        reportList
      };
    },
    getInstanceStatusListSuccess(state, { instanceStatusList }) {
      return {
        ...state,
        instanceStatusList
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
