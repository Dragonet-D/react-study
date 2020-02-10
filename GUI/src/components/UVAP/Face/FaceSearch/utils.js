import _ from 'lodash';
import moment from 'moment';
import { DATE_FORMAT } from 'commons/constants/const';

// handle the initial event data list
export function dataFormatForEventsList(data) {
  if (_.isEmpty(data)) {
    return data;
  } else {
    return data.map((item, index) => ({
      ...item,
      _confidenceScore: _.get(item, 'data.confidence', ''),
      _eventTime: moment(_.get(item, 'time', '')).format(DATE_FORMAT),
      _eventType: _.get(item, 'vaInstance.type', ''),
      _channels: `${_.get(item, 'source.provider', '')}/${_.get(
        item,
        'data.sourceDeviceChannelName',
        ''
      )}`, // sourceDeviceChannelName
      _vaEngine: _.get(item, 'vaInstance.appId', ''),
      _group: _.get(item, 'data.personGroupName', ''),
      _id: `faceSearch-${index}`,
      _image: `data:image/png;base64,${item.snapshotBase64}`,
      key: index,
      checked: false
    }));
  }
}

// handle item checked
export function handleCheckedItem(data, id, checked, targetId) {
  return data.map(item => {
    if (item[targetId] === id) {
      return {
        ...item,
        checked
      };
    }
    return item;
  });
}

export function handleChosenDataSort(data, sort) {
  if (!sort) {
    return data;
  }
}

// handle the source data to show in the map
export function handleEventDataToShowInMap(data) {
  const points = data.map(item => {
    const locationData = _.get(item, 'source.location', '');
    return {
      location: [locationData.longitude, locationData.latitude],
      data: [
        {
          key: 'address',
          value: 'Address',
          label: locationData.address
        }
      ]
    };
  });
  return [
    {
      polyline: points.map(item => item.location),
      points
    }
  ];
}
