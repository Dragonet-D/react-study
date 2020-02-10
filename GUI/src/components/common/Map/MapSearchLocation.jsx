/*
 * @Description: Map
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-08-26 02:16:08
 * @LastEditTime: 2019-09-03 12:33:43
 * @LastEditors: Kevin
 */

import React from 'react';
import { Map } from 'components/common/Arcgis';
import { urls } from 'commons/map/setting';
import { Loading } from 'components/Loading';
import CompositesMapUICompass from './Composites/CompositesMapUICompass';
import CompositesMapUILocation from './Composites/CompositesMapUILocation';
import CompositesMapUISearch from './Composites/CompositesMapUISearch';
import MapWrap from './Composites/MapWrap';

const mapSetting = {
  mapCssLoader: urls.module.css[4.11],
  loaderOptions: {
    url: urls.module.current.js
  },
  mapProperties: {},
  viewProperties: {
    center: [103.838665, 1.3],
    zoom: 10
  }
};

export default function MapSearchLocaton(props) {
  const { getMapInformation } = props;

  return (
    <MapWrap>
      <Map {...mapSetting} loadElement={<Loading />}>
        <CompositesMapUICompass />
        <CompositesMapUILocation />
        <CompositesMapUISearch getMapInformation={getMapInformation} />
      </Map>
    </MapWrap>
  );
}
