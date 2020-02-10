import {
  getEnginesListApi,
  installNewAppApi,
  changeActionApi,
  deleteOneAppApi,
  upgradeAppFileApi,
  getAppById,
  getVAGatewaysApi,
  updateAppInfo,
  getCodeByCodeCategoryApi
} from 'api/vap';
import { isSuccess } from 'utils/helpers';

export default {
  namespace: 'VAEngines',
  state: {
    namespace: 'VAEngines',
    enginesList: {},
    engineData: {},
    vaGatewayList: [],
    labelList: [],
    statusList: []
  },
  effects: {
    *getEnginesList({ payload }, { call, put }) {
      const result = yield call(getEnginesListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getEnginesListSuccess',
          enginesList: result.data
        });
      }
    },
    *createEngine({ payload }, { call }) {
      const result = yield call(installNewAppApi, payload);
      return result;
    },
    *updateEngine({ payload }, { call }) {
      const result = yield call(updateAppInfo, payload);
      return result;
    },
    *activationEngines({ payload }, { call }) {
      const result = yield call(changeActionApi, payload);
      return result;
    },
    *deleteEngines({ payload }, { call }) {
      const result = yield call(deleteOneAppApi, payload);
      return result;
    },
    *upgradeEngine({ payload }, { call }) {
      const result = yield call(upgradeAppFileApi, payload);
      return result;
    },
    *getEngineDetails({ payload }, { call, put }) {
      const result = yield call(getAppById, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getEngineDetailsSuccess',
          engineData: result.data
        });
      }
    },
    *getVaGateway({ payload }, { call, put }) {
      const result = yield call(getVAGatewaysApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getVaGatewaySuccess',
          vaGatewayList: result.data
        });
      }
    },
    *getLabelList({ payload }, { call, put }) {
      const result = yield call(getCodeByCodeCategoryApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getLabelListSuccess',
          labelList: result.data
        });
      }
    },
    *getEngineStatusList({ payload }, { call, put }) {
      const result = yield call(getCodeByCodeCategoryApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getEngineStatusListSuccess',
          statusList: result.data
        });
      }
    }
  },
  reducers: {
    getEnginesListSuccess(state, { enginesList }) {
      return {
        ...state,
        enginesList
      };
    },
    getEngineDetailsSuccess(state, { engineData }) {
      return {
        ...state,
        engineData
      };
    },
    getVaGatewaySuccess(state, { vaGatewayList }) {
      return {
        ...state,
        vaGatewayList
      };
    },
    getLabelListSuccess(state, { labelList }) {
      return {
        ...state,
        labelList
      };
    },
    getEngineStatusListSuccess(state, { statusList }) {
      return {
        ...state,
        statusList
      };
    }
  }
};
