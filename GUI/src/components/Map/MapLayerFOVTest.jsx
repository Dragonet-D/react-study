/*
 * @Description: Map Feature Layer FOV test
 * @Author: wwl
 */

import { useEffect } from 'react';
import { loadModules } from 'esri-loader';
import { urls } from 'commons/map/setting';

const modulesUri = ['esri/Graphic'];
const MapLayerFOVTest = props => {
  const { data, view, map, normalData } = props;

  useEffect(() => {
    loadMapModules();
    return function cleanup() {
      // map.remove(featureLayer);
    };
  }, [data, map, view]);

  function geoCalc(center, _offsetAng, _spreadAng, distance) {
    const radStep = 111319.55;
    const offsetAng = _offsetAng + 90 - _spreadAng / 2; //
    const spreadAng = _spreadAng;
    const pointArr = [];
    for (let i = 0; i < spreadAng + 1; i += 5) {
      const ang = (i + offsetAng) * (Math.PI / 180);
      pointArr.push([
        (distance * Math.cos(ang)) / radStep + center[0],
        (distance * Math.sin(ang)) / radStep + center[1]
      ]);
    }
    return [center, ...pointArr, center];
  }

  return null;

  // function renderObj() {}

  async function loadMapModules() {
    try {
      const modules = await loadModules([...modulesUri], { url: urls.module.current.js });
      const [Graphic] = modules;
      const renderArr = [];

      normalData.forEach(x => {
        if (
          x.installation &&
          x.installation.distance &&
          x.installation.direction &&
          x.installation.fieldOfView &&
          x.installation.latitude &&
          x.installation.longitude
        ) {
          const polygon = {
            type: 'polygon', // autocasts as new Polygon()
            rings: geoCalc(
              [parseFloat(x.installation.longitude, 10), parseFloat(x.installation.latitude, 10)],
              parseInt(x.installation.direction, 10),
              parseInt(x.installation.fieldOfView, 10),
              parseInt(x.installation.distance, 10)
            )
          };

          const fillSymbol = {
            type: 'simple-fill', // autocasts as new SimpleFillSymbol()
            color: [227, 139, 79, 0.8],
            outline: {
              // autocasts as new SimpleLineSymbol()
              color: [255, 255, 255],
              width: 2
            }
          };

          const polygonGraphic = new Graphic({
            geometry: polygon,
            symbol: fillSymbol
          });

          renderArr.push(polygonGraphic);
        }
      });

      view.graphics.addMany(renderArr);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Map Feature Layer FOV error:', error.message, 'error:', error);
    }
  }
};

export default MapLayerFOVTest;
