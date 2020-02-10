import {
  getUserListApi,
  getUserRolesApi,
  saveUserRolesApi,
  addUserApi,
  updateUserApi,
  batchDeleteUsersApi
} from 'api/securityUserManagement';
import { isSuccess } from 'utils/helpers';
import msg from 'utils/messageCenter';
import { getUserId } from 'utils/getUserInformation';

const msgTitle = 'User Management';

export default {
  namespace: 'securityUserManagement',
  state: {
    userList: { items: [], pageNo: 0, pageSize: 0, totalNum: 0 },
    roleList: []
  },
  effects: {
    *getUserListData({ payload }, { call, put }) {
      const { obj } = payload;
      const result = yield call(getUserListApi, obj);
      if (isSuccess(result)) {
        yield put({
          type: 'getUserListDataSuccess',
          payload: {
            data: result.data
          }
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *getUserRoles({ payload }, { call, put }) {
      const { userId, id } = payload;
      const result = yield call(getUserRolesApi, userId, id);
      if (isSuccess(result)) {
        const data = result.data.map(item => {
          item.userId = id;
          return item;
        });
        yield put({
          type: 'getUserRolesSuccess',
          payload: { data }
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *assignRoleToUser({ payload }, { call }) {
      const { roleId } = payload;
      const result = yield call(saveUserRolesApi, roleId);
      if (isSuccess(result)) {
        msg.success(result.message, 'Assign Role');
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *createUser({ payload }, { call, put }) {
      const { user } = payload;
      const result = yield call(addUserApi, user);
      if (isSuccess(result)) {
        const userId = getUserId();
        msg.success(result.message, 'Create User');
        yield put({
          type: 'getUserListData',
          payload: {
            obj: { searchUserId: userId, pageNo: 0, pageSize: 5 }
          }
        });
        return result;
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *updateUser({ payload }, { call, put }) {
      const { user } = payload;
      const result = yield call(updateUserApi, user);
      if (isSuccess(result)) {
        const userId = getUserId();
        msg.success(result.message, 'Update User');
        const obj = {
          searchUserId: userId,
          pageNo: 0,
          pageSize: 5,
          ...user.filterObj
        };
        yield put({
          type: 'getUserListData',
          payload: { obj }
        });
        return result;
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *deleteUsers({ payload }, { call, put }) {
      const { users } = payload;
      const result = yield call(batchDeleteUsersApi, users);
      if (isSuccess(result)) {
        const userId = getUserId();
        msg.success(result.message || 'Deleted Successfully', 'Delete Users');
        const obj = Object.assign(
          { searchUserId: userId, pageNo: 0, pageSize: 5 },
          users.filterObj
        );
        yield put({
          type: 'getUserListData',
          payload: {
            obj
          }
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    }
  },
  reducers: {
    getUserListDataSuccess(state, { payload }) {
      return {
        ...state,
        userList: payload.data
      };
    },
    getUserRolesSuccess(state, { payload }) {
      return {
        ...state,
        roleList: payload.data
      };
    }
  }
};
