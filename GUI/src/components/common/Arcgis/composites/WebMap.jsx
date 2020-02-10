/*
 * @Description: Web Map
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-06-03 14:45:59
 * @LastEditTime: 2019-07-15 14:25:52
 * @LastEditors: Kevin
 */

import React from 'react';
import PropTypes from 'prop-types';
import { baseProps } from './MapBase';
import { ArcWebMapBase } from './MapComposites';

export const WebMap = props => {
  const { mapProperties, viewProperties } = props;
  return (
    <ArcWebMapBase
      scriptUri={['esri/WebMap', 'esri/views/MapView', 'dojo/promise/all']}
      {...props}
      mapProperties={mapProperties}
      viewProperties={viewProperties}
    />
  );
};

WebMap.propTypes = {
  ...baseProps,
  id: PropTypes.string.isRequired,
  mapProperties: PropTypes.object.isRequired,
  viewProperties: PropTypes.object.isRequired
};

export const WebScene = props => {
  const { mapProperties, viewProperties } = props;
  return (
    <ArcWebMapBase
      scriptUri={['esri/WebScene', 'esri/views/SceneView', 'dojo/promise/all']}
      {...props}
      mapProperties={mapProperties}
      viewProperties={viewProperties}
    />
  );
};

WebScene.propTypes = {
  ...baseProps,
  id: PropTypes.string.isRequired,
  mapProperties: PropTypes.object.isRequired,
  viewProperties: PropTypes.object.isRequired
};
