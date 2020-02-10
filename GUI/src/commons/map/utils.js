/*
 * @Description: Map Tools
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-07-10 16:09:50
 * @LastEditTime: 2019-09-25 18:26:40
 * @LastEditors: Kevin
 */

import userHelper from 'utils/userHelper';
import { updateChannelAPI, getChannelSnapshotAPI } from 'api/map';
import { isSuccess } from 'utils/helpers';
import msg from 'utils/messageCenter';
import _ from 'lodash';
import store from '@/index';
import { layerId, imageLayerId, ivhPopupTemplate } from './setting';

const mapTools = {};
const dataTools = {};

/**
 * @description generate applayEdit param to delete feature
 * @param {Promise} featuresPromise
 * @return {Promise}
 */
mapTools.getParamToDeleteChannel = function deleteFeature(featuresPromise) {
  return featuresPromise
    .then(f => {
      if (!!f && f.length > 0) {
        return { deleteFeatures: f };
      }
      return false;
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error({ 'Get Param Delete Features': error.message, 'Error:': error });
    });
};

/**
 * @description generate applayEdit param to add feature
 * @param {Promise} featuresPromise
 * @return {Promise}
 */
mapTools.getParamToAddFeatures = function addFeature(featuresPromise) {
  return featuresPromise
    .then(f => {
      if (!!f && f.length > 0) {
        return { addFeatures: f };
      }
      return false;
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error({ 'Get Param Add Features': error.message, 'Error:': error });
    });
};

mapTools.getParamToUpdateFeatures = function updateFeature(featuresPromise) {
  return featuresPromise
    .then(f => {
      if (!!f && f.length > 0) {
        return { updateFeatures: f };
      }
      return false;
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error({ 'Get Param Update Features': error.message, 'Error:': error });
    });
};

/**
 * @description get sql query for feature depend user ID
 * @param {String} userId user ID
 * @return {String} sql query string
 */
mapTools.getSqlSentenceToQueryFeature = function getSqlSentenceToQueryFeature(userId) {
  return `userId = '${userId}'`;
};

/**
 * @description Create A Query Condition
 * @param {construction} Query Query
 * @param {String} where where condition
 * @return {query} Query Object
 */
mapTools.createQueryCondition = function queryCondition(Query, where) {
  const query = new Query();
  query.where = where;
  query.returnGeometry = true;
  query.outFields = ['*'];
  return query;
};

/**
 * @description Query Features In Layer
 * @param {Layer} layer
 * @param {Object} query Query object
 * @return {Promise} featuers array
 */
mapTools.queryLayerFeatures = function Features(layer, query) {
  if (!query) {
    return layer
      .queryFeatures()
      .then(r => {
        return r.features;
      })
      .catch(e => {
        // eslint-disable-next-line no-console
        console.error({ Method: 'queryFeatures', Message: e.message, Error: e });
        return false;
      });
  } else {
    return layer
      .queryFeatures(query)
      .then(r => {
        return r.features;
      })
      .catch(e => {
        // eslint-disable-next-line no-console
        console.error({ Method: 'queryFeatures', Message: e.message, Error: e });
        return false;
      });
  }
};

/**
 * @description Add, Delete, Update Features
 * @param {FeatureLayer} layer
 * @param {Promise} operationPromise result is {addFeatures: faetures}
 * @return {Promise} oparetion result or false
 */
mapTools.operateFeatures = function operateFeatures(layer, operationPromise) {
  return operationPromise.then(opt => {
    if (!opt) return false;
    return layer
      .applyEdits(opt)
      .then(r => {
        return r;
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log('===============================================');
        // eslint-disable-next-line no-console
        console.error('[ applyEdits ] FAILURE: ', error.code, error.name, error.message);
        // eslint-disable-next-line no-console
        console.log('error = ', error);
      });
  });
};

/**
 * @description get channel attribute used to create graphic object
 * @param {String} type like: normal, alarm
 * @param {Object} point channel position { lat, lon }
 * @param {Object} channel channel
 * @return {Object} channel attribute used to create graphic object
 */
