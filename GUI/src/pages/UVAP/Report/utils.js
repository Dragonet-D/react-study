import _ from 'lodash';
import { I18n } from 'react-i18nify';

export function dateFormatForReportList(data) {
  if (_.isEmpty(data)) {
    return data;
  } else {
    return data.map((item, index) => ({
      ...item,
      _snapshotId: _.get(item, 'data.snapshotId', ''),
      _personId: _.get(item, 'data.personId', ''),
      _snapshotType: _.get(item, 'data.snapshotType', ''),
      _provider: _.get(item, 'source.provider', ''),
      _instanceType: _.get(item, 'vaInstance.type', ''),
      _engineId: _.get(item, 'vaInstance.groupId', ''),
      _id: index,
      _image: `data:image/png;base64,${item.snapshotBase64}`,
      _data: _.isObjectLike(item.data) ? JSON.stringify(item.data) : '',
      key: index
    }));
  }
}

export function handleReportTypeList(list) {
  if (_.isEmpty(list)) {
    return list;
  } else {
    return list.map((item, index) => ({
      ...item,
      name: I18n.t(item.reportType),
      _key: index
    }));
  }
}
