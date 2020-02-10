/*
 * @Description: map ui search widget
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-07-15 10:08:17
 * @LastEditTime: 2019-09-24 18:10:25
 * @LastEditors: Kevin
 */

import { useState, useEffect, useContext } from 'react';
import { loadModules } from 'esri-loader';
import Context from 'utils/createContext';
import { I18n } from 'react-i18nify';
import { getChannelSnapshotAPI } from 'api/map';
import { urls, layerId, layerSearchSourceOptions, ivhPopupTemplate } from 'commons/map/setting';
import tools, { getSearchFeatureResult, getFeatureSelectedAfterSearching } from 'commons/map/utils';
import _ from 'lodash';
import cameraImg from './images/camera.PNG';

const modulesUri = [
  'esri/widgets/Search',
  'esri/widgets/Search/LayerSearchSource',
  'esri/widgets/Search/LocatorSearchSource',
  'esri/tasks/Locator',
  'esri/tasks/support/Query',
  'esri/PopupTemplate'
];

export default function MapUISearch(props) {
  const { map, view } = props;
  const { highlight } = useContext(Context);
  const [searchWidget, setSearchWidget] = useState(null);

  useEffect(() => {
    loadMapModules();
    return function cleanup() {
      props.view.ui.remove(searchWidget);
    };
  }, []);

  return null;

  async function loadMapModules() {
    try {
      const modules = await loadModules([...modulesUri], { url: urls.module.current.js });
      const [
        Search,
        LayerSearchSource,
        LocatorSearchSource,
        Locator,
        Query,
        PopupTemplate
      ] = modules;
      const normalFeature = map.findLayerById(layerId.normal);
      const locator = new Locator({
        url: urls.tool.geoAddressServer
      });
      // get search source config
      const optionsNormalFeature = getFeatureOptions(
        normalFeature,
        _.curry(getNormalSearchSuggestion)({ Query }, 'normal'),
        _.curry(getNormalSearchResult)({ Query }, 'normal')
      );
      const optionsLocator = getLocatorOptions(locator);
      // create search sources
      const normalFeatureSource = new LayerSearchSource({ ...optionsNormalFeature });
      const locatorSource = new LocatorSearchSource({ ...optionsLocator });
      // create search widget
      const search = new Search({
        view,
        sources: [locatorSource, normalFeatureSource],
        includeDefaultSources: false
      });
      // set search widget event
      setSearchEvent(search, { Query, PopupTemplate });

      props.view.ui.add(search, {
        position: 'top-left',
        index: 0
      });
      setSearchWidget(search);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Search Widget:', error.message, 'error:', error);
    }
  }

  function getNormalSearchSuggestion(mapClass, type, suggestions) {
    const { suggestTerm: text, sourceIndex } = suggestions;
    return getSearchFeatureResult(mapClass, map, text, type).then(features => {
      return features.map(item => {
        return {
          key: item.attributes.OBJECTID,
          text: item.attributes.channelName,
          sourceIndex,
          feature: item
        };
      });
    });
  }

  function getNormalSearchResult(mapClass, type, results) {
    const { feature, text } = results.suggestResult;
    if (!feature) {
      return getSearchFeatureResult(mapClass, map, text, type).then(features => {
        if (features.length > 0) {
          const item = features[0];
          return [
            {
              extent: null,
              feature: item,
              name: text
            }
          ];
        }
      });
    } else {
      return Promise.resolve([
        {
          extent: null,
          feature,
          name: text
        }
      ]);
    }
  }

  function setSearchEvent(searchWidget, mapClass) {
    searchWidget.on('select-result', async result => {
      try {
        const { OBJECTID } = result.result.feature.attributes;
        const features = await getFeatureSelectedAfterSearching(mapClass, map, OBJECTID, 'normal');
        const feature = features[0];
        const layerView = await view.whenLayerView(feature.layer);
        highlight.set(layerView.highlight(feature));
        view.goTo(
          {
            target: feature,
            zoom: 20
          },
          {
            duration: 2000,
            easing: 'in-expo'
          }
        );

        const snapshotResult = await getChannelSnapshotAPI({
          streamId: 0,
          time: '',
          deviceId: feature.attributes.deviceId,
          channelId: feature.attributes.channelId
        });
        if (snapshotResult) {
          const featureModified = tools.mapTools.addTemplateIntoFeatureToShowSnapshot(
            mapClass,
            snapshotResult,
            ivhPopupTemplate,
            feature
          );
          view.popup.open({
            highlightEnabled: false,
            location: featureModified.geometry,
            features: [featureModified]
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Search Widget -> Selecting Result:', error.message, 'error:', error);
      }
    });
  }
}

// Get Feature Search Source Options
const getFeatureOptions = (layer, suggestions, results) => {
  return {
    ...layerSearchSourceOptions.baseFeatureOptions,
    layer,
    searchFields: ['channelName', 'channelDescription', 'channelAddress'],
    displayField: 'channelName',
    resultSymbol: {
      type: 'picture-marker',
      url: cameraImg,
      width: 0,
      height: 0
    },
    name: 'Camera Information',
    placeholder: I18n.t('map.search.placeholder'), // remember to modified sql sentence of callback
    getSuggestions: suggestions, // callback
    getResults: results // callback
  };
};

// Get Locator Search Source Options
const getLocatorOptions = layer => {
  return {
    ...layerSearchSourceOptions.baseLocatorOptions,
    locator: layer
  };
};
