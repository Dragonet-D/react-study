/*
 * @Description: Map Feature Layer Normal
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-07-10 10:48:56
 * @LastEditTime: 2019-10-10 17:20:11
 * @LastEditors: Kevin
 */

import React, { useState, useEffect, useContext, useRef } from 'react';
import Context from 'utils/createContext';
import { loadModules } from 'esri-loader';
import _ from 'lodash';
import settings from 'commons/map/setting';
import tools, {
  clearChannelsInformationsOfGeoDB,
  addChannelsIntoGeoDB,
  setPermission,
  updateChannelLocation
} from 'commons/map/utils';
import { ConfirmPage } from 'components/common';
import getClusterLayer from 'components/common/Arcgis/CustomLayers/ClusterLayer_v4.11';

const modulesUri = [
  'esri/layers/FeatureLayer',
  'esri/tasks/support/Query',
  'esri/geometry/SpatialReference',
  'esri/tasks/support/ProjectParameters',
  'esri/geometry/Point',
  'esri/tasks/GeometryService',
  'esri/Graphic',
  'esri/tasks/Locator',
  'esri/PopupTemplate',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/SimpleFillSymbol',
  'esri/renderers/ClassBreaksRenderer',
  'esri/request',
  'esri/renderers/support/jsonUtils'
];

