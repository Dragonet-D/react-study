/*
 * @Description: Measure Distance Widget
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-07-10 16:31:02
 * @LastEditTime: 2019-09-24 17:10:10
 * @LastEditors: Kevin
 */

import React, { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { I18n } from 'react-i18nify';
import { urls } from 'commons/map/setting';

const useStyles = makeStyles(() => ({
  measureButton: {
    background: '#0079c1',
    color: '#e4e4e4'
  }
}));

const MapUIMeasureDistanceExpand = props => {
  const { map, view } = props;
  const classes = useStyles();
  const [isMeasureDistance, setIsMeasureDistance] = useState(false);
  const [mapClass, setMapClass] = useState(null);
  const [activeMeasureDistance, setActiveMeasureDistance] = useState(null);

  useEffect(() => {
    loadModules(['esri/widgets/DistanceMeasurement2D'], {
      url: urls.module.current.js
    })
      .then(([DistanceMeasurement2D]) => {
        setMapClass({ DistanceMeasurement2D });
        if (view) {
          view.ui.add('measureDistance', {
            position: 'top-right',
            index: 2
          });
        }
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Measure Distance Expand:', error.message, 'error:', error);
      });
  }, [props]);

  return (
    <div id="measureDistance">
      <button
        className={classNames('action-button', 'esri-icon-minus', 'esri-widget--button', {
          [classes.measureButton]: isMeasureDistance
        })}
        disabled={!map && !view}
        id="distanceButton"
        type="button"
        title={
          map && view
            ? I18n.t('map.measureDistance.content')
            : I18n.t('map.measureDistance.loading')
        }
        onClick={handleMeasureDistanceClickEvent}
      />
    </div>
  );

  // function area
  function handleMeasureDistanceClickEvent() {
    destroyMeasureInstance();
    if (!isMeasureDistance && view) {
      const distanceMeasurement2D = new mapClass.DistanceMeasurement2D({ view });
      distanceMeasurement2D.viewModel.newMeasurement();
      view.ui.add(distanceMeasurement2D, 'top-right');
      setActiveMeasureDistance(distanceMeasurement2D);
    }

    setIsMeasureDistance(state => {
      return !state;
    });
  }

  function destroyMeasureInstance() {
    if (!!activeMeasureDistance && view) {
      view.ui.remove(activeMeasureDistance);
      activeMeasureDistance.destroy();
      setActiveMeasureDistance(null);
    }
  }
};

export default MapUIMeasureDistanceExpand;
