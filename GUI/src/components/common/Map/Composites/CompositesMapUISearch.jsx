/*
 * @Description: map ui search widget
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-08-26 00:29:02
 * @LastEditTime: 2019-09-25 20:47:24
 * @LastEditors: Kevin
 */

import { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';
// import Context from 'utils/createContext';
import { urls, layerSearchSourceOptions } from 'commons/map/setting';
import posImg from '../Images/pic.PNG';

const modulesUri = [
  'esri/widgets/Search',
  'esri/widgets/Search/LocatorSearchSource',
  'esri/tasks/Locator',
  'esri/Graphic',
  'esri/layers/GraphicsLayer'
];

export default function MapUISearch(props) {
  const { map, view, getMapInformation } = props;
  // const { highlight } = useContext(Context);
  const [searchWidget, setSearchWidget] = useState(null);

  useEffect(() => {
    loadMapModules();
    return function cleanup() {
      const graphicsLayer = map.findLayerById('searchGraphicsLayer');
      map.remove(graphicsLayer);
      view.ui.remove(searchWidget);
    };
  }, []);

  return null;

  async function loadMapModules() {
    try {
      const modules = await loadModules([...modulesUri], { url: urls.module.current.js });
      const [Search, LocatorSearchSource, Locator, Graphic, GraphicsLayer] = modules;
      const locator = new Locator({
        url: urls.tool.geoAddressServer
      });
      const optionsLocator = getLocatorOptions(locator);
      const locatorSource = new LocatorSearchSource({ ...optionsLocator });
      // create search widget
      const search = new Search({
        view,
        sources: [locatorSource],
        includeDefaultSources: false
      });
      // set search widget event
      setSearchEvent(search);

      view.ui.add(search, {
        position: 'top-right',
        index: 0
      });
      setSearchWidget(search);
      setViewClickEvent({ Graphic }, locator);

      // go to map
      const graphicsLayer = new GraphicsLayer({
        id: 'searchGraphicsLayer'
      });
      map.add(graphicsLayer);
      graphicsLayer.when(() => {
        view.goTo(
          {
            center: [103.811346, 1.336091]
          },
          {
            duration: 2000,
            easing: 'in-expo'
          }
        );
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Search Widget:', error.message, 'error:', error);
    }
  }

  function setSearchEvent(searchWidget) {
    searchWidget.on('search-complete', () => {
      view.graphics.removeAll();
    });
    searchWidget.on('select-result', res => {
      const { geometry, attributes } = res.result.feature;
      const { latitude, longitude, x, y, z } = geometry;
      // const address = attributes.LongLabel;
      const address = attributes.Match_addr;
      const ps = { address, latitude, longitude, x, y, z };
      if (getMapInformation) {
        getMapInformation(ps);
      }
      // console.log(ps);
    });
  }

  function setViewClickEvent(mapClass, locatorTask) {
    const { Graphic } = mapClass;
    view.on('click', e => {
      view.graphics.removeAll();
      const point = e.mapPoint;
      const mapInfo = {
        latitude: point.latitude,
        longitude: point.longitude,
        x: point.x,
        y: point.y,
        z: point.z || null,
        address: ''
      };

      const markerSymbol = {
        type: 'picture-marker',
        url: posImg,
        width: '15px',
        height: '22px'
      };
      const pointGraphics = new Graphic({
        geometry: point,
        symbol: markerSymbol
      });

      view.graphics.add(pointGraphics);

      view.goTo(point);

      locatorTask
        .locationToAddress(point)
        .then(re => {
          mapInfo.address = re.address;
          if (getMapInformation) {
            getMapInformation(mapInfo);
          }
          // console.log("map infos:", mapInfo);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
          mapInfo.address = 'No address was found for this location!';
          if (getMapInformation) {
            getMapInformation(mapInfo);
          }
          // console.log("map infos:", mapInfo);
        });
    });
  }
}

// Get Locator Search Source Options
const getLocatorOptions = layer => {
  return {
    ...layerSearchSourceOptions.baseLocatorOptions,
    locator: layer,
    popupEnabled: false,
    resultSymbol: {
      type: 'picture-marker',
      url: posImg,
      width: '15px',
      height: '22px'
    }
  };
};
