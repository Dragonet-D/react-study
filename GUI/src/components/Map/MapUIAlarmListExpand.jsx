import { useState, useEffect, useContext } from 'react';
import { loadModules } from 'esri-loader';
import { Context } from 'utils/createContext';
import { urls, layerId } from 'commons/map/setting';
import tools from 'commons/map/utils';

const MapUIAlarmListExpand = props => {
  const { view, map } = props;
  const {
    highlight,
    contextMenu: { alarmListUI }
  } = useContext(Context);
  const { realtimeAlarmSelected: alarmSensorSelected } = alarmListUI;
  const [alarmListExpand, setAlarmListExpand] = useState(null);
  const [mapConstructor, setMapConstructor] = useState({});

  useEffect(() => {
    loadModules(['esri/widgets/Expand', 'esri/tasks/support/Query'], {
      url: urls.module.current.js
    })
      .then(([Expand, Query]) => {
        const expand = new Expand({
          view,
          expandIconClass: 'esri-icon-error2',
          expandTooltip: 'Expand Alarm Table',
          expanded: false,
          content: document.getElementById('alarmListArea')
        });

        view.ui.add(expand, { position: 'top-right', index: 1 });
        setAlarmListExpand(expand);
        setMapConstructor({ Query });
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Alarm List Expand:', error.message, 'error:', error);
      });

    return function cleaup() {
      view.ui.remove(alarmListExpand);
    };
  }, []);

  useEffect(() => {
    if (alarmListExpand && !alarmListExpand.expanded && alarmSensorSelected) {
      alarmListExpand.expanded = true;

      const sourceId = JSON.parse(alarmSensorSelected.sourceId || false);
      const id = sourceId && sourceId.channelId;
      const channels = [{ channelId: id || '0-0-0-0-0-0-0-0-0' }];

      const alarmLayer = map.findLayerById(layerId.alarm);

      tools.mapTools.highlightChannelsSelected(
        mapConstructor,
        view,
        alarmLayer,
        channels,
        highlight
      );
    }
  }, [alarmSensorSelected]);
  return null;
};

export default MapUIAlarmListExpand;
