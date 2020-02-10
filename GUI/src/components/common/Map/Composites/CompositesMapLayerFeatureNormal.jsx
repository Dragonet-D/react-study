/*
 * @Description: Map Feature Layer Normal
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-08-26 01:34:12
 * @LastEditTime: 2019-09-25 15:33:28
 * @LastEditors: Kevin
 */

import { useState, useEffect, useContext } from 'react';
import Context from 'utils/createContext';
import { loadModules } from 'esri-loader';
import _ from 'lodash';
import settings from 'commons/map/setting';
import tools, {
  clearChannelsInformationsOfGeoDB,
  addChannelsIntoGeoDB,
  setPermission
} from 'commons/map/utils';

const modulesUri = [
  'esri/layers/FeatureLayer',
  'esri/tasks/support/Query',
  'esri/geometry/SpatialReference',
  'esri/tasks/support/ProjectParameters',
  'esri/geometry/Point',
  'esri/tasks/GeometryService',
  'esri/Graphic',
  'esri/tasks/Locator'
];

export default function FeatureLayerNormal(props) {
  const { data, channelSelected, map, view } = props;
  const [featureLayer, setFeatureLayer] = useState(null);
  const [mapConstructor, setMapConstructor] = useState({});
  const { highlight } = useContext(Context);
  useEffect(() => {
    loadMapModules();
    return function cleanup() {
      const featureLayer = map.findLayerById(settings.layerId.normal);
      map.remove(featureLayer);
    };
  }, []);

  useEffect(() => {
    if (!_.isEmpty(mapConstructor) && !_.isEmpty(channelSelected) && featureLayer) {
      tools.mapTools.highlightChannelsSelected(
        mapConstructor,
        view,
        featureLayer,
        channelSelected,
        highlight
      );
    }
  }, [channelSelected]);

  return null;

  async function loadMapModules() {
    try {
      const modules = await loadModules([...modulesUri], { url: settings.urls.module.current.js });
      const [
        FeatureLayer,
        Query,
        SpatialReference,
        ProjectParameters,
        Point,
        GeometryService,
        Graphic,
        Locator
      ] = modules;

      const mapClass = {
        FeatureLayer,
        Query,
        SpatialReference,
        ProjectParameters,
        Point,
        GeometryService,
        Graphic,
        Locator
      };

      const layerNormal = new FeatureLayer({
        url: settings.urls.layer.ivhChannels,
        id: settings.layerId.normal,
        outFields: ['*'],
        labelsVisible: true,
        definitionExpression: setPermission('channelId', data)
      });

      setFeatureLayer(layerNormal);
      await initFeatureLayerData(mapClass, layerNormal);
      setMapConstructor(mapClass);
      map.add(layerNormal);
      layerNormal.when(() => {
        view.goTo(
          {
            center: [103.811346, 1.336091]
          },
          {
            duration: 2000,
            easing: 'in-expo'
          }
        );
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Map Feature Layer Normal: ', error.mesasge, 'error:', error);
    }
  }

  async function initFeatureLayerData(mapClass, layer) {
    // first to clear
    await clearChannelsInformationsOfGeoDB(mapClass, layer);
    // second to add
    await addChannelsIntoGeoDB({
      mapClass,
      layer,
      data,
      url: settings.urls.tool.geometryServer,
      type: 'normal'
    });
  }
}
