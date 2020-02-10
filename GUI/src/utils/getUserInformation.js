import _ from 'lodash';
import userHelper from './userHelper';

export const getUserIdentify = () => {
  return JSON.parse(userHelper.get() || false);
};

export const getUserInformation = () => {
  return _.get(getUserIdentify(), 'userInfo', {});
};

export const getUserId = () => {
  return _.get(getUserInformation(), 'userId', 'undefine');
};

export const getApprovalRequest = () => {
  return _.get(getUserIdentify(), 'approvalRequest');
};

export const getPendingRequest = () => {
  return _.get(getUserIdentify(), 'pendingRequest');
};
