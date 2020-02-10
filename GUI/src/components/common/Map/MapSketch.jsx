import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Map } from 'components/common/Arcgis';
import { urls } from 'commons/map/setting';
import { Loading } from 'components/Loading';
import CompositesMapUICompass from './Composites/CompositesMapUICompass';
import CompositesMapUILocation from './Composites/CompositesMapUILocation';
import CompositesMapLayerFeatureNormal from './Composites/CompositesMapLayerFeatureNormal';
import CompositesMapUISketch from './Composites/CompositesMapUISketch';
import MapWrap from './Composites/MapWrap';

const useStyles = makeStyles(() => ({
  '@global': {
    '#COMPONENT_MAP .esri-icon-map-pin, #COMPONENT_MAP .esri-icon-polyline': {
      display: 'none'
    }
  }
}));

const mapSetting = {
  mapCssLoader: urls.module.current.css,
  loaderOptions: {
    url: urls.module.current.js
  },
  mapProperties: {},
  viewProperties: {
    center: [103.838665, 1.3],
    zoom: 10
  }
};

export default function MapSketch(props) {
  const { getMapInformation, channelData, channelSelected } = props;
  useStyles();

  return (
    <MapWrap>
      <Map {...mapSetting} loadElement={<Loading />}>
        <CompositesMapLayerFeatureNormal
          data={channelData}
          channelSelected={channelSelected || []}
        />
        <CompositesMapUICompass />
        <CompositesMapUILocation />
        <CompositesMapUISketch getMapInformation={getMapInformation} channelSelected={[]} />
      </Map>
    </MapWrap>
  );
}

MapSketch.defaultProps = {
  getMapInformation: () => {},
  channelData: [],
  extrallLayer: []
};

MapSketch.propTypes = {
  getMapInformation: PropTypes.func,
  channelData: PropTypes.array,
  extrallLayer: PropTypes.array
};
