/*
 * @Description: Map Composites
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-06-03 13:45:39
 * @LastEditTime: 2019-09-11 11:13:38
 * @LastEditors: Kevin
 */

import React from 'react';
import PropTypes from 'prop-types';
import settings from 'commons/map/setting';
import tools from 'commons/map/utils';
import envconfig from 'utils/envconfig';
import { baseProps, MapBase } from './MapBase';

const mapEvent = {
  onClick: 'click',
  onDoubleClick: 'double-click',
  onDrag: 'drag',
  onHold: 'hold',
  onKeyDown: 'key-down',
  onKeyUp: 'key-up',
  onLayerViewCreate: 'layerview-create',
  onLayerViewDestroy: 'layerview-destroy',
  onMouseWheel: 'mouse-wheel',
  onPointerDown: 'pointer-down',
  onPointerMove: 'pointer-move',
  onPointerUp: 'pointer-up',
  onResize: 'resize'
};

export const ArcMapBase = props => (
  <MapBase
    {...props}
    loadMap={([Map, View, Basemap, TileLayer, urlUtils, esriConfig], containerId) => {
      const mapData = new Promise((resolve, reject) => {
        try {
          urlUtils.addProxyRule({
            urlPrefix: `${envconfig.arcgisAddress}/arcgis/rest/services`,
            proxyUrl: '/mapapi/proxy/proxy.jsp'
          });

          esriConfig.fontsUrl = `https://${window.location.host}/library/fonts`;

          const {
            mapTools: { getBasemap }
          } = tools;
          const { basemap, tileLayer } = getBasemap(
            { TileLayer, Basemap },
            settings.urls.layer.basemapLayer
          );
          // create map
          const map = new Map({
            basemap,
            ...props.mapProperties
          });

          const viewProperties = {
            map,
            container: containerId,
            ...props.viewProperties
          };

          // create map view
          const view = new View(viewProperties);

          // set event
          Object.keys(mapEvent).forEach(key => {
            if (props[key]) {
              view.on(mapEvent[key], props[key]);
            }
          });

          view.when(
            () => {
              resolve({ map, view });
              tileLayer.when(() => {
                view.goTo(tileLayer.fullExtent);
              });
            },
            error => {
              reject(error);
            }
          );
        } catch (error) {
          reject(error);
        }
      });

      return mapData;
    }}
  />
);

ArcMapBase.propTypes = {
  ...baseProps,
  scriptUri: PropTypes.arrayOf(PropTypes.string).isRequired
};

export const ArcWebMapBase = props => (
  <MapBase
    {...props}
    loadMap={([WebConstructor, ViewConstructor, all], containerId) => {
      const mapData = new Promise((resolve, reject) => {
        try {
          const map = new WebConstructor({
            portalItem: {
              id: props.id
            },
            ...props.mapProperties
          });

          map
            .load()
            .then(() => {
              return map.basemap.load();
            })
            .then(() => {
              const { allLayers } = map;
              const promises = allLayers.map(layer => layer.load());

              return all(promises.toArray());
            })
            .then(() => {
              const view = new ViewConstructor({
                container: containerId,
                map,
                ...props.viewProperties
              });

              // set event
              Object.keys(mapEvent).forEach(key => {
                if (props[key]) {
                  view.on(mapEvent[key], props[key]);
                }
              });

              resolve({ map, view });
            })
            .otherwise(error => {
              reject(error);
            });
        } catch (error) {
          reject(error);
        }
      });

      return mapData;
    }}
  />
);

ArcWebMapBase.propTypes = {
  ...baseProps,
  id: PropTypes.string.isRequired,
  scriptUri: PropTypes.arrayOf(PropTypes.string).isRequired
};