export default function FeatureLayerNormal(props) {
  const { data, channelDragged, channelSelected, map, view } = props;
  const [featureLayer, setFeatureLayer] = useState(null);
  const [clusterLayer, setClusterLayer] = useState(null);
  const [mapConstructor, setMapConstructor] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const {
    highlight,
    contextMenu: { normalSingle, normalMulti }
  } = useContext(Context);
  const { setHideContextMenuNormalSingle, setMenuSingleParameter } = normalSingle;
  const { setHideContextMenuNormalMulti, setMenuMultiParameter } = normalMulti;

  const loadMapModulesInit = useRef({
    tracker: loadMapModules
  });
  useEffect(() => {
    const { tracker } = loadMapModulesInit.current;
    tracker();
    return function cleanup() {
      const featureLayer = map.findLayerById(settings.layerId.normal);
      map.remove(featureLayer);
    };
  }, [map]);

  useEffect(() => {
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

    if (!_.isEmpty(mapConstructor) && featureLayer) {
      initFeatureLayerData(mapConstructor, featureLayer);
    }
  }, [data, featureLayer, mapConstructor]);

  useEffect(() => {
    if (channelDragged) {
      openConfirmPage();
    }
  }, [channelDragged]);

  useEffect(() => {
    if (!_.isEmpty(mapConstructor) && !_.isEmpty(channelSelected) && clusterLayer) {
      tools.mapTools.highlightChannelsSelectedWithGraphicLayer(
        mapConstructor,
        view,
        clusterLayer,
        channelSelected,
        highlight
      );
    }
  }, [channelSelected, clusterLayer, highlight, mapConstructor, view]);

  useEffect(() => {
    if (_.isEmpty(mapConstructor)) return;
    async function getClusterLayerData() {
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

      const userId = tools.dataTools.getUserId();
      const features = data.map((item, index) => {
        return {
          x: Number(item.installation.longitude),
          y: Number(item.installation.latitude),
          userId,
          OBJECTID: index + 1,
          channelAddress: item.installation.address,
          deviceId: item.deviceId || '',
          channelId: item.channelId || '',
          channelName: item.channelName || '',
          channelDescription: item.description || '',
          buildingName: item.installation.buildingName || '',
          channelNumber: item.channelNumber || 0, // count channel number
          status: item.status && item.status.toLowerCase() === 'active' ? 1 : 0,
          ptzInd: item.ptzInd || '',
          longitude: Number(item.installation.longitude),
          latitude: Number(item.installation.latitude),
          distance: item.installation.distance || 0,
          direction: item.installation.direction || '',
          groupName: item.groupName,
          groupId: item.parentGroupId,
          symbolRender:
            item.status && item.status.toLowerCase() === 'active'
              ? `${item.ptzInd} 1`
              : `${item.ptzInd} 0`
        };
      });
      // console.log({ features });

      esriRequest(`${settings.urls.layer.ivhChannels}?f=json`).then(res => {
        const currentRenderer = rendererJsonUtils.fromJSON(res.data.drawingInfo.renderer);
        // console.log({ rendererJsonUtils: currentRenderer, res });
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
    }

    function initLayer(mapClass, features, currentRenderer) {
      // set some defaults
      const maxSingleFlareCount = 8;
      const areaDisplayMode = 'activated';
      const {
        SpatialReference,
        // PopupTemplate,
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
        outline: new SimpleLineSymbol({ color: [221, 159, 34, 0.8] }),
        color: [129, 211, 252, 1]
      });
      const mdSymbol = new SimpleMarkerSymbol({
        size: 24,
        outline: new SimpleLineSymbol({ color: [82, 163, 204, 0.8] }),
        color: [129, 211, 252, 1]
      });
      const lgSymbol = new SimpleMarkerSymbol({
        size: 28,
        outline: new SimpleLineSymbol({ color: [41, 163, 41, 0.8] }),
        color: [129, 211, 252, 1]
      });
      const xlSymbol = new SimpleMarkerSymbol({
        size: 32,
        outline: new SimpleLineSymbol({ color: [200, 52, 59, 0.8] }),
        color: [129, 211, 252, 1]
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
        color: [129, 211, 252, 0.4],
        outline: new SimpleLineSymbol({ color: [129, 211, 252, 1], style: 'dash' })
      });
      const mdAreaSymbol = new SimpleFillSymbol({
        color: [129, 211, 252, 0.4],
        outline: new SimpleLineSymbol({ color: [129, 211, 252, 1], style: 'dash' })
      });
      const lgAreaSymbol = new SimpleFillSymbol({
        color: [129, 211, 252, 0.4],
        outline: new SimpleLineSymbol({ color: [129, 211, 252, 1], style: 'dash' })
      });
      const xlAreaSymbol = new SimpleFillSymbol({
        color: [129, 211, 252, 0.4],
        outline: new SimpleLineSymbol({ color: [129, 211, 252, 1], style: 'dash' })
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
        outline: new SimpleLineSymbol({ color: [200, 52, 59, 0.8] }),
        color: [129, 211, 252, 0.8]
      });
      const mdFlareSymbol = new SimpleMarkerSymbol({
        size: 14,
        outline: new SimpleLineSymbol({ color: [200, 52, 59, 0.8] }),
        color: [129, 211, 252, 0.8]
      });
      const lgFlareSymbol = new SimpleMarkerSymbol({
        size: 14,
        outline: new SimpleLineSymbol({ color: [200, 52, 59, 0.8] }),
        color: [129, 211, 252, 0.8]
      });
      const xlFlareSymbol = new SimpleMarkerSymbol({
        size: 14,
        outline: new SimpleLineSymbol({ color: [200, 52, 59, 0.8] }),
        color: [129, 211, 252, 0.8]
      });

      flareRenderer.addClassBreakInfo(0, 19, smFlareSymbol);
      flareRenderer.addClassBreakInfo(20, 150, mdFlareSymbol);
      flareRenderer.addClassBreakInfo(151, 1000, lgFlareSymbol);
      flareRenderer.addClassBreakInfo(1001, Infinity, xlFlareSymbol);

      // set up a popup template
      // const popupTemplate = new PopupTemplate({
      //   title: '{channelNumber}',
      //   content: [
      //     {
      //       type: 'fields',
      //       fieldInfos: [
      //         { fieldName: 'channelName', label: 'Channel Name', visible: true },
      //         { fieldName: 'channelAddress', label: 'Channel Address', visible: true },
      //         { fieldName: 'userId', label: 'User ID', visible: true },
      //         { fieldName: 'channelNumber', label: 'Channel Number', visible: true }
      //       ]
      //     }
      //   ]
      // });

      const options = {
        id: settings.layerId.clusterNormal,
        labelField: 'channelNumber',
        singleRenderer: currentRenderer,
        clusterRenderer: renderer,
        areaRenderer,
        flareRenderer,
        // singlePopupTemplate: popupTemplate,
        singlePopupTemplate: null,
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

      const layerCluster = new FlareClusterLayer(options);
      setClusterLayer(layerCluster);
      map.add(layerCluster, 0);

      layerCluster.when(() => {
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
      layerCluster.on('draw-complete', () => {
        // console.log('draw complete event callback');
      });
    }

    getClusterLayerData();
    return function cleanup() {
      const layerCluster = map.findLayerById(settings.layerId.clusterNormal);
      map.remove(layerCluster);
    };
  }, [map, mapConstructor, data, view]);

  return (
    <ConfirmPage
      message="Confirm executing this operation to update channel geographic position?"
      messageTitle="Update Channel Address"
      isConfirmPageOpen={isOpen}
      hanldeConfirmMessage={executeConfirmMethod}
      handleConfirmPageClose={closeConfirmPage}
    />
  );

  async function loadMapModules() {
    try {
      const modules = await loadModules([...modulesUri], {
        url: settings.urls.module.current.js
      });
      const [
        FeatureLayer,
        Query,
        SpatialReference,
        ProjectParameters,
        Point,
        GeometryService,
        Graphic,
        Locator,
        PopupTemplate,
        SimpleMarkerSymbol,
        SimpleLineSymbol,
        SimpleFillSymbol,
        ClassBreaksRenderer,
        esriRequest,
        rendererJsonUtils
      ] = modules;

      const mapClass = {
        FeatureLayer,
        Query,
        SpatialReference,
        ProjectParameters,
        Point,
        GeometryService,
        Graphic,
        Locator,
        PopupTemplate,
        SimpleMarkerSymbol,
        SimpleLineSymbol,
        SimpleFillSymbol,
        ClassBreaksRenderer,
        esriRequest,
        rendererJsonUtils
      };

      const layerNormal = new FeatureLayer({
        url: settings.urls.layer.ivhChannels,
        id: settings.layerId.normal,
        outFields: ['*'],
        visible: false,
        definitionExpression: setPermission('channelId', data),
        refreshInterval: 0.1
      });

      setFeatureLayer(layerNormal);
      setMapConstructor(mapClass);
      addMapClickEvent(layerNormal);
      map.add(layerNormal, 2);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Map Feature Layer Normal: ', error.mesasge, 'error:', error);
    }
  }

  function addMapClickEvent(featureLayer) {
    view.on('click', event => {
      if (featureLayer) {
        highlight.clear();
        setHideContextMenuNormalMulti(true);
        setHideContextMenuNormalSingle(true);

        view.hitTest(event).then(response => {
          /* ************************* ivhCameraLayer and right click ************************* */
          const theFirstLayerOnTop = response.results[0] && response.results[0].graphic;
          const theSecondLayerOnTop = response.results[1] && response.results[1].graphic;
          if (
            theFirstLayerOnTop.layer.id === settings.layerId.clusterNormal ||
            theSecondLayerOnTop.layer.id === settings.layerId.clusterNormal
          ) {
            // right click to open context menu
            let channel = null;

            if (theFirstLayerOnTop.layer.id === settings.layerId.clusterNormal) {
              channel = theFirstLayerOnTop.attributes;
            } else if (theSecondLayerOnTop.layer.id === settings.layerId.clusterNormal) {
              channel = theSecondLayerOnTop.attributes;
            }
            const selectFeature = _.curry(tools.mapTools.highlightSingleFeature)(
              view,
              featureLayer,
              highlight
            );
            selectFeature(channel[featureLayer.objectIdField]);

            if (event.button === 2) {
              /* Single Channel */
              const contextMenuArea = document.getElementById('contextMenuArea');
              contextMenuArea.style.top = `${event.y + 5}px`;
              contextMenuArea.style.left = `${event.x + 5}px`;
              const { status } = channel;
              const number = channel.channelNumber;
              if (status && number === 1) {
                setHideContextMenuNormalSingle(false);
                setMenuSingleParameter({ attributes: channel, mapEvent: response });
              }

              /* Sensor List Data Of Same Coordinate */
              selectFeature(channel[featureLayer.objectIdField]);

              // set Hiding Sensor List Of Same Coordinate
              const sensorListDataOfSameCoordinate = document.getElementById(
                'sensorListDataOfSameCoordinate'
              );
              sensorListDataOfSameCoordinate.style.top = `${event.y + 5}px`;
              sensorListDataOfSameCoordinate.style.left = `${event.x + 5}px`;
              const id = channel.channelId;
              let nodes = null;

              data.forEach(item => {
                const ids = item.nodes.map(t => t.channelId);
                if (ids.includes(id)) {
                  nodes = item.nodes || [];
                }
              });

              if (channel.channelNumber > 1 && !!nodes && nodes.length > 0) {
                setHideContextMenuNormalMulti(false);
                setMenuMultiParameter({
                  data: nodes,
                  mapEvent: response,
                  attributes: channel
                });
              }
            }
          }
        });
      }
    });
  }

  // will be refactored
  function openConfirmPage() {
    setIsOpen(true);
  }

  function closeConfirmPage() {
    setIsOpen(false);
  }

  function executeConfirmMethod() {
    if (
      !_.isEmpty(mapConstructor) &&
      channelDragged &&
      channelDragged.clientOffset &&
      channelDragged.data &&
      featureLayer
    ) {
      const { clientOffset: point, data: channel } = channelDragged;
      updateChannelLocation(
        mapConstructor,
        map,
        view,
        featureLayer,
        settings.urls.tool.geoAddressServer,
        channel,
        point
      );
    }
    closeConfirmPage(false);
  }
}
