import _ from 'lodash';
import userHelper from 'utils/userHelper';

let zIndex = 1501;

const addMessage = (state, action) => {
  zIndex += 1;
  if (state.config && state.config.mute) {
    return { ...state };
  }
  const preMsgs = state.messages.splice(0, 0);
  return {
    ...state,
    messages: [
      {
        id: action.id,
        message: action.message,
        source: action.source,
        unread: action.unread,
        type: action.messageType,
        zIndex
      },
      ...preMsgs
    ]
  };
};

export default {
  namespace: 'messageCenter',
  state: {
    config: {
      mute: false,
      muteDuration: 10 * 60 * 1000,
      maxDisplay: 3,
      autoHideDuration: 6000
    },
    messages: [],
    notifications: [],
    progressMsgs: [], // messages of progress bar(clipping download)
    wsMessageCenter: {
      wsMute: !!JSON.parse(userHelper.settingGet() || '{}').wsMute
    }
  },

  reducers: {
    /* 'progress bar' start of lz */
    addProgressBar(state, { payload }) {
      const progressMsgs = [...state.progressMsgs];
      progressMsgs.push(payload);
      return { ...state, progressMsgs };
    },
    delProgressBar(state, { id }) {
      const progressMsgs = [];
      for (const k in state.progressMsgs) {
        if (state.progressMsgs[k].clippingId !== id) {
          progressMsgs.push(state.progressMsgs[k]);
        }
      }
      return { ...state, progressMsgs };
    },
    /* 'progress bar' end of lz */
    sendMessage(state, { payload }) {
      return addMessage(state, payload);
    },
    read(state, { payload }) {
      const messages = _.map(state.messages, item => {
        if (item.id === payload.id) {
          return {
            ...item,
            unread: !item.unread
          };
        } else {
          return item;
        }
      });
      return { ...state, messages };
    },
    clear(state) {
      const messages = _.filter(state.messages, ['unread', true]);
      zIndex = messages.length ? zIndex : -1;
      return { ...state, messages };
    },
    mute(state, { payload }) {
      const duration = payload.duration ? payload.duration : state.config.muteDuration;
      return { ...state, config: { ...state.config, mute: payload.mute, duration } };
    },
    sendMessage2(state, { payload }) {
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            ...payload
          }
        ]
      };
    },
    read2(state, { payload }) {
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.key !== payload.key)
      };
    },
    // websocket
    wsSendMessage(state, { payload }) {
      return {
        ...state,
        message: payload
      };
    },
    muteWsMessage(state, { payload }) {
      return {
        ...state,
        wsMessageCenter: {
          wsMute: payload
        }
      };
    }
  }
};
