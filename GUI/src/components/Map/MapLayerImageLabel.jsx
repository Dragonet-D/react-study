/*
 * @Description: Map Image Layer For Label
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-07-12 10:55:38
 * @LastEditTime: 2019-09-20 15:31:04
 * @LastEditors: Kevin
 */

import { useEffect } from 'react';
import { loadModules } from 'esri-loader';
import { urls, imageLayerId, layerId } from 'commons/map/setting';
import { setPermission } from 'commons/map/utils';

const MapLayerImageLabel = props => {
  const { normalData, alarmData, map } = props;
  useEffect(() => {
    loadModules(['esri/layers/MapImageLayer'], { url: urls.module.current.js })
      .then(([MapImageLayer]) => {
        const imageLayer = new MapImageLayer({
          url: urls.layer.ivhCameraImageLayer,
          id: layerId.image,
          sublayers: [
            {
              id: imageLayerId[layerId.alarm],
              visible: true,
              definitionExpression: setPermission('channelId', alarmData)
            },
            {
              id: imageLayerId[layerId.normal],
              visible: true,
              definitionExpression: setPermission('channelId', normalData)
            }
          ],
          refreshInterval: 0.1
        });

        map.add(imageLayer);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Map Image Layer For Label:', error.message, 'error:', error);
      });

    return function cleanup() {
      const mapImageLayer = map.findLayerById(layerId.image);
      map.remove(mapImageLayer);
    };
  }, [alarmData, map, normalData]);

  return null;
};

export default MapLayerImageLabel;
