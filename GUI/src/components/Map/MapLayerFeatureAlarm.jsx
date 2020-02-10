/*
 * @Description: Map Feature Layer Alarm
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-07-10 10:49:06
 * @LastEditTime: 2019-09-23 02:02:44
 * @LastEditors: Kevin
 */

import { useState, useEffect, useContext, useRef } from 'react';
import _ from 'lodash';
import { loadModules } from 'esri-loader';
import Context from 'utils/createContext';
import { urls, layerId } from 'commons/map/setting';
import tools, {
  setPermission,
  clearChannelsInformationsOfGeoDB,
  addChannelsIntoGeoDB
} from 'commons/map/utils';
import getClusterLayer from 'components/common/Arcgis/CustomLayers/ClusterLayer_v4.11';

const modulesUri = [
  'esri/geometry/SpatialReference',
  'esri/PopupTemplate',
  'esri/layers/FeatureLayer',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/SimpleFillSymbol',
  'esri/renderers/ClassBreaksRenderer',
  'esri/request',
  'esri/renderers/support/jsonUtils',
  'esri/tasks/support/Query',
  'esri/tasks/support/ProjectParameters',
  'esri/geometry/Point',
  'esri/tasks/GeometryService',
  'esri/Graphic'
];

const FeatureLayerAlarm = props => {
  const { data, view, map } = props;
  const [mapConstructor, setMapConstructor] = useState({});
  const [featureLayer, setFeatureLayer] = useState(null);
  const {
    contextMenu: { alarmTable },
    highlight
  } = useContext(Context);
  const { setHideContextMenuAlarmTable, setMenuAlarmTableData } = alarmTable;

  const loadMapModulesRef = useRef({
    tracker: loadMapModules
  });

  useEffect(() => {
    const { tracker } = loadMapModulesRef.current;
    tracker();
    return function cleanup() {
      const alarmLayer = map.findLayerById(layerId.alarm);
      map.remove(alarmLayer);
    };
  }, []);

  useEffect(() => {
    async function initFeatureLayerData(mapClass, layer) {
      // first to clear
      await clearChannelsInformationsOfGeoDB(mapClass, layer);
      // second to add
      await addChannelsIntoGeoDB({
        mapClass,
        layer,
        data,
        url: urls.tool.geometryServer,
        type: 'alarm'
      });
    }

    if (!_.isEmpty(mapConstructor) && featureLayer) {
      initFeatureLayerData(mapConstructor, featureLayer);
    }
  }, [data, featureLayer, mapConstructor]);

  useEffect(() => {
    if (_.isEmpty(mapConstructor)) return;
    async function getClusterLayerData() {
      try {
        const { FlareClusterLayer } = await getClusterLayer();
        const {
          SpatialReference,
          PopupTemplate,
          FeatureLayer,
          SimpleMarkerSymbol,
          SimpleLineSymbol,
          SimpleFillSymbol,
          ClassBreaksRenderer,
          esriRequest,
          rendererJsonUtils
        } = mapConstructor;

        const featureLayer = new FeatureLayer({
          url: urls.layer.ivhChannelsAlarm,
          id: layerId.alarm,
          outFields: ['*'],
          definitionExpression: setPermission('channelId', data)
        });

        featureLayer.queryFeatures().then(res => {
          const features = res.features.map(feature => {
            const { attributes } = feature;
            return {
              x: attributes.longitude,
              y: attributes.latitude,
              OBJECTID: attributes.OBJECTID,
              channelName: attributes.channelName,
              eventType: attributes.eventType,
              userId: attributes.userId,
              alarmNumber: attributes.alarmNumber
            };
          });

          esriRequest(`${urls.layer.ivhChannelsAlarm}?f=json`).then(res => {
            const currentRenderer = rendererJsonUtils.fromJSON(res.data.drawingInfo.renderer);
            // console.log({ rendererJsonUtils: renderer, res: res });
            initLayer(
              {
                SpatialReference,
                PopupTemplate,
                FeatureLayer,
                SimpleMarkerSymbol,
                SimpleLineSymbol,
                SimpleFillSymbol,
                ClassBreaksRenderer,
                FlareClusterLayer
              },
              features,
              currentRenderer
            );
          });
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Map Feature Layer Alarm:', error.message, 'error:', error);
      }
    }

    function initLayer(mapClass, features, currentRenderer) {
      // set some defaults
      const maxSingleFlareCount = 8;
      const areaDisplayMode = 'activated';
      const {
        SpatialReference,
        PopupTemplate,
        SimpleMarkerSymbol,
        SimpleLineSymbol,
        SimpleFillSymbol,
        ClassBreaksRenderer,
        FlareClusterLayer
      } = mapClass;
      const defaultSym = new SimpleMarkerSymbol({
        size: 6,
        color: '#FF0000',
        outline: null
      });

      const renderer = new ClassBreaksRenderer({
        defaultSymbol: defaultSym
      });
      renderer.field = 'clusterCount';

      const smSymbol = new SimpleMarkerSymbol({
        size: 22,
        outline: new SimpleLineSymbol({ color: [221, 159, 34, 1] }),
        color: [245, 34, 45, 0.9]
      });
      const mdSymbol = new SimpleMarkerSymbol({
        size: 24,
        outline: new SimpleLineSymbol({ color: [82, 163, 204, 1] }),
        color: [245, 34, 45, 0.9]
      });
      const lgSymbol = new SimpleMarkerSymbol({
        size: 28,
        outline: new SimpleLineSymbol({ color: [41, 163, 41, 0.8] }),
        color: [245, 34, 45, 0.9]
      });
      const xlSymbol = new SimpleMarkerSymbol({
        size: 32,
        outline: new SimpleLineSymbol({ color: [200, 52, 59, 0.8] }),
        color: [245, 34, 45, 0.9]
      });

      renderer.addClassBreakInfo(0, 19, smSymbol);
      renderer.addClassBreakInfo(20, 150, mdSymbol);
      renderer.addClassBreakInfo(151, 1000, lgSymbol);
      renderer.addClassBreakInfo(1001, Infinity, xlSymbol);

      let areaRenderer = null;

      // if area display mode is set. Create a renderer to display cluster areas. Use SimpleFillSymbols as the areas are polygons
      const defaultAreaSym = new SimpleFillSymbol({
        style: 'solid',
        color: [0, 0, 0, 0.2],
        outline: new SimpleLineSymbol({ color: [0, 0, 0, 0.3] })
      });

      areaRenderer = new ClassBreaksRenderer({
        defaultSymbol: defaultAreaSym
      });
      areaRenderer.field = 'clusterCount';

      const smAreaSymbol = new SimpleFillSymbol({
        color: [245, 34, 45, 0.4],
        outline: new SimpleLineSymbol({ color: [245, 34, 45, 1], style: 'dash' })
      });
      const mdAreaSymbol = new SimpleFillSymbol({
        color: [245, 34, 45, 0.4],
        outline: new SimpleLineSymbol({ color: [245, 34, 45, 1], style: 'dash' })
      });
      const lgAreaSymbol = new SimpleFillSymbol({
        color: [245, 34, 45, 0.4],
        outline: new SimpleLineSymbol({ color: [245, 34, 45, 1], style: 'dash' })
      });
      const xlAreaSymbol = new SimpleFillSymbol({
        color: [245, 34, 45, 0.4],
        outline: new SimpleLineSymbol({ color: [245, 34, 45, 1], style: 'dash' })
      });

      areaRenderer.addClassBreakInfo(0, 19, smAreaSymbol);
      areaRenderer.addClassBreakInfo(20, 150, mdAreaSymbol);
      areaRenderer.addClassBreakInfo(151, 1000, lgAreaSymbol);
      areaRenderer.addClassBreakInfo(1001, Infinity, xlAreaSymbol);

      // Set up another class breaks renderer to style the flares individually
      const flareRenderer = new ClassBreaksRenderer({
        defaultSymbol: renderer.defaultSymbol
      });
      flareRenderer.field = 'clusterCount';

      const smFlareSymbol = new SimpleMarkerSymbol({
        size: 14,
        outline: new SimpleLineSymbol({ color: [221, 159, 34, 1] }),
        color: [245, 34, 45, 0.9]
      });
      const mdFlareSymbol = new SimpleMarkerSymbol({
        size: 14,
        outline: new SimpleLineSymbol({ color: [221, 159, 34, 1] }),
        color: [245, 34, 45, 0.9]
      });
      const lgFlareSymbol = new SimpleMarkerSymbol({
        size: 14,
        outline: new SimpleLineSymbol({ color: [221, 159, 34, 1] }),
        color: [245, 34, 45, 0.9]
      });
      const xlFlareSymbol = new SimpleMarkerSymbol({
        size: 14,
        outline: new SimpleLineSymbol({ color: [221, 159, 34, 1] }),
        color: [245, 34, 45, 0.9]
      });

      flareRenderer.addClassBreakInfo(0, 19, smFlareSymbol);
      flareRenderer.addClassBreakInfo(20, 150, mdFlareSymbol);
      flareRenderer.addClassBreakInfo(151, 1000, lgFlareSymbol);
      flareRenderer.addClassBreakInfo(1001, Infinity, xlFlareSymbol);

      // set up a popup template
      const popupTemplate = new PopupTemplate({
        title: '{channelNumber}',
        content: [
          {
            type: 'fields',
            fieldInfos: [
              { fieldName: 'channelName', label: 'Channel Name', visible: true },
              { fieldName: 'eventType', label: 'Event Type', visible: true },
              { fieldName: 'userId', label: 'User ID', visible: true },
              { fieldName: 'alarmNumber', label: 'Alarm Number', visible: true }
            ]
          }
        ]
      });

      const options = {
        id: layerId.clusterAlarm,
        labelField: 'alarmNumber',
        singleRenderer: currentRenderer,
        clusterRenderer: renderer,
        areaRenderer,
        flareRenderer,
        singlePopupTemplate: popupTemplate,
        spatialReference: new SpatialReference({ wkid: 4326 }),
        subTypeFlareProperty: 'channelName',
        singleFlareTooltipProperty: 'channelName',
        displaySubTypeFlares: true,
        maxSingleFlareCount,
        clusterRatio: 75,
        // clusterRatio: 500,
        clusterToScale: 1000,
        clusterAreaDisplay: areaDisplayMode,
        data: features
      };

      const clusterLayer = new FlareClusterLayer(options);
      map.add(clusterLayer, 1);
      // console.log({ 'cluster-layer': map });

      clusterLayer.on('draw-complete', () => {
        // console.log('draw complete event callback');
      });
    }

    getClusterLayerData();
    return function cleanup() {
      const clusterLayer = map.findLayerById(layerId.clusterAlarm);
      map.remove(clusterLayer);
    };
  }, [map, mapConstructor, data]);

  async function loadMapModules() {
    try {
      const modules = await loadModules([...modulesUri], { url: urls.module.current.js });
      const [
        SpatialReference,
        PopupTemplate,
        FeatureLayer,
        SimpleMarkerSymbol,
        SimpleLineSymbol,
        SimpleFillSymbol,
        ClassBreaksRenderer,
        esriRequest,
        rendererJsonUtils,
        Query,
        ProjectParameters,
        Point,
        GeometryService,
        Graphic
      ] = modules;

      const mapClass = {
        SpatialReference,
        PopupTemplate,
        FeatureLayer,
        SimpleMarkerSymbol,
        SimpleLineSymbol,
        SimpleFillSymbol,
        ClassBreaksRenderer,
        esriRequest,
        rendererJsonUtils,
        Query,
        ProjectParameters,
        Point,
        GeometryService,
        Graphic
      };

      const alarmLayer = new FeatureLayer({
        url: urls.layer.ivhChannelsAlarm,
        id: layerId.alarm,
        outFields: ['*'],
        visible: false,
        definitionExpression: setPermission('channelId', data)
      });

      setFeatureLayer(alarmLayer);
      setMapConstructor(mapClass);
      addMapClickEvent(alarmLayer);
      map.add(alarmLayer, 3);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Map Feature Layer Alarm:', error.message, 'error:', error);
    }
  }

  function addMapClickEvent(layer) {
    view.on('click', event => {
      if (!layer) return;
      setHideContextMenuAlarmTable(true);

      view.hitTest(event).then(response => {
        // refresh layer to update feature data
        if (response.results[0].graphic && response.results[0].graphic.layer.id === layerId.alarm) {
          if (event.button === 0) {
            const selectFeature = _.curry(tools.mapTools.highlightSingleFeature)(
              view,
              layer,
              highlight
            );
            selectFeature(response.results[0].graphic.attributes[layer.objectIdField]);
            // set Hiding Sensor List Of Same Coordinate
            const alarmTableMenuArea = document.getElementById('alarmTableMenuArea');
            alarmTableMenuArea.style.top = `${event.y + 5}px`;
            alarmTableMenuArea.style.left = `${event.x + 5}px`;
            const channel = response.results[0].graphic.attributes;
            let nodes = null;

            data.forEach(item => {
              if (item.channelIds.includes(channel.channelId)) {
                nodes = item.nodes || [];
              }
            });

            if (channel.alarmNumber > 0 && !!nodes && nodes.length > 0) {
              setHideContextMenuAlarmTable(false);
              setMenuAlarmTableData(nodes);
            }
          }
        }
      });
    });
  }

  return null;

  // async function initFeatureLayerData(mapClass, layer) {
  //   // first to clear
  //   await clearChannelsInformationsOfGeoDB(mapClass, layer);
  //   // second to add
  //   await addChannelsIntoGeoDB({
  //     mapClass,
  //     layer,
  //     data,
  //     url: urls.tool.geometryServer,
  //     type: 'alarm'
  //   });
  // }
};

export default FeatureLayerAlarm;