mapTools.getAttributes = function attributes(type, point, channel) {
  const userId = dataTools.getUserId();
  if (type === 'normal') {
    const { installation } = channel;
    return {
      userId,
      deviceId: channel.deviceId || '',
      channelId: channel.channelId || '',
      channelName: channel.channelName || '',
      channelDescription: channel.description || '',
      channelAddress: installation.address || '',
      buildingName: installation.buildingName || '',
      channelNumber: channel.channelNumber || 0, // count channel number
      status: channel.status && channel.status.toLowerCase() === 'active' ? 1 : 0,
      ptzInd: channel.ptzInd || '',
      longitude: point.longitude,
      latitude: point.latitude,
      distance: installation.distance || 0,
      direction: installation.direction || '',
      groupName: channel.groupName,
      groupId: channel.parentGroupId || channel.groupId,
      symbolRender:
        channel.status && channel.status.toLowerCase() === 'active'
          ? `${channel.ptzInd} 1`
          : `${channel.ptzInd} 0`
    };
  }

  const {
    $sourceId: { deviceId, channelId, sourceName },
    $data: { deviceInfo }
  } = channel;

  return {
    userId,
    deviceId: deviceId || '',
    channelId: channelId || '',
    channelName: sourceName || (deviceInfo && deviceInfo.name) || '',
    channelDescription: channel.description || '',
    channelAddress: channel.address || '',
    alarmNumber: channel.alarmNumber || 0, // count alarm number
    buildingName: channel.buildingName || '',
    eventType: channel.alarmType || '',
    data: '',
    longitude: point.longitude,
    latitude: point.latitude
  };
};

/**
 * @description get single geographic position information
 * @param {Object} channel
 * @return {Object} position object
 */
mapTools.getPositionInformation = function singlePoint(channel) {
  let longitude = null;
  let latitude = null;

  if (channel.longitude && channel.latitude) {
    longitude = Number(channel.longitude);
    latitude = Number(channel.latitude);
  } else {
    const $location = channel.installation || {};
    longitude = Number($location.longitude);
    latitude = Number($location.latitude);
  }

  if (longitude && latitude) {
    return { longitude, latitude };
  }
  return false;
};

/**
 * @description get position and attributes of Graphics from channel
 * @param {String} map type, like: normal, alarm;
 * @param {Array} channels channel array
 * @return {Array} array including position and attributes of channel eg: [{ position, attributes }]
 */
mapTools.getPositionAndGraphicsAttribute = function positionAndGraphicsAttribute(type, channels) {
  const data = [];
  for (let i = 0, len = channels.length; i < len; i++) {
    const temp = channels[i];
    const position = mapTools.getPositionInformation(temp);
    const { latitude, longitude } = position;
    if (latitude && longitude) {
      const attributes = mapTools.getAttributes(type, position, temp);
      data.push({
        position,
        attributes
      });
    }
  }

  return data;
};

/**
 * @description change spatial reference
 * @param {Object} mapClass map Class like: SpatialReference, ProjectParameters, Point, GeometryService
 * @param {Object} wkids coordinate wkid
 * @param {String} url map GeometryService address
 * @param {Array} points [{ position, attributes }]
 * @return {Promise} Promise result including attributes and map geometry points [{ point, attributes }]
 */
mapTools.transformCoordinate = function transformCoordinate(mapClass, wkids, url, points) {
  return new Promise((resolve, reject) => {
    const result = [];
    const { SpatialReference, ProjectParameters, Point, GeometryService } = mapClass;
    const { oldID, newID, latestID } = wkids;
    const newCoordinateId = { wkid: newID };
    const geometryService = new GeometryService(url);
    const spatialReference = new SpatialReference(oldID);

    for (let i = 0, len = points.length; i < len; i++) {
      const temp = points[i];
      const { position, attributes } = temp;
      const geometryPoints = new Point({
        latitude: position.latitude,
        longitude: position.longitude,
        spatialReference
      });

      if (latestID) newCoordinateId.latestWkid = latestID;

      const projectParameters = new ProjectParameters({
        geometries: [geometryPoints],
        outSpatialReference: new SpatialReference(newCoordinateId)
      });

      geometryService
        .project(projectParameters)
        .then(p => {
          result.push({
            point: p[0],
            attributes
          });
          if (result.length === points.length) {
            resolve(result);
          }
        })
        .catch(error => {
          reject(error);
          // eslint-disable-next-line no-console
          console.warn({ 'GeometryService-Project': error.message, Error: error });
        });
    }
  });
};

/**
 * @description get Graphic
 * @param {construction} Graphic, map Graphic construction
 * @param {Promise} pointsPromise Promise
 * @return {Promise} Graphic object array
 */
