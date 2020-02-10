import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'components/common/Arcgis';
import { urls } from 'commons/map/setting';
import { Loading } from 'components/Loading';
import CompositesMapUICompass from './Composites/CompositesMapUICompass';
import CompositesMapUILocation from './Composites/CompositesMapUILocation';
import CompositesMapDrawing from './Composites/CompositesMapDrawing';
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

export default function MapDrawing(props) {
  const { graphics } = props;

  return (
    <MapWrap>
      <Map {...mapSetting} loadElement={<Loading />}>
        <CompositesMapUICompass />
        <CompositesMapUILocation />
        <CompositesMapDrawing graphics={graphics} />
      </Map>
    </MapWrap>
  );
}

MapDrawing.defaultProps = {
  graphics: {}
};

MapDrawing.propTypes = {
  graphics: PropTypes.object
};
