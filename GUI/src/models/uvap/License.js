/* eslint-disable no-unused-vars */
// import {
//   getApps,
//   getLicensesByAppIdApi,
//   deleteLicenseApi,
//   activateLicenseApi,
//   addNewLicenseApi,
//   updateLicenseApi,
//   getLicenseKeyApi,
//   downloadLicenseKeyApi
// } from 'api/vap';

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
  assignLicenseListApi
} from 'api/overview';
import { getVAGatewaysApi, getCodeByCodeCategoryApi } from 'api/vap';
import { isSuccess } from 'utils/helpers';

export default {
  namespace: 'License',
  state: {
    namespace: 'License',
    // enginesList: [],
    licenseList: [],
    licenseChart: {},
    vaGatewayList: [],
    engineStatusList: []
    // licenseDetails: {},
    // licenseKey: ''
  },
  effects: {
    // *getEnginesList({ payload }, { call, put }) {
    //   const result = yield call(getApps, payload);
    //   if (isSuccess(result)) {
    //     yield put({
    //       type: 'getEnginesListSuccess',
    //       enginesList: result.data
    //     });
    //   }
    // },
    *getLicenseChart({ payload }, { call, put }) {
      const result = yield call(licenseOverviewChartApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getLicenseChartSuccess',
          licenseChart: result.data
        });
      }
    },
    *getLicenseList({ payload }, { call, put }) {
      const result = yield call(licenseOverviewListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getLicenseListSuccess',
          licenseList: result.data
        });
      }
    },
    *getDistribution({ payload }, { call }) {
      const result = yield call(distributionApi, payload);
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
    *getVaGateway({ payload }, { call, put }) {
      const result = yield call(getVAGatewaysApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getVaGatewaySuccess',
          vaGatewayList: result.data
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
    // *deleteLicense({ payload }, { call }) {
    //   const result = yield call(deleteLicenseApi, payload);
    //   return result;
    // },
    // *licenseAction({ payload }, { call }) {
    //   const result = yield call(activateLicenseApi, payload);
    //   return result;
    // },
    // *createNewLicense({ payload }, { call }) {
    //   const result = yield call(addNewLicenseApi, payload);
    //   return result;
    // },
    // *updateLicense({ payload }, { call }) {
    //   const result = yield call(updateLicenseApi, payload);
    //   return result;
    // },
    // *getLicenseKey({ payload }, { call, put }) {
    //   const result = yield call(getLicenseKeyApi, payload);
    //   if (isSuccess(result)) {
    //     yield put({
    //       type: 'getLicenseKeySuccess',
    //       licenseKey: result.data
    //     });
    //   }
    // },
    // *downloadLicenseKey({ payload }, { call }) {
    //   const result = yield call(downloadLicenseKeyApi, payload);
    //   return result;
    // }
  },
  reducers: {
    // getEnginesListSuccess(state, { enginesList }) {
    //   return {
    //     ...state,
    //     enginesList
    //   };
    // },
    getLicenseChartSuccess(state, { licenseChart }) {
      return {
        ...state,
        licenseChart
      };
    },
    getLicenseListSuccess(state, { licenseList }) {
      return {
        ...state,
        licenseList
      };
    },
    getLabelListSuccess(state, { labelList }) {
      return {
        ...state,
        labelList
      };
    },
    getEngineStatusListSuccess(state, { engineStatusList }) {
      return {
        ...state,
        engineStatusList
      };
    },
    getVaGatewaySuccess(state, { vaGatewayList }) {
      return {
        ...state,
        vaGatewayList
      };
    }
    // getLicenseKeySuccess(state, { licenseKey }) {
    //   return {
    //     ...state,
    //     licenseKey
    //   };
    // }
  }
};