mapTools.tranformGeometryPointToGraphic = function tranformGeometryPointToGraphic(
  Graphic,
  pointsPromise
) {
  return pointsPromise
    .then(points => {
      const result = [];
      for (let i = 0, len = points.length; i < len; i++) {
        const temp = points[i];
        result.push(
          new Graphic({
            geometry: temp.point,
            attributes: temp.attributes
          })
        );
      }

      return result;
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error({ 'Tranform Geometry Point To Graphic': error.message, Error: error });
    });
};

/**
 * @description get ID string that used to sql query
 * @param {String} field the field you want to map
 * @param {Array} data mapping array
 * @return {String}
 */
mapTools.getIDString = function getIDString(field, data) {
  return data.length > 0 ? data.map(temp => `'${temp[field]}'`).join(',') : '0-0-0-0-0-0-0-0-0-0-0';
};

/**
 * @description get SQL sentence to control features
 * @param {String} userId user ID
 * @param {String} IDString  string ID
 * @return {String}
 */
mapTools.getSqlSentenceToControlFeatures = function getSqlSentenceToControlFeatures(
  userId,
  IDString
) {
  return `userId = '${userId}' and channelId in (${IDString})`;
};

/**
 * @description control the display of Feature Layer
 * @param {Object} view map view
 * @param {Object} layer map layer
 * @param {String} condition SQL sentence
 * @return {Boolean} success or failure
 */
mapTools.controlFeatureLayerShowing = function controlFeatureShowing(view, layer, condition) {
  return view
    .whenLayerView(layer)
    .then(layerView => {
      // eslint-disable-next-line no-param-reassign
      layerView.filter = {
        where: condition
      };

      return true;
    })
    .catch(() => {
      return false;
    });
};

/**
 * @description control the display of Image Layer
 * @param {Object} layer map layer
 * @param {Number} index sub ImageLayer index
 * @param {String} condition SQL sentence
 */
mapTools.controlImageLayerShowing = function controlImageLayerShowing(layer, index, condition) {
  // eslint-disable-next-line no-param-reassign
  layer.findSublayerById(index).definitionExpression = condition;
};

/**
 * @description get SQL sentence about callback of search function
 * @param {String} userId current user ID
 * @param {String} input search content
 * @return {String} SQL sentence
 */
mapTools.getSqlSentenceToQuerySuggestions = function getSqlSentenceToQuerySuggestions(
  userId,
  input
) {
  return `userId = '${userId}' and (channelName like '%${input}%' or channelAddress like '%${input}%' or channelDescription like '%${input}%')`;
};

/**
 * @description get SQL sentence about select event of search function
 * @param {String} OBJECTID geoDB OBJECTID field
 * @return {String} SQL sentence
 */
mapTools.getSqlSentenceToQueryResultSelected = function getSqlSentenceToQueryResultSelected(
  OBJECTID
) {
  return `OBJECTID in (${OBJECTID})`;
};

/**
 * @description Add Template Into Feature To Show Snapshot
 * @param {mapClass} mapClass object including map construction
 * @param {Object} blob fetch blob
 * @param {Object} template feature popup template
 * @param {Object} feature map layer feature
 * @return {Object} map layer feature modified
 */
mapTools.addTemplateIntoFeatureToShowSnapshot = function addTemplateIntoFeatureToShowSnapshot(
  mapClass,
  blob,
  template,
  feature
) {
  const { PopupTemplate } = mapClass;
  const urlCreator = window.URL || window.webkitURL;
  const imgSrc = urlCreator.createObjectURL(blob);
  template.content[0].text = `Channel Name: <b>{channelName}</b><br/><br/><img src='${imgSrc}' width='100%' height='100%'/>`;
  feature.popupTemplate = new PopupTemplate({ ...template });

  return feature;
};

/**
 * @description tranform web page point to map point
 * @param {Object} view map view
 * @param {Object} point web page point object just like: { x: 234, y: 123 }
 * @return {Object} map point
 */
mapTools.getMapPoint = function getMapPoint(view, point) {
  return view.toMap(point);
};

mapTools.updateChannelInformation = function getChannelInformation(
  Locator,
  url,
  channel,
  mapPoint
) {
  return new Locator({ url })
    .locationToAddress(mapPoint)
    .then(result => {
      return updateChannelAPI({
        channelId: channel.channelId,
        deviceId: channel.deviceId,
        address: result.address || channel.installation.address,
        latitude: String(mapPoint.latitude),
        longitude: String(mapPoint.longitude)
      }).then(res => {
        return {
          response: res,
          position: {
            address: result.address,
            latitude: String(mapPoint.latitude),
            longitude: String(mapPoint.longitude),
            mapPoint
          }
        };
      });
    })
    .catch(error => {
      const message = _.get(error, 'details.messages[0]', error.message);
      // eslint-disable-next-line no-console
      console.error({ 'Get Point Address': error.message, Error: error });
      return message;
    });
};

