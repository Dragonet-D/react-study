import {
  getUserGroupTreeApi,
  getUserGroupApi,
  searchUserGroupTreeApi,
  getDomainListApi,
  getUserGroupUserList,
  getAllDeviceApi,
  findUserGroupByIdApi,
  saveUserGroupApi,
  saveDeviceToGroupApi,
  addUserGroupApi,
  batchDeleteUserGroup,
  saveGroupWDomainApi,
  initModelsApi,
  getEnginesListApi,
  assignEngineToGroupApi
} from 'api/securityUserGroup';
import msg from 'utils/messageCenter';
import { isSuccess } from 'utils/helpers';
import tools from 'utils/treeTools';
import { getUserId } from 'utils/getUserInformation';
import { getCodeByCodeCategoryApi } from 'api/vap';
// import dataTools from './utils';

const msgTitle = 'User Group';
const initialState = {
  userData: {},
  channelData: {},
  vaEngineData: {},

  keyWord: '',
  groupDetail: {},
  checkedUsers: [],
  groupList: [],
  modelsList: [],
  isVisibility: {},
  channelsSelected: [],
  isAdmin: '',
  currentGroupId: '',
  cuttentGroupName: '',
  isAdd: false,
  domainList: ['Please Select']
};
export default {
  namespace: 'securityUserGroup',
  state: {
    allUsers: [],
    allChannels: [],
    userGroupTree: [],
    treeList: [],
    enginesList: {},
    labelList: [],
    statusList: [],
    ...initialState
  },
  effects: {
    *getTree({ payload }, { call, put }) {
      const { userId } = payload;
      const result = yield call(getUserGroupTreeApi, userId);
      if (isSuccess(result)) {
        const data = tools.formatUserGroupList({
          data: result.data
        });
        yield put({
          type: 'getTreeSuccess',
          payload: {
            data
          }
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *searchTree({ payload }, { call, put }) {
      const { userId, filter } = payload;
      const result = yield call(searchUserGroupTreeApi, userId, filter);
      if (result && result.status === 200) {
        const data = tools.formatUserGroupList({
          data: result.data
        });
        yield put({
          type: 'searchTreeSuccess',
          payload: {
            data
          }
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *getListGroup({ payload }, { call, put }) {
      const { userId } = payload;
      const result = yield call(getUserGroupApi, userId);
      if (isSuccess(result)) {
        yield put({
          type: 'getListGroupSuccess',
          payload: {
            data: result.data
          }
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *getDomainList({ payload }, { call, put }) {
      const { userId } = payload;
      const result = yield call(getDomainListApi, userId);
      if (isSuccess(result)) {
        yield put({
          type: 'getDomainListSuccess',
          payload: {
            data: result.data
          }
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *getUserList({ payload }, { call, put }) {
      const result = yield call(getUserGroupUserList, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getUserListSuccess',
          payload: {
            data: result.data
          }
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *getGroupDetail({ payload }, { call, put }) {
      const result = yield call(findUserGroupByIdApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getGroupDetailSuccess',
          payload: {
            data: result.data
          }
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *getChannelList({ payload }, { call, put }) {
      const result = yield call(getAllDeviceApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getChannelListSuccess',
          payload: {
            data: result.data.items
          }
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *assignUserToGroup({ payload }, { call }) {
      const { users, descriptionFields } = payload;
      const object = { descriptionFields, users };
      const result = yield call(saveUserGroupApi, object);
      // if (isSuccess(result)) {
      //   msg.success(result.message, 'Assign User');
      //   yield put({
      //     type: 'getUserList',
      //     payload: {
      //       searchUserId: userId,
      //       groupId,
      //       pageNo: 0,
      //       pageSize: 5
      //     }
      //   });
      // } else if (result) {
      //   msg.error(result.message, msgTitle);
      // }
      return result;
    },
    *assignChannelToGroup({ payload }, { call }) {
      const { channels } = payload;
      const result = yield call(saveDeviceToGroupApi, channels);
      // if (isSuccess(result)) {
      //   msg.success(result.message, 'Assign Channel');
      //   const obj = {
      //     uid: userid,
      //     groupId: id,
      //     pageNo,
      //     pageSize
      //   };
      //   yield put({
      //     type: 'getChannelList',
      //     payload: {
      //       object: obj
      //     }
      //   });
      // } else if (result) {
      //   msg.error(result.message, msgTitle);
      // }
      return result;
    },
    *updateUserGroup({ payload }, { call, put }) {
      const { detail, userid, mk } = payload;
      const result = yield call(addUserGroupApi, detail, mk);
      if (isSuccess(result)) {
        msg.success(result.message, 'Update User Group');
        yield put({
          type: 'getTree',
          payload: {
            userId: userid
          }
        });
        const obj = {
          groupId: detail.groupId,
          userId: userid
        };
        yield put({
          type: 'getGroupDetail',
          payload: {
            obj
          }
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *createUserGroup({ payload }, { call, put }) {
      const { newGroup, userid } = payload;
      const result = yield call(addUserGroupApi, newGroup);
      if (isSuccess(result)) {
        yield put({
          type: 'getTree',
          payload: {
            userId: userid
          }
        });
        yield put({
          type: 'updateUserGroupId',
          payload: {
            id: result.data.groupId
          }
        });
        yield put({
          type: 'changeAddPageStatus',
          payload: {
            data: false
          }
        });
        msg.success(result.message, 'Create User Group');
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *deleteUserGroup({ payload }, { call, put }) {
      const { currentId, userid, obj } = payload;
      const result = yield call(batchDeleteUserGroup, obj);
      if (isSuccess(result)) {
        msg.success(result.message, 'Delete User Group');
        yield put({
          type: 'getTree',
          payload: {
            userId: userid
          }
        });
        yield put({
          type: 'updateUserGroupId',
          payload: {}
        });
      } else {
        yield put({
          type: 'updateUserGroupId',
          payload: {
            id: currentId
          }
        });
        if (result) {
          msg.error(result.message, msgTitle);
        }
      }
    },
    *saveGroupWDomain({ payload }, { call, put }) {
      const { obj } = payload;
      const result = yield call(saveGroupWDomainApi, obj);
      if (isSuccess(result)) {
        yield put({
          type: 'getTree',
          payload: {
            userId: obj.userId
          }
        });
        yield put({
          type: 'updateUserGroupId',
          payload: {
            id: result.data.groupId
          }
        });
        yield put({
          type: 'changeAddPageStatus',
          payload: {
            data: false
          }
        });
        msg.success(result.message, 'Save Domain');
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *initModel({ payload }, { call, put }) {
      const { pNo, pSize } = payload;
      const result = yield call(initModelsApi, pNo, pSize);
      if (isSuccess(result)) {
        yield put({
          type: 'initModelSuccess',
          payload: {
            data: result.data
          }
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *getEnginesList({ payload }, { call, put }) {
      const result = yield call(getEnginesListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getEnginesListSuccess',
          enginesList: result.data
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *assignEngineToGroup({ payload }, { call }) {
      const result = yield call(assignEngineToGroupApi, payload);
      return result;
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
    clearAll(state) {
      return {
        ...state,
        ...initialState
      };
    },
    getTreeSuccess(state, { payload }) {
      return {
        ...state,
        treeList: payload.data,
        isVisibility: {},
        isAdmin: getUserId() === 'superadmin' ? 'Y' : 'N'
      };
    },
    searchTreeSuccess(state, { payload }) {
      return {
        ...state,
        treeList: payload.data
      };
    },
    getListGroupSuccess(state, { payload }) {
      const list = payload.data;
      list.push({ groupId: '0', groupName: '--No Parent--' });
      return {
        ...state,
        groupList: list
      };
    },
    updateUserGroupId(state, { payload }) {
      return {
        ...state,
        currentGroupId: payload.id,
        cuttentGroupName: payload.name
      };
    },
    getDomainListSuccess(state, { payload }) {
      return {
        ...state,
        domainList: payload.data
      };
    },
    getUserListSuccess(state, { payload }) {
      return {
        ...state,
        userData: payload.data,
        allUsers: payload.data.items,
        checkedUsers: payload.data.items.filter(item => item.assignedGroup)
      };
    },
    getChannelListSuccess(state, { payload }) {
      return {
        ...state,
        allChannels: payload.data
      };
    },
    getGroupDetailSuccess(state, { payload }) {
      return {
        ...state,
        groupDetail: payload.data
      };
    },
    initModelSuccess(state, { payload }) {
      return {
        ...state,
        modelsList: payload.data
      };
    },
    updateKeyWord(state, { payload }) {
      return {
        ...state,
        keyWord: payload.keyWord
      };
    },
    changeAddPageStatus(state, { payload }) {
      return {
        ...state,
        isAdd: payload.data
      };
    },
    getEnginesListSuccess(state, { enginesList }) {
      return {
        ...state,
        enginesList
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
