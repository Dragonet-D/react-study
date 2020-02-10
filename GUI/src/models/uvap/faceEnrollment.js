import {
  getFrsGroupsApi,
  getEnginesListApi,
  vapFrsAddGroupsApi,
  vapFrsUpdateGroupsApi,
  vapFrsDeleteGroupApi,
  vapFrsAddPersonApi,
  vapFrsUpdatePersonAssignedGroupApi,
  vapFrsGetPersonsApi,
  vapFrsUpdatePersonApi,
  vapFrsDeletePersonApi,
  vapFrsGetPersonImagesApi,
  vapFrsUpdatePersonImagesApi,
  vapFrsDeletePersonImageApi,
  vapFrsDownloadMultipleFRSTemplateApi,
  vapFrsAddPersonsFileOfZipApi,
  vapFrsUploadRecordListApi
} from 'api/vapFace';
import { isSuccess } from 'utils/helpers';
import msg from 'utils/messageCenter';

const faceEnrollment = 'Face Enrollment';
const initialState = {
  groupsData: [],
  groupsDataTable: [],
  searchGroupsData: [],
  editUserInformation: {},
  allTheAppsData: [],
  personsList: {},
  personImages: [],
  choseGroupData: {},
  searchPersonInformation: {},
  batchFileData: null
};

export default {
  namespace: 'faceEnrollment',
  state: {
    ...initialState
  },
  effects: {
    *getFrsGroups({ payload }, { call, put }) {
      const result = yield call(getFrsGroupsApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getFrsGroupsSuccess',
          groupsData: result.data
        });
      } else if (result) {
        msg.error(result.message, faceEnrollment);
      }
    },
    *getFrsGroupsTable({ payload }, { call, put }) {
      const result = yield call(getFrsGroupsApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getFrsGroupsTableSuccess',
          groupsDataTable: result.data
        });
      } else if (result) {
        msg.error(result.message, faceEnrollment);
      }
    },
    *searchFrsGroups({ payload }, { call, put }) {
      const result = yield call(getFrsGroupsApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'searchFrsGroupsSuccess',
          searchGroupsData: result.data
        });
      } else if (result) {
        msg.error(result.message, faceEnrollment);
      }
    },
    *getAllApps({ payload }, { call, put }) {
      const result = yield call(getEnginesListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getAllAppsSuccess',
          allTheAppsData: result.data ? result.data.items : []
        });
      } else if (result) {
        msg.error(result.message, faceEnrollment);
      }
    },
    *vapFrsAddGroups({ payload }, { call }) {
      return yield call(vapFrsAddGroupsApi, payload);
    },
    *vapFrsUpdateGroups({ payload }, { call }) {
      return yield call(vapFrsUpdateGroupsApi, payload);
    },
    *vapFrsDeleteGroup({ payload }, { call }) {
      return yield call(vapFrsDeleteGroupApi, payload);
    },
    *vapFrsAddPerson({ payload }, { call }) {
      return yield call(vapFrsAddPersonApi, payload);
    },
    *vapFrsUpdatePersonAssignedGroup({ payload }, { call }) {
      return yield call(vapFrsUpdatePersonAssignedGroupApi, payload);
    },
    *vapFrsGetPersons({ payload }, { call, put }) {
      const result = yield call(vapFrsGetPersonsApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'vapFrsGetPersonsSuccess',
          personsList: result.data
        });
      } else if (result) {
        msg.error(result.message, faceEnrollment);
      }
    },
    *vapFrsUpdatePerson({ payload }, { call }) {
      return yield call(vapFrsUpdatePersonApi, payload);
    },
    *vapFrsDeletePerson({ payload }, { call }) {
      return yield call(vapFrsDeletePersonApi, payload);
    },
    *vapFrsGetPersonImages({ payload }, { call, put }) {
      const result = yield call(vapFrsGetPersonImagesApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'vapFrsGetPersonImagesSuccess',
          personImages: result.data
        });
      } else if (result) {
        msg.error(result.message, faceEnrollment);
      }
    },
    *vapFrsUpdatePersonImages({ payload }, { call }) {
      return yield call(vapFrsUpdatePersonImagesApi, payload);
    },
    *vapFrsDeletePersonImage({ payload }, { call }) {
      return yield call(vapFrsDeletePersonImageApi, payload);
    },
    *vapFrsDownloadMultipleFRSTemplate(_, { call, put }) {
      const result = yield call(vapFrsDownloadMultipleFRSTemplateApi);
      if (result) {
        yield put({
          type: 'vapFrsDownloadMultipleFRSTemplateSuccess',
          batchFileData: result
        });
      } else {
        msg.error('Download Failed', faceEnrollment);
      }
    },
    *vapFrsAddPersonsFileOfZip({ payload }, { call }) {
      return yield call(vapFrsAddPersonsFileOfZipApi, payload);
    },
    *vapFrsUploadRecordList({ payload }, { call }) {
      return yield call(vapFrsUploadRecordListApi, payload);
    }
  },
  reducers: {
    getFrsGroupsSuccess(state, { groupsData }) {
      return {
        ...state,
        groupsData
      };
    },
    getFrsGroupsTableSuccess(state, { groupsDataTable }) {
      return {
        ...state,
        groupsDataTable
      };
    },
    searchFrsGroupsSuccess(state, { searchGroupsData }) {
      return {
        ...state,
        searchGroupsData
      };
    },
    editUserInformation(state, { payload }) {
      return {
        ...state,
        editUserInformation: payload
      };
    },
    getAllAppsSuccess(state, { allTheAppsData }) {
      return {
        ...state,
        allTheAppsData
      };
    },
    vapFrsGetPersonsSuccess(state, { personsList }) {
      return {
        ...state,
        personsList
      };
    },
    vapFrsGetPersonImagesSuccess(state, { personImages }) {
      return {
        ...state,
        personImages
      };
    },
    handleChoseGroupData(state, { payload }) {
      return {
        ...state,
        choseGroupData: payload
      };
    },
    handleSearchPersonInformation(state, { payload }) {
      return {
        ...state,
        searchPersonInformation: payload
      };
    },
    clear() {
      return initialState;
    },
    vapFrsDownloadMultipleFRSTemplateSuccess(state, { batchFileData }) {
      return {
        ...state,
        batchFileData
      };
    },
    clearVapFrsDownloadMultipleFRSTemplate(state) {
      return {
        ...state,
        batchFileData: null
      };
    }
  }
};