// graphicLayer highlight
mapTools.highlightChannelsSelectedWithGraphicLayer = function highlightChannelsSelectedWithGraphicLayer(
  mapClass,
  view,
  layer,
  channels,
  highlightStore
) {
  let channelIds = [];
  if (dataTools.isArray(channels)) {
    channelIds = channels.map(t => {
      return t.channelId;
    });
  }

  highlightStore.clear();
  view.whenLayerView(layer).then(layerView => {
    layerView.queryGraphics().then(results => {
      // console.log('query graphics:', results.items);
      results.items.forEach(item => {
        if (channelIds.includes(item.attributes.channelId)) {
          // console.log('includes channelId', item.attributes.channelId);
          highlightStore.set(layerView.highlight(item));
        }
      });
    });
  });
};

// highlight
mapTools.highlightChannelsSelected = function highlightChannelsSelected(
  mapClass,
  view,
  layer,
  channels,
  highlightStore
) {
  const { Query } = mapClass;
  let channelIds = [];
  if (dataTools.isArray(channels)) {
    channelIds = channels.map(t => {
      return t.channelId;
    });
  }

  const userId = dataTools.getUserId();

  const queryVal = channelIds.map(c => `'${c}'`).join(',');
  const query = new Query();
  query.where = `userId = '${userId}' and channelId in (${queryVal})`;
  query.returnGeometry = true;
  query.outFields = ['*'];

  highlightStore.clear();
  mapTools.queryLayerFeatures(layer, query).then(f => {
    view.whenLayerView(layer).then(layerView => {
      f.forEach(item => {
        highlightStore.set(layerView.highlight(item));
      });
    });
  });
};

// highlight single
mapTools.highlightSingleFeature = function highlightSingleFeature(
  view,
  layer,
  highlightStore,
  objectId
) {
  // query feature from the server
  layer
    .queryFeatures({
      objectIds: [objectId],
      outFields: ['*'],
      returnGeometry: true
    })
    .then(results => {
      if (results.features.length > 0) {
        // highlight the feature on the view
        view.whenLayerView(layer).then(layerView => {
          highlightStore.set(layerView.highlight(results.features[0]));
        });
      }
    });
};

mapTools.getPolygonGraphic = function getPolygonGraphic(mapClass, rings) {
  const { SpatialReference, Graphic } = mapClass;
  if (!rings || !dataTools.isArray(rings)) return;
  const polygon = {
    type: 'polygon',
    rings,
    spatialReference: new SpatialReference(102100)
  };

  const fillSymbol = {
    type: 'simple-fill',
    color: [219, 220, 219, 0.4],
    outline: {
      color: '#323232',
      width: 2
    }
  };

  return new Graphic({
    geometry: polygon,
    symbol: fillSymbol
  });
};

mapTools.getPersonalRoute = function getPersonalRoute(mapClass, route, keyId) {
  const { Graphic } = mapClass;
  const result = [];
  const { polyline, points } = route;
  if (!polyline || !dataTools.isArray(polyline)) return result;

  // point
  const pointSymbol = {
    type: 'simple-marker',
    color: [226, 119, 40],
    size: '8px',
    outline: {
      color: [255, 255, 255],
      width: 1
    }
  };

  points.forEach(item => {
    const { location, data } = item;
    const point = {
      type: 'point',
      longitude: location[0],
      latitude: location[1]
    };

    let graphic = {
      geometry: point,
      symbol: pointSymbol
    };

    const attributes = data.reduce((previous, current) => {
      return {
        ...previous,
        [current.key]: current.value
      };
    }, {});
    const isEmpty = _.isEmpty(attributes);

    if (!isEmpty) {
      graphic = {
        ...graphic,
        attributes,
        popupTemplate: {
          title: attributes[keyId],
          content: [
            {
              type: 'fields',
              fieldInfos: data.map(temp => {
                return {
                  fieldName: temp.key,
                  label: temp.label
                };
              })
            }
          ]
        }
      };
    }

    const pointGraphic = new Graphic({ ...graphic });

    result.push(pointGraphic);
  });

  // polyline
  const polylineGeo = {
    type: 'polyline',
    paths: polyline
  };

  const lineSymbol = {
    type: 'simple-line',
    color: [226, 119, 40],
    width: 2
  };

  const polylineGraphic = new Graphic({
    geometry: polylineGeo,
    symbol: lineSymbol
  });

  result.push(polylineGraphic);
  return result;
};

