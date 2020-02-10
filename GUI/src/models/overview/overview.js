import {
  getOverviewSummaryApi,
  getCameraUsageApi,
  getUserStateApi,
  instanceOverviewChartApi,
  instanceOverviewListApi,
  usageOverviewChartApi,
  usageOverviewListApi,
  licenseOverviewChartApi,
  licenseOverviewListApi,
  distributionApi,
  disconneCamApi,
  disconnectUserApi,
  uploadLicenseApi,
  assignLicenseListApi,
  getSystemStatusApi
} from 'api/overview';

import { getCodeByCodeCategoryApi, getVAGatewaysApi } from 'api/vap';
import { getVideoDeviceListApi } from 'api/vms';
import { isSuccess } from 'utils/helpers';
import { search } from 'utils/utils';
import msgCenter from 'utils/messageCenter';

export default {
  namespace: 'overview',
  state: {
    overviewUserInfo: {},
    licenseChart: {},
    instanceOverviewChart: {},
    VAIRUsageChart: {},
    systemStatus: {},
    engineStatusList: [],
    vaGatewayList: []
  },
  effects: {
    *getOverviewSummary({ payload }, { call, put }) {
      const result = yield call(getOverviewSummaryApi, payload);
      if (!result) return;
      if (isSuccess(result)) {
        const res = yield call(getVideoDeviceListApi, {
          userId: payload,
          pageNo: 0,
          pageSize: 5
        });
        if (!result) return;
        if (isSuccess(result)) {
          yield put({
            type: 'getOverviewSummarySuccess',
            overviewUserInfo: {
              ...result.data,
              cameraUsage: { ...result.data.cameraUsage, totalDevice: res.data.totalNum }
            }
          });
        } else {
          yield put({
            type: 'getOverviewSummarySuccess',
            overviewUserInfo: result.data
          });
        }
      } else {
        msgCenter.error(result.message, '');
      }
    },
    *getCameraUsage({ payload }, { call }) {
      const result = yield call(getCameraUsageApi, payload);
      result.data = search(result.data, payload.param);
      return result;
    },
    *getUserState({ payload }, { call }) {
      const result = yield call(getUserStateApi, payload);
      // result.data = search(result.data, payload.param);
      return result;
    },
    *getLicenseChart({ payload }, { call, put }) {
      const result = yield call(licenseOverviewChartApi, payload);
      if (!result) return;
      if (isSuccess(result)) {
        yield put({
          type: 'getLicenseChartSuccess',
          licenseChart: result.data
        });
      } else {
        msgCenter.error(result.message, '');
      }
    },
    *getLicenseList({ payload }, { call }) {
      const result = yield call(licenseOverviewListApi, payload);
      return result;
    },
    *getInstanceOverviewChart({ payload }, { call, put }) {
      const result = yield call(instanceOverviewChartApi, payload);
      if (!result) return;
      if (isSuccess(result)) {
        yield put({
          type: 'getInstanceOverviewChartSuccess',
          instanceOverviewChart: result.data
        });
      } else {
        msgCenter.error(result.message, '');
      }
    },
    *getInstanceOverviewList({ payload }, { call }) {
      const result = yield call(instanceOverviewListApi, payload);
      return result;
    },
    *getVAInstanceRUChart({ payload }, { call, put }) {
      const result = yield call(usageOverviewChartApi, payload);
      if (!result) return;
      if (isSuccess(result)) {
        yield put({
          type: 'getVAInstanceRUChartSuccess',
          VAIRUsageChart: result.data
        });
      } else {
        msgCenter.error(result.message, '');
      }
    },
    *getVAInstanceRUList({ payload }, { call }) {
      const result = yield call(usageOverviewListApi, payload);
      return result;
    },
    *getDistribution({ payload }, { call }) {
      const result = yield call(distributionApi, payload);
      return result;
    },
    *disconnectCam({ payload }, { call }) {
      const result = yield call(disconneCamApi, payload);
      return result;
    },
    *disconnectUser({ payload }, { call }) {
      const result = yield call(disconnectUserApi, payload);
      return result;
    },
    *uploadLicense({ payload }, { call }) {
      const result = yield call(uploadLicenseApi, payload);
      return result;
    },
    *saveDistribution({ payload }, { call }) {
      const result = yield call(assignLicenseListApi, payload);
      return result;
    },
    *getSystemStatus({ payload }, { call, put }) {
      const result = yield call(getSystemStatusApi, payload);
      if (!result) return;
      if (isSuccess(result)) {
        yield put({
          type: 'getSystemStatusSuccess',
          data: result.data
        });
      } else {
        msgCenter.error(result.message, '');
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
    *getVaGateway({ payload }, { call, put }) {
      const result = yield call(getVAGatewaysApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getVaGatewaySuccess',
          vaGatewayList: result.data
        });
      }
    }
  },
  reducers: {
    getOverviewSummarySuccess(state, { overviewUserInfo }) {
      return {
        ...state,
        overviewUserInfo
      };
    },
    getLicenseChartSuccess(state, { licenseChart }) {
      return {
        ...state,
        licenseChart
      };
    },
    getInstanceOverviewChartSuccess(state, { instanceOverviewChart }) {
      return {
        ...state,
        instanceOverviewChart
      };
    },
    getVAInstanceRUChartSuccess(state, { VAIRUsageChart }) {
      return {
        ...state,
        VAIRUsageChart
      };
    },
    getSystemStatusSuccess(state, { data }) {
      return {
        ...state,
        systemStatus: data
      };
    },
    getVaGatewaySuccess(state, { vaGatewayList }) {
      return {
        ...state,
        vaGatewayList
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
