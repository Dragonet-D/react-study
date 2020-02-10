import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { useDrop } from 'react-dnd';
import { Map } from 'components/common/Arcgis';
import { urls } from 'commons/map/setting';
import {
  MapWrap,
  FeatureLayerNormal,
  FeatureLayerAlarm,
  // MapImageLayerLabel,
  MapUISearch,
  MapUILocation,
  MapUIAlarmList,
  MapUIAlarmListExpand,
  MapUISwitchLayer,
  MapUISwitchLayerExpand,
  MapUIMeasureDistance,
  MapWindowChannelList,
  MapContextMenuNormalMulti,
  MapContextMenuNormalSingle,
  MapContextMenuAlarmTable,
  MapVideoLiveViewWindowSet,
  MapWindowRealtimeAlarm,
  MapLayerFOVTest,
  MapMainPageSketch,
  SaveNamePopUp,
  MapSaveNameExpand,
  DRAG_TYPE
} from 'components/Map';
import { Loading } from 'components/Loading';
import Authorized from 'utils/Authorized';
import materialKeys from 'utils/materialKeys';
import NoPermissionPage from '../Exception/ExceptionMap403';

const { checkSinglePermission } = Authorized;

const mapSetting = {
  mapCssLoader: urls.module.current.css,
  loaderOptions: {
    url: urls.module.current.js
  },
  mapProperties: {},
  viewProperties: {
    center: [103.838665, 1.3],
    zoom: 11
  }
};

const Container = props => {
  const { dispatch, data, userId } = props;
  const {
    channelData,
    alarmData,
    treeData,
    channelSelected,
    alarmRealtimeData,
    alarmEventType: { eventType }
  } = data;
  const [nodeDragged, setNodeDragged] = useState(null);
  const [popSaveName, setpopSaveName] = useState(false);
  const [oprationId, setoprationId] = useState(null);
  const [levelDataSource, setlevelDataSource] = useState(null);
  const [reqBody, setreqBody] = useState(null);
  const [mapInstance, setMapInstance] = useState({ map: null, view: null });
  useEffect(() => {
    dispatch({
      type: 'map/getTreeData',
      payload: {
        userId
      }
    });
    dispatch({
      type: 'map/getRealTimeAlarmData',
      payload: {
        userId,
        sort: 'desc'
      }
    });
    dispatch({
      type: 'map/getAlarmEventType'
    });
  }, [dispatch, userId]);

  function AOILIstOp(id, reqBody) {
    setreqBody(reqBody);
    setoprationId(id);
  }

  function saveName(name) {
    reqBody.zoomName = name;
    dispatch({
      type: 'map/createPolygon',
      payload: reqBody
    }).then(() => {
      dispatch({
        type: 'map/getAOIPolygon',
        payload: {
          createdId: userId
        }
      }).then(res => {
        if (res && res.data) {
          setData(res.data);
        } else {
          setData([]);
        }
      });
    });
  }
  function deleteAOI(id) {
    dispatch({
      type: 'map/deleteAOI',
      payload: {
        geometryId: id,
        userId
      }
    }).then(() => {
      dispatch({
        type: 'map/getAOIPolygon',
        payload: {
          createdId: userId
        }
      }).then(res => {
        if (res && res.data) {
          setData(res.data);
        } else {
          setData([]);
        }
      });
    });
  }

  function setData(data) {
    setlevelDataSource(data);
  }

  function searchName(name) {
    dispatch({
      type: 'map/getAOIPolygon',
      payload: {
        createdId: userId,
        zoomName: name
      }
    }).then(res => {
      if (res && res.data) {
        setData(res.data);
      } else {
        setData([]);
      }
    });
  }

  // react-dnd -> target
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: DRAG_TYPE,
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const pageOffset = {
        x: clientOffset.x - 63,
        y: clientOffset.y - 64
      };
      const term = { data: item.node, clientOffset: pageOffset };
      setNodeDragged(term);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });
  function setSNPop(bool) {
    setpopSaveName(bool);
  }

  const isDragging = canDrop && isOver;

  if (!checkSinglePermission(materialKeys['M1-2'])) {
    return <NoPermissionPage />;
  }

  return (
    <MapWrap>
      <Map setRef={drop} {...mapSetting} onLoad={handleMapLoad} loadElement={<Loading />}>
        {/* map layer */}
        <FeatureLayerAlarm data={alarmData} />
        <FeatureLayerNormal
          data={channelData}
          channelSelected={channelSelected}
          channelDragged={isDragging ? null : nodeDragged}
        />
        <MapLayerFOVTest normalData={channelData} />
        <MapMainPageSketch
          setpopSaveName={setSNPop}
          AOILIstOp={AOILIstOp}
          dispatch={dispatch}
          userId={userId}
          setData={setData}
        />
        {/* <MapImageLayerLabel normalData={channelData} alarmData={alarmData} /> */}

        {/* map UI */}
        <MapUISearch />
        <MapUILocation />
        <MapUIAlarmListExpand />
        <MapSaveNameExpand popSaveName={popSaveName} oprationId={oprationId} />
        <MapUISwitchLayerExpand />
      </Map>

      {/* expand area */}
      <Fragment>
        <MapUIAlarmList eventTypeList={eventType} {...mapInstance} />
        <SaveNamePopUp
          saveName={saveName}
          popSaveName={popSaveName}
          dataSource={levelDataSource}
          deleteAOI={deleteAOI}
          searchName={searchName}
          {...mapInstance}
        />
        <MapUISwitchLayer {...mapInstance} />
        <MapUIMeasureDistance {...mapInstance} />

        {/* context menu */}
        <MapContextMenuNormalSingle {...mapInstance} />
        <MapContextMenuNormalMulti {...mapInstance} />
        <MapContextMenuAlarmTable eventTypeList={eventType} />

        {/* window */}
        <MapWindowChannelList treeData={treeData} dispatch={dispatch} />
        <MapWindowRealtimeAlarm alarmRealtimeData={alarmRealtimeData} {...props} />
        <MapVideoLiveViewWindowSet />
      </Fragment>
    </MapWrap>
  );

  function handleMapLoad(map, view) {
    setMapInstance({ map, view });
  }
};

const mapStateToProps = ({ map, global, loading }) => {
  return {
    data: map,
    userId: global.userId,
    loading
  };
};

export default connect(mapStateToProps)(Container);