mapTools.getBasemap = function getBasemap(mapClass, url) {
  const { TileLayer, Basemap } = mapClass;
  const tileLayer = new TileLayer({
    url
  });

  const basemap = new Basemap({
    baseLayers: [tileLayer],
    title: 'basemap',
    id: 'basemap'
  });

  return {
    tileLayer,
    basemap
  };
};

// data tools
dataTools.getUserId = function userId() {
  const user = JSON.parse(userHelper.get() || false);
  const userId = !!user && !!user.userInfo && user.userInfo.userId;
  return userId;
};

dataTools.loopTreeNode = function loopTreeNode(data, store) {
  for (let i = 0, len = data.length; i < len; i++) {
    const item = data[i];
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    if (hasChildren) {
      this.loopTreeNode(item.children, store);
    } else {
      store.push({ ...item });
    }
  }
};

/**
 * @description get flat tree node
 * @param {Array} data tree data
 * @return {Array} flat data
 */
dataTools.getFlatTreeData = function getFlatTreeData(data) {
  const store = [];
  if (Array.isArray(data) && data.length > 0) {
    dataTools.loopTreeNode(data, store);
  }
  return store;
};

/**
 * @description combine repeating points for the same longitude and latitude
 * @param {Array} data flat array data
 * @return {Array}
 */
dataTools.filterTreeNode = function filterTreeNode(data) {
  const result = [];
  const dataCopy = [...data];
  if (Array.isArray(dataCopy) && dataCopy.length > 0) {
    for (let i = 0, len = dataCopy.length; i < len; i++) {
      const temp = dataCopy.shift();
      if (temp && temp.installation && temp.installation.longitude && temp.installation.latitude) {
        const arr = [];
        arr.push({ ...temp });
        temp.channelNumber = 1;
        temp.nodes = [...arr];
        const $len = dataCopy.length;

        for (let j = 0; j < $len; j++) {
          const item = dataCopy[j];
          if (
            item &&
            item.installation &&
            item.installation.longitude &&
            item.installation.latitude
          ) {
            if (
              temp.installation.longitude === item.installation.longitude &&
              temp.installation.latitude === item.installation.latitude
            ) {
              temp.nodes.push({ ...item });
              temp.channelNumber++;
              // eslint-disable-next-line no-param-reassign
              delete dataCopy[j];
            }
          }
        }
        result.push({ ...temp });
      }
    }
  }
  return result;
};

/**
 * @description integrate repetitive alarm depend on the same longitude and latitude
 * @param {Array} data flat array data
 * @return {Array} alarms combined
 */
dataTools.integrateRepetitiveAlarmData = function integrateRepetitiveAlarmData(data) {
  const result = [];
  if (dataTools.isArray(data)) {
    const ectypalData = [...data];
    for (let i = 0, len = ectypalData.length; i < len; i++) {
      const temp = ectypalData.shift();
      if (temp && temp.longitude && temp.latitude) {
        const combiningAlarm = []; // store alarm of the same coordiante
        const idStore = []; // used to store channelId in the same group

        const $sourceId = JSON.parse(temp.sourceId);
        const $data = JSON.parse(temp.data);
        const parentAlarm = {
          ...temp,
          $sourceId,
          $data,
          channelId: $sourceId.channelId,
          deviceId: $sourceId.deviceId
        };

        idStore.push($sourceId.channelId);
        combiningAlarm.push({ ...parentAlarm });
        parentAlarm.alarmNumber = 1;
        parentAlarm.nodes = [...combiningAlarm];
        parentAlarm.channelIds = [...idStore];

        for (let j = 0, $len = ectypalData.length; j < $len; j++) {
          const $temp = ectypalData[j];
          if ($temp && $temp.longitude && $temp.latitude) {
            if (
              parentAlarm.longitude === $temp.longitude &&
              parentAlarm.latitude === $temp.latitude
            ) {
              const $sourceId = JSON.parse($temp.sourceId);
              parentAlarm.nodes.push($temp);
              parentAlarm.channelIds.push($sourceId.channelId);
              parentAlarm.alarmNumber++;
              delete ectypalData[j];
            }
          }
        }

        result.push(parentAlarm);
      }
    }
  }

  return result;
};

