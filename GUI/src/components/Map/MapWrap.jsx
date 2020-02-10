import React, { useState } from 'react';
import { loadModules } from 'esri-loader';
import { makeStyles } from '@material-ui/core/styles';
import { Provider } from 'utils/createContext';
import { showSnapshot } from 'commons/map/utils';
import { urls } from 'commons/map/setting';
import msgCenter from 'utils/messageCenter';
import LiveView from './MapVideoLiveView';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.common.white,
    overflow: 'hidden'
  },
  '@global': {
    '#home-map .esri-icon-map-pin, #home-map .esri-icon-polyline': {
      display: 'none'
    },
    '.cluster-group.activated': {
      transformOrigin: 'center',
      transform: 'scale(1.2)',
      transition: 'transform linear 0.4s'
    },
    '.cluster-group.activated .cluster': {
      stroke: 'rgba(255,255,255,1)',
      strokeWidth: 2,
      transition: 'all ease 1s'
    },
    '.cluster-group.activated .cluster-text': {
      fill: '#000',
      fontWeight: 'bold',
      transition: 'all ease 1s'
    },
    '.flare-group': {
      opacity: 0
    },
    '.flare-group.activated': {
      opacity: 1,
      transition: 'opacity linear 0.06s'
    },
    '.flare-group.activated:nth-of-type(1)': {
      transitionDelay: '0.06s'
    },
    '.flare-group.activated:nth-of-type(2)': {
      transitionDelay: '0.12s'
    },
    '.flare-group.activated:nth-of-type(3)': {
      transitionDelay: '0.18s'
    },
    '.flare-group.activated:nth-of-type(4)': {
      transitionDelay: '0.24s'
    },
    '.flare-group.activated:nth-of-type(5)': {
      transitionDelay: '0.30s'
    },
    '.flare-group.activated:nth-of-type(6)': {
      transitionDelay: '0.36s'
    },
    '.cluster-group .flare-group.activated:nth-of-type(7)': {
      transitionDelay: '0.42s'
    },
    '.flare-group.activated:nth-of-type(8)': {
      transitionDelay: '0.48s'
    }
  }
}));

const modulesUri = ['esri/PopupTemplate'];

const highlight = {
  store: [],
  set(item) {
    if (!item) return;
    this.store.push(item);
  },
  clear() {
    const op = this.store;
    if (op.length > 0) {
      for (let i = 0, len = op.length; i < len; i++) {
        const item = op.shift();
        item.remove();
      }
    }
  }
};

export default function MapWrap(props) {
  const { children } = props;
  const classes = useStyles();
  const [hideContextMenuNormalSingle, setHideContextMenuNormalSingle] = useState(true);
  const [hideContextMenuNormalMulti, setHideContextMenuNormalMulti] = useState(true);
  const [AOIExpandInstance, setAOIExpandInstance] = useState(null);
  const [AOISketchInstance, setAOISketchInstance] = useState(null);
  const [hideContextMenuAlarmTable, setHideContextMenuAlarmTable] = useState(true);
  const [menuAlarmTableData, setMenuAlarmTableData] = useState([]);
  const [menuSingleParameter, setMenuSingleParameter] = useState({
    mapEvent: {},
    attributes: {}
  });
  const [menuMultiParameter, setMenuMultiParameter] = useState({
    data: [],
    mapEvent: {},
    attributes: {}
  });
  const [liveViewWindows, setLiveViewWindows] = useState([]);
  const [realtimeAlarmSelected, setRealtimeAlarmSelected] = useState({});
  const context = {
    highlight,
    contextMenu: {
      liveViewWindowSet: {
        liveViewWindows
      },
      alarmListUI: {
        realtimeAlarmSelected,
        setRealtimeAlarmSelected
      },
      normalSingle: {
        hideContextMenuNormalSingle,
        setHideContextMenuNormalSingle,
        menuSingleParameter,
        setMenuSingleParameter,
        handleShowLiveViewClickEvent,
        handleShowThumbnailsClickEvent
      },
      normalMulti: {
        hideContextMenuNormalMulti,
        setHideContextMenuNormalMulti,
        menuMultiParameter,
        setMenuMultiParameter,
        handleShowLiveViewClickEvent,
        handleShowThumbnailsClickEvent
      },
      alarmTable: {
        hideContextMenuAlarmTable,
        setHideContextMenuAlarmTable,
        menuAlarmTableData,
        setMenuAlarmTableData
      },
      aoi: {
        setAOIExpandInstance,
        AOIExpandInstance,
        setAOISketchInstance,
        AOISketchInstance
      }
    }
  };
  return (
    <Provider value={context}>
      <div id="home-map" className={classes.root}>
        {children}
      </div>
    </Provider>
  );

  // live view window set
  function handleShowLiveViewClickEvent(cameraInfos) {
    if (liveViewWindows.length >= 3) {
      msgCenter.warn('You can only open 3 live view windows');
      return;
    }
    const cameraLiveView = (
      <LiveView
        channel={cameraInfos}
        key={cameraInfos.channelId}
        handleCloseWindowClickEvent={id => handleCloseLiveViewWindowClickEvent(id)}
      />
    );
    setLiveViewWindows(prevState => [
      ...prevState,
      { id: cameraInfos.channelId, value: cameraLiveView }
    ]);
  }

  // close camera live window
  function handleCloseLiveViewWindowClickEvent(id) {
    setLiveViewWindows(prevState => {
      return [...prevState].filter(item => item.id !== id);
    });
  }

  // snapshot
  function handleShowThumbnailsClickEvent({ view, objectID, channel, mapEvent }) {
    if (view) {
      loadModules([...modulesUri], { url: urls.module.current.js }).then(([PopupTemplate]) => {
        const mapClass = { PopupTemplate };
        showSnapshot({ mapClass, view, objectID, channel, mapEvent });
      });
    }
  }
}
