import { getEnginesListApi, vapFrsFaceCompareApi } from 'api/vapFace';
import { isSuccess } from 'utils/helpers';
import msg from 'utils/messageCenter';

const faceCompare = 'Face Compare';

const initialState = {
  allTheAppsData: [],
  compareResultData: {}
};

export default {
  namespace: 'faceCompare',
  state: {
    ...initialState
  },
  effects: {
    *getAllApps({ payload }, { call, put }) {
      const result = yield call(getEnginesListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getAllAppsSuccess',
          allTheAppsData: result.data ? result.data.items : []
        });
      } else if (result) {
        msg.error(result.message, faceCompare);
      }
    },
    *vapFrsFaceCompare({ payload }, { call, put }) {
      const result = yield call(vapFrsFaceCompareApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'vapFrsFaceCompareSuccess',
          compareResultData: result.data
        });
      } else if (result) {
        msg.error(result.message, faceCompare);
      }
    }
  },
  reducers: {
    getAllAppsSuccess(state, { allTheAppsData }) {
      return {
        ...state,
        allTheAppsData
      };
    },
    vapFrsFaceCompareSuccess(state, { compareResultData }) {
      return {
        ...state,
        compareResultData
      };
    },
    clearFaceCompareInformation() {
      return initialState;
    }
  }
};