/**
 * @description integrate repetitive children alarm depend on channel ID
 * @param {Array} data
 * @return {Object}
 */
dataTools.integrateRepetitiveChildrenAlarmData = function integrateRepetitiveChildrenAlarmData(
  data
) {
  const result = [...data];
  if (dataTools.isArray(result)) {
    // loop alarm integrated
    result.forEach(temp => {
      const $nodes = [...temp.nodes];
      const nodesObject = {};
      // loop alarm nodes and integrate alarm in nodes just like parent alarm
      $nodes.forEach(tempNode => {
        const $sourceId = JSON.parse(tempNode.sourceId);
        const $data = JSON.parse(tempNode.data);
        const { channelId } = $sourceId;

        if (channelId) {
          const $tempNode = { ...tempNode, $sourceId, $data };

          // store alarm nodes data into object
          if (nodesObject[channelId]) {
            nodesObject[channelId].nodes.push($tempNode);
          } else {
            const store = [];
            store.push({ ...$tempNode });
            $tempNode.nodes = [...store];
            nodesObject[channelId] = { ...$tempNode };
          }
        }
      });
      // transform nodes object into array in order to remove repetitive alarm
      const nodesStore = [];
      Object.keys(nodesObject).forEach(node => {
        nodesStore.push(nodesObject[node]);
      });

      // replace preview nodes by new nodes
      temp.nodes = nodesStore;
    });
  }

  return result;
};

/**
 * @description judge data type is array and length more than zore
 * @param {Any} data any data type
 * @return {Boolean}
 */
dataTools.isArray = function isArray(data) {
  return Array.isArray(data) && data.length > 0;
};

// init map data
/**
 * @description clear a feature layer data depend on current user
 * @param {Object} mapClass object including map construction
 * @param {Object} layer map feature layer
 * @return {Object} the result of operating features
 */
export const clearChannelsInformationsOfGeoDB = (mapClass, layer) => {
  const { Query } = mapClass;
  const { getUserId } = dataTools;
  const getQueryCondition = _.curry(mapTools.createQueryCondition)(Query);
  const queryFeatures = _.curry(mapTools.queryLayerFeatures)(layer);
  const deleteFeatures = _.curry(mapTools.operateFeatures)(layer);

  const clearCurrentUserFeatures = _.flow(
    getUserId,
    mapTools.getSqlSentenceToQueryFeature,
    getQueryCondition,
    queryFeatures,
    mapTools.getParamToDeleteChannel,
    deleteFeatures
  );

  return clearCurrentUserFeatures();
};

/**
 * @description add channels into geo db
 * @param {Object} mapClass object including map construction
 * @param {Object} layer map feature layer
 * @param {Array} data flat tree data that has been filtered
 * @param {String} url  arcgis geometry sevrvice api
 * @param {String} type feature layer type including normal, alarm
 * @return {Object} the result of operating features
 */
export const addChannelsIntoGeoDB = ({ mapClass, layer, data, url, type }) => {
  if (!(data.length > 1)) return;
  const { SpatialReference, ProjectParameters, Point, GeometryService, Graphic } = mapClass;
  const wkids = { oldID: 4326, newID: 102100, latestID: 3857 };
  const getCoordinate = _.curry(mapTools.transformCoordinate)(
    { SpatialReference, ProjectParameters, Point, GeometryService },
    wkids,
    url
  );
  const getPositionAttribute = _.curry(mapTools.getPositionAndGraphicsAttribute)(type);
  const getGraphicObject = _.curry(mapTools.tranformGeometryPointToGraphic)(Graphic);
  const addFeatures = _.curry(mapTools.operateFeatures)(layer);

  const addCurrentUserFeatures = _.flow(
    getPositionAttribute,
    getCoordinate,
    getGraphicObject,
    mapTools.getParamToAddFeatures,
    addFeatures
  );
  return addCurrentUserFeatures(data);
};

// control feature permission
/**
 * @description dynamically control feature permission
 * @param {Object} map map object
 * @param {Object} view map view object
 * @param {Array} data data you want to show them into map
 * @param {String} type layer type like: alarm, normal
 */
