import { syncUpDevicesApi, syncUpChannelsApi } from 'api/securitySyncUpVMSInformation';
import { isSuccess } from 'utils/helpers';
import msg from 'utils/messageCenter';

const msgTitle = 'Sync Up VMS';

export default {
  namespace: 'securitySyncUpVMSInformation',
  state: {},
  effects: {
    *syncUpDevices({ payload }, { call }) {
      const { userId } = payload;
      const result = yield call(syncUpDevicesApi, userId);
      if (isSuccess(result)) {
        msg.success(result.message, 'Sync Up Devices');
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *syncUpChannels({ payload }, { call }) {
      const { userId } = payload;
      const result = yield call(syncUpChannelsApi, userId);
      if (isSuccess(result)) {
        msg.success(result.message, 'Sync Up Channels');
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    }
  },
  reducers: {}
};
