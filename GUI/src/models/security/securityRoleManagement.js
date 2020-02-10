import {
  initRolesApi,
  addRoleApi,
  deleteRolesApi,
  updateRoleApi,
  roleFeaturelistApi,
  saveFeatureApi
} from 'api/securityRoleManagement';
import { isSuccess } from 'utils/helpers';
import { getUserId } from 'utils/getUserInformation';
import msg from 'utils/messageCenter';
import tools from './utils';

const msgTitle = 'Role Management';

export default {
  namespace: 'securityRoleManagement',
  state: {
    namespace: 'securityRoleManagement',
    roleData: [],
    featureData: [],
    featureTreeData: [],
    addRoleIsSuccess: false
  },
  effects: {
    *getRoleData({ payload }, { call, put }) {
      const { obj } = payload;
      const result = yield call(initRolesApi, obj);
      if (isSuccess(result)) {
        yield put({
          type: 'getRoleDataSuccess',
          payload: {
            data: result.data
          }
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *createRole({ payload }, { call, put }) {
      const { role } = payload;
      const result = yield call(addRoleApi, role);
      if (isSuccess(result)) {
        yield put({
          type: 'getRoleData',
          payload: {
            obj: { userId: getUserId(), pageNo: 0, pageSize: 5 }
          }
        });
        yield put({
          type: 'setAddRoleToSuccess',
          payload: { data: false }
        });
        msg.success(result.message, 'Create Role');
        return result;
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *updateRole({ payload }, { call, put }) {
      const { role, filterObj } = payload;
      const result = yield call(updateRoleApi, role);
      if (isSuccess(result)) {
        const obj = Object.assign(
          { userId: role.lastUpdatedId, pageNo: 0, pageSize: 5 },
          filterObj
        );
        yield put({
          type: 'getRoleData',
          payload: {
            obj
          }
        });
        yield put({
          type: 'setAddRoleToSuccess',
          payload: { data: false }
        });
        msg.success(result.message, 'Update Role');
        return result;
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *deleteRoles({ payload }, { call, put }) {
      const { LastUpDatedId, roleIds, userId, roleNames, filterObj } = payload;
      const result = yield call(deleteRolesApi, LastUpDatedId, roleIds, roleNames);
      if (isSuccess(result)) {
        const obj = Object.assign({ userId, pageNo: 0, pageSize: 5 }, filterObj);
        yield put({
          type: 'getRoleData',
          payload: {
            obj
          }
        });
        yield put({
          type: 'setAddRoleToSuccess',
          payload: { data: false }
        });
        msg.success(result.message, 'Delete Role');
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *getFeatureData({ payload }, { call, put }) {
      const { roleId, userId } = payload;
      const result = yield call(roleFeaturelistApi, roleId, userId);
      if (isSuccess(result)) {
        const data = tools.getTreeData(result.data);
        yield put({
          type: 'getFeatureDataSuccess',
          payload: {
            data: { features: result.data, featuresTree: data }
          }
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *saveFeature({ payload }, { call }) {
      const { features } = payload;
      const result = yield call(saveFeatureApi, features);
      if (isSuccess(result)) {
        msg.success(result.message, 'Assign Feature');
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *searchFeature({ payload }, { call, put }) {
      const { featureName, roleId, userId } = payload;
      const result = yield call(roleFeaturelistApi, roleId, userId);
      if (result.status === 200) {
        const data = tools.searchFeatures(featureName, result.data);
        const treeData = tools.getTreeData(data);
        yield put({
          type: 'getFeatureDataSuccess',
          payload: {
            data: { features: data, featuresTree: treeData }
          }
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    }
  },
  reducers: {
    getRoleDataSuccess(state, { payload }) {
      return {
        ...state,
        roleData: payload.data
      };
    },
    setAddRoleToSuccess(state, { payload }) {
      return {
        ...state,
        addRoleIsSuccess: payload.data
      };
    },
    getFeatureDataSuccess(state, { payload }) {
      return {
        ...state,
        featureData: payload.data.features,
        featureTreeData: payload.data.featuresTree
      };
    }
  }
};