export const setFeatureToShow = (map, view, data, type) => {
  const userId = dataTools.getUserId();
  const featureLayer = map.findLayerById(layerId[type]);
  const mapImageLayer = map.findLayerById(layerId.image);
  const getIDString = _.curry(mapTools.getIDString)('channelId');
  const getSqlSentence = _.curry(mapTools.getSqlSentenceToControlFeatures)(userId);
  const setFeatureLayerShowing = _.curry(mapTools.controlFeatureLayerShowing)(view, featureLayer);
  const setImageLayerShowing = _.curry(mapTools.controlImageLayerShowing)(
    mapImageLayer,
    imageLayerId[layerId[type]]
  );
  const setFeatureLayerPermission = _.flow(
    getIDString,
    getSqlSentence,
    setFeatureLayerShowing
  );
  const setImageLayerPermission = _.flow(
    getIDString,
    getSqlSentence,
    setImageLayerShowing
  );

  setFeatureLayerPermission(data);
  setImageLayerPermission(data);
};

/**
 * @description control feature permission by set layer definitionExpression
 * @param {String} field object key you want to get value
 * @param {Array} data data array
 * @return {String} SQL sentence
 */
export const setPermission = (field, data) => {
  const userId = dataTools.getUserId();
  const getIDString = _.curry(mapTools.getIDString)(field);
  const getSqlSentence = _.curry(mapTools.getSqlSentenceToControlFeatures)(userId);
  const getLayerDefinitionExpression = _.flow(
    getIDString,
    getSqlSentence
  );
  return getLayerDefinitionExpression(data);
};

// data operation
/**
 * @description format data you want to show them into map from tree
 * @param {Array} data map tree data
 * @return {Array} flat tree data that has been filtered
 */
export const formatFeatureLayerNormalData = data => {
  const { getFlatTreeData, filterTreeNode } = dataTools;
  return _.flow(
    getFlatTreeData,
    filterTreeNode
  )(data);
};

/**
 * @description format alarm data of feature layer
 * @param {Array} data real time alarm data
 * @return {Array} integrate alarm for the same latitude and longitude into the same children set, integrate alarm for the same channelId under every parent alarm
 */
export const formatFeatureLayerAlarmData = data => {
  const formatAlarmData = _.flow(
    dataTools.integrateRepetitiveAlarmData,
    dataTools.integrateRepetitiveChildrenAlarmData
  );
  return formatAlarmData(data);
};

// search funciton
/**
 * @description get search result of feature
 * @param {Object} mapClass map contruction
 * @param {Object} map map object
 * @param {String} text content searched
 * @param {String}  type layer id
 * @return {Promise} get a Promise Object including features queried
 */
export const getSearchFeatureResult = (mapClass, map, text, type) => {
  const { Query } = mapClass;
  const userID = dataTools.getUserId();
  const layer = map.findLayerById(layerId[type]);
  const getSqlSentence = _.curry(mapTools.getSqlSentenceToQuerySuggestions)(userID);
  const createQuery = _.curry(mapTools.createQueryCondition)(Query);
  const queryFeatures = _.curry(mapTools.queryLayerFeatures)(layer);

  return _.flow(
    getSqlSentence,
    createQuery,
    queryFeatures
  )(text);
};

/**
 * @description query feature after selecting search result
 * @param {Object} mapClass map contruction
 * @param {Object} map map object
 * @param {String} OBJECTID geoDB OBJECTID field
 * @param {String}  type layer id
 * @return {Promise} get a Promise Object including features queried
 */
export const getFeatureSelectedAfterSearching = (mapClass, map, OBJECTID, type) => {
  const { Query } = mapClass;
  const layer = map.findLayerById(layerId[type]);
  const createQuery = _.curry(mapTools.createQueryCondition)(Query);
  const queryFeatures = _.curry(mapTools.queryLayerFeatures)(layer);

  return _.flow(
    mapTools.getSqlSentenceToQueryResultSelected,
    createQuery,
    queryFeatures
  )(OBJECTID);
};

