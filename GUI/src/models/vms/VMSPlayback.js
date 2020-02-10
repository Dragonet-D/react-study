import { isSuccess } from 'utils/helpers';
import {
  channelGroupTree,
  requestPlayabck,
  initBookmarkApi,
  saveBookmarkApi,
  endStreamApi,
  doClippingApi,
  delBookmarkApi,
  getChannelDetailListApi,
  getChannelSnapshot
} from 'api/vms';
import msgCenter from 'utils/messageCenter';
import tools from 'utils/treeTools';

export default {
  namespace: 'VMSPlayback',
  state: {
    namespace: 'VMSPlayback',
    id: 0
  },
  effects: {
    *getRecords({ payload }, { call }) {
      const result = yield call(getChannelDetailListApi, payload);
      if (isSuccess(result)) {
        return result.data;
      }
    },
    *getChannelListData({ payload }, { call, put }) {
      const result = yield call(channelGroupTree, payload.id);
      const data = tools.formatSensorList({ data: result.data, search: '' });
      if (isSuccess(result)) {
        yield put({
          type: 'getChannelListDataSuccess',
          listData: data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Playback');
      }
    },
    *requestPlayback({ payload, id }, { call, put }) {
      const result = yield call(requestPlayabck, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'requestPlaybackSuccess',
          playbackData: result.data,
          id
        });
      } else if (result) {
        msgCenter.error(result.message, 'Playback');
      }
    },
    *saveBookmark({ savePayload }, { call }) {
      const result = yield call(saveBookmarkApi, savePayload);
      if (isSuccess(result)) {
        msgCenter.success(result.message, 'Playback');
        return result.data;
      } else if (result) {
        msgCenter.error(result.message, 'Playback');
      }
    },
    *delBookmark({ payload }, { call }) {
      const result = yield call(delBookmarkApi, payload);
      if (isSuccess(result)) {
        msgCenter.success(result.message, 'Playback');
        return result.data;
      } else if (result) {
        msgCenter.error(result.message, 'Playback');
      }
    },
    *getBookmark({ payload, id }, { call, put }) {
      const result = yield call(initBookmarkApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getBookmarkSuccess',
          bookmark: result.data,
          id
        });
      } else if (result) {
        msgCenter.error(result.message, 'Playback');
      }
    },
    *endStream({ payload, id }, { call, put }) {
      const result = yield call(endStreamApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'endStreamSuccess',
          id
        });
      } else if (result) {
        msgCenter.error(result.message, 'Playback');
      }
    },
    *clipping({ payload, id }, { call, put }) {
      const result = yield call(doClippingApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'clippingSuccess',
          id
        });
      } else if (result) {
        msgCenter.error(result.message, 'Playback');
      }
      return result;
    },
    *getPreview({ payload, id }, { call, put }) {
      const result = yield call(getChannelSnapshot, payload);
      if (result) {
        yield put({
          type: 'getPreviewSuccess',
          result,
          id
        });
      } else if (result) {
        msgCenter.error(result.message, 'Playback');
      }
      // return result;
    }
  },
  reducers: {
    getChannelListDataSuccess(state, { listData }) {
      return {
        ...state,
        listData
      };
    },
    requestPlaybackSuccess(state, { playbackData, id }) {
      return {
        ...state,
        playbackData,
        id
      };
    },
    getBookmarkSuccess(state, { bookmark, id }) {
      return {
        ...state,
        bookmark,
        id
      };
    },
    endStreamSuccess(state, { id }) {
      return {
        ...state,
        endStreamId: id
      };
    },
    getPreviewSuccess(state, { result, id }) {
      return {
        ...state,
        preview: result,
        id
      };
    }
  }
};
