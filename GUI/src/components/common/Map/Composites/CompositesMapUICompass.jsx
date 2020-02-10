/*
 * @Description: Map Compass Widget
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-08-26 00:21:42
 * @LastEditTime: 2019-08-26 00:27:25
 * @LastEditors: Kevin
 */

import { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';
import { urls } from 'commons/map/setting';

const MapUILocation = props => {
  const [compassWidget, setCompassWidget] = useState(null);

  useEffect(() => {
    loadModules(['esri/widgets/Compass'], { url: urls.module.current.js })
      .then(([Compass]) => {
        const compass = new Compass({ view: props.view });

        props.view.ui.add(compass, { position: 'top-left', index: 3 });
        setCompassWidget(compass);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Compass Widget:', error.message, 'error:', error);
      });

    return function cleanup() {
      props.view.ui.remove(compassWidget);
    };
  }, []);

  return null;
};

export default MapUILocation;
