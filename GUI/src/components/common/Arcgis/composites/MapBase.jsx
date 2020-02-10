/*
 * @Description: Map Base
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-06-03 12:01:47
 * @LastEditTime: 2019-09-25 15:47:00
 * @LastEditors: Kevin
 */

import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { loadModules, loadCss } from 'esri-loader';
import settings from 'commons/map/setting';
import PropTypes from 'prop-types';
import MapContainer from './MapContainer';

const useStyles = makeStyles(theme => ({
  backgroundStyle: props => ({
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: props.hasLoadElement ? theme.palette.common.white : '#fff'
  }),
  centerStyle: {
    left: '50%',
    marginRight: '-50%',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }
}));

export const baseProps = {
  id: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  mapCssLoader: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  mapProperties: PropTypes.object,
  viewProperties: PropTypes.object,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onDrag: PropTypes.func,
  onHold: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onLayerViewCreate: PropTypes.func,
  onLayerViewDestroy: PropTypes.func,
  onMouseWheel: PropTypes.func,
  onPointerDown: PropTypes.func,
  onPointerMove: PropTypes.func,
  onPointerUp: PropTypes.func,
  onResize: PropTypes.func,
  onLoad: PropTypes.func,
  onFail: PropTypes.func,
  loadElement: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  failElement: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  loaderOptions: PropTypes.object
};

export class MapBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mapContainerId: Math.random()
        .toString(36)
        .substring(0, 14),
      status: 'loading'
    };
  }

  render() {
    const { style, children, setRef } = this.props;
    const { status, className, mapContainerId, map, view } = this.state;

    const mapStyle = {
      height: '100%',
      position: 'relative',
      width: '100%',
      ...style
    };

    // loaded
    if (status === 'loaded') {
      const childrenWithProps = React.Children.map(children, child => {
        return React.cloneElement(child, {
          map,
          view
        });
      });

      return (
        <div ref={setRef} id="base-container" style={mapStyle} className={className}>
          <MapContainer id={mapContainerId} style={{ width: '100%', height: '100%' }} />
          {childrenWithProps}
        </div>
      );

      // loading
    } else if (status === 'loading') {
      return (
        <div ref={setRef} id="base-container" style={mapStyle} className={className}>
          <MapContainer id={mapContainerId} style={{ width: '100%', height: '100%' }} />
          <LoadElement {...this.props} status={status} />
        </div>
      );
    }

    // failed
    return (
      <div ref={setRef} id="base-container" style={mapStyle} className={className}>
        <MapContainer id={mapContainerId} style={{ width: '100%', height: '100%' }} />
        <LoadElement {...this.props} status={status} />
      </div>
    );
  }

  componentDidMount() {
    const { mapCssLoader, loaderOptions, scriptUri, onLoad, onFail, loadMap } = this.props;
    const { mapContainerId } = this.state;

    loadCss(mapCssLoader);
    loadModules(scriptUri, { url: settings.urls.module.current.js, ...loaderOptions })
      .then(modules => {
        return loadMap(modules, mapContainerId)
          .then(({ map, view }) => {
            if (onLoad) {
              onLoad(map, view);
            }

            this.setState({
              map,
              view,
              status: 'loaded'
            });
          })
          .catch(error => {
            throw error;
          });
      })
      .catch(e => {
        this.setState({ status: 'failed' });

        if (onFail) {
          onFail(e);
        }
      });
  }
}

MapBase.propTypes = {
  ...baseProps,
  loadMap: PropTypes.func.isRequired,
  scriptUri: PropTypes.arrayOf(PropTypes.string).isRequired,
  mapCssLoader: PropTypes.string.isRequired
};

// masking page
function LoadElement(props) {
  const { status, loadElement, failElement } = props;
  const stylesProps = {
    hasLoadElement: !!loadElement
  };
  const classes = useStyles(stylesProps);

  return (
    <div className={classes.backgroundStyle}>
      <div className={classes.centerStyle}>{status === 'loading' ? loadElement : failElement}</div>
    </div>
  );
}

LoadElement.defaultProps = {
  loadElement: <h3 id="react-arcgis-loading-text">Loading...</h3>,
  failElement: <h3 id="react-arcgis-fail-text">The ArcGIS API failed to load.</h3>
};

LoadElement.propTypes = {
  loadElement: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  failElement: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  status: PropTypes.string.isRequired
};