export const updateChannelLocation = async (mapClass, map, view, layer, url, channel, point) => {
  const { Locator, Query, Graphic } = mapClass;
  const getMapLocation = _.curry(mapTools.getMapPoint)(view);
  const updateChannelLocation = _.curry(mapTools.updateChannelInformation)(Locator, url, channel);
  const updateChannelToUmmi = _.flow(
    getMapLocation,
    updateChannelLocation
  );

  const userID = dataTools.getUserId();
  const where = `userId = '${userID}' and channelId in ('${channel.channelId}')`;
  const getQueryFeatureCondition = _.curry(mapTools.createQueryCondition)(Query);
  const queryFeatures = _.curry(mapTools.queryLayerFeatures)(layer);
  const queryFeaturesFromGeoServer = _.flow(
    getQueryFeatureCondition,
    queryFeatures
  );

  const getGraphicObject = _.curry(mapTools.tranformGeometryPointToGraphic)(Graphic);
  const operateFeatures = _.curry(mapTools.operateFeatures)(layer);
  const updateFeature = _.flow(
    getGraphicObject,
    mapTools.getParamToUpdateFeatures,
    operateFeatures
  );
  const addFeature = _.flow(
    getGraphicObject,
    mapTools.getParamToAddFeatures,
    operateFeatures
  );

  try {
    // update channel to ummi server
    const updateChannelResult = await updateChannelToUmmi(point);

    if (isSuccess(updateChannelResult.response)) {
      // query feature amount
      const queryFeatureResult = await queryFeaturesFromGeoServer(where);
      if (queryFeatureResult.length > 0) {
        const feature = queryFeatureResult[0];
        const attributes = feature && feature.attributes;
        attributes.channelAddress = updateChannelResult.address;
        attributes.longitude = updateChannelResult.longitude;
        attributes.latitude = updateChannelResult.latitude;
        const op = [
          {
            point: updateChannelResult.mapPoint,
            attributes
          }
        ];

        // update channel to geo server
        const updateFeatureResult = await updateFeature(Promise.resolve(op));
        if (
          updateFeatureResult.updateFeatureResults.length > 0 &&
          !!updateFeatureResult.updateFeatureResults[0].objectId
        ) {
          msg.success(updateChannelResult.response.message, 'Update Channel Position');
          const userId = dataTools.getUserId();
          // update sensor list data and realtime table data
          store.dispatch({
            type: 'map/getTreeData',
            payload: { userId }
          });
          store.dispatch({
            type: 'map/getRealTimeAlarmData',
            payload: {
              userId,
              sort: 'desc'
            }
          });

          // refresh layer
          const normalLayer = map.findLayerById(layerId.normal);
          const alarmLayer = map.findLayerById(layerId.alarm);
          normalLayer.refresh();
          alarmLayer.refresh();
        } else {
          throw new Error('Failed to update channel point');
        }
      } else {
        const attributes = mapTools.getAttributes('normal', updateChannelResult, channel);
        const op = [
          {
            point: updateChannelResult.mapPoint,
            attributes
          }
        ];

        // add channel to geo server
        const addFeatureResult = await addFeature(Promise.resolve(op));
        if (
          addFeatureResult.addFeatureResults.length > 0 &&
          !!addFeatureResult.addFeatureResults[0].objectId
        ) {
          const userId = dataTools.getUserId();
          msg.success(updateChannelResult.response.message, 'Update Channel Position');
          // update sensor list data and realtime table data
          store.dispatch({
            type: 'map/getTreeData',
            payload: { userId }
          });
          store.dispatch({
            type: 'map/getRealTimeAlarmData',
            payload: {
              userId,
              sort: 'desc'
            }
          });

          // refresh layer
          const normalLayer = map.findLayerById(layerId.normal);
          const alarmLayer = map.findLayerById(layerId.alarm);
          normalLayer.refresh();
          alarmLayer.refresh();
        } else {
          store.dispatch(msg.error('Failed to add channel point on map'));
        }
      }
    } else {
      throw new Error(updateChannelResult);
    }
  } catch (error) {
    msg.error(error.message, 'Update Channel Position');
  }
};

export const showSnapshot = async ({ mapClass, view, objectID, channel, mapEvent }) => {
  try {
    const ID = objectID || channel.OBJECTID || '';

    const result = mapEvent.results.filter(item => {
      return item.graphic.attributes.OBJECTID === ID;
    });

    const feature = result[0].graphic; // get feature after filter
    if (objectID) {
      Object.keys(channel).forEach(key => {
        feature.attributes[key] = channel[key];
      });
    }
    const snapshotResult = await getChannelSnapshotAPI({
      streamId: 0,
      time: '',
      deviceId: channel.deviceId,
      channelId: channel.channelId
    });
    if (snapshotResult) {
      const featureModified = mapTools.addTemplateIntoFeatureToShowSnapshot(
        mapClass,
        snapshotResult,
        ivhPopupTemplate,
        feature
      );
      view.popup.open({
        highlightEnabled: false,
        location: featureModified.geometry,
        features: [featureModified]
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Show Snapshot:', error.message, 'error:', error);
  }
};

const tools = { mapTools, dataTools };
export default tools;
