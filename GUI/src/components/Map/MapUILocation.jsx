/*
 * @Description:  Map Location Widget
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-07-15 10:08:17
 * @LastEditTime: 2019-07-21 13:45:59
 * @LastEditors: Kevin
 */

import { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';
import { urls } from 'commons/map/setting';

const MapUILocation = props => {
  const [locationWidget, setLocationWidget] = useState(null);

  useEffect(() => {
    loadModules(['esri/widgets/Locate'], { url: urls.module.current.js })
      .then(([Locate]) => {
        const location = new Locate({ view: props.view });

        props.view.ui.add(location, { position: 'top-left', index: 3 });
        setLocationWidget(location);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Locate Widget:', error.message, 'error:', error);
      });

    return function cleanup() {
      props.view.ui.remove(locationWidget);
    };
  }, []);

  return null;
};

export default MapUILocation;
