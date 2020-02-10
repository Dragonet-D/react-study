/*
 * @Description: Map and Scene
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-06-03 14:45:50
 * @LastEditTime: 2019-09-11 11:13:45
 * @LastEditors: Kevin
 */

import React from 'react';
import PropTypes from 'prop-types';
import { baseProps } from './MapBase';
import { ArcMapBase } from './MapComposites';

export const Map = props => {
  const { mapProperties, viewProperties } = props;
  return (
    <ArcMapBase
      scriptUri={[
        'esri/Map',
        'esri/views/MapView',
        'esri/Basemap',
        'esri/layers/TileLayer',
        'esri/core/urlUtils',
        'esri/config'
      ]}
      {...props}
      mapProperties={{
        ...mapProperties
      }}
      viewProperties={{
        center: [103.838665, 1.302981],
        zoom: 11,
        ...viewProperties
      }}
    />
  );
};

Map.propTypes = {
  ...baseProps,
  mapProperties: PropTypes.object.isRequired,
  viewProperties: PropTypes.object.isRequired
};

export const Scene = props => {
  const { mapProperties, viewProperties } = props;
  return (
    <ArcMapBase
      scriptUri={['esri/Map', 'esri/views/SceneView']}
      {...props}
      mapProperties={{
        basemap: 'satellite',
        ground: 'world-elevation',
        ...mapProperties
      }}
      viewProperties={{
        center: [103.838665, 1.302981],
        zoom: 11,
        ...viewProperties
      }}
    />
  );
};

Scene.propTypes = {
  ...baseProps,
  mapProperties: PropTypes.object.isRequired,
  viewProperties: PropTypes.object.isRequired
};
