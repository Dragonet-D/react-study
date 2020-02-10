import msg from 'utils/messageCenter';
import { I18n } from 'react-i18nify';

export const FILE_MAX_LENGTH = 10;
export const ENGINE_MAX_LENGTH = 2000;
export const MEDIA_FILE_MAX_LENGTH = 2000;

export function VapNoChangeInfoMsg(source = '') {
  msg.warn(I18n.t('global.popUpMsg.noChange'), source);
}

export function handleVaGatewayList(list = []) {
  return list.map(item => ({
    name: item.name,
    value: item.id,
    key: item.id
  }));
}
