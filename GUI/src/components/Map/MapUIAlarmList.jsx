/* eslint-disable prettier/prettier */
/*
 * @Description: Map UI Alarm List
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-07-10 22:11:58
 * @LastEditTime: 2019-08-29 00:55:37
 * @LastEditors: Kevin
 */

import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Moment from 'moment';
import { I18n } from 'react-i18nify';
import { Context } from 'utils/createContext';
import { DATA_INFO_NAME_STRING as dataMapping } from 'commons/constants/const';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from '@material-ui/core';
import { Warning } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.spacing(48),
    maxHeight: theme.spacing(50),
    overflowY: 'auto'
  },
  subHeader: {
    display: 'flex',
    alignItems: 'center'
  },
  warn: {
    color: theme.palette.messageCenter.warning
  },
  listTitle: {
    width: theme.spacing(11),
    justifyContent: 'flex-end',
    fontWeight: 'bold',
    paddingRight: 5
  },
  listTextEllipsis: {
    display: 'inline-block',
    maxWidth: theme.spacing(25),
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}));

const AlarmTable = props => {
  const classes = useStyles();
  const { eventTypeList } = props;
  const {
    contextMenu: { alarmListUI }
  } = useContext(Context);
  const { realtimeAlarmSelected: alarmSensorSelected } = alarmListUI;
  const data = !!alarmSensorSelected && !!alarmSensorSelected.time ? [alarmSensorSelected] : [];

  const eventTypeObj = {};
  eventTypeList.forEach(item => {
    if (!!item[0] && !!item[1]) {
      const [key, value] = item;
      eventTypeObj[key] = value;
    }
  });

  return (
    <Paper id="alarmListArea" className={classes.root}>
      <List
        subheader={
          <ListSubheader className={classNames(classes.subHeader, classes.warn)}>
            <ListItemIcon>
              <Warning className={classes.warn} />
            </ListItemIcon>
            <span>Alarm List</span>
          </ListSubheader>
        }
      >
        {data.length > 0 ? (
          data.map(temp => {
            const sourceId = JSON.parse(temp.sourceId || false);
            let dataInfo = '';
            dataMapping.forEach(key => {
              if (JSON.parse(temp.data)[key]) dataInfo = JSON.parse(temp.data)[key];
            });

            return (
              <Fragment key={temp.time}>
                <GetListItem
                  classes={classes}
                  title={I18n.t('map.alarmList.sentTime')}
                  data={!!temp.time && Moment(temp.time).format('DD/MM/YYYY HH:mm:ss')}
                />
                <GetListItem
                  classes={classes}
                  title={I18n.t('map.alarmList.eventType')}
                  data={!!temp.alarmType && eventTypeObj[temp.alarmType]}
                />
                <GetListItem
                  classes={classes}
                  title={I18n.t('map.alarmList.source')}
                  data={(!!sourceId && sourceId.sourceName) || ''}
                />
                <GetListItem classes={classes} title={I18n.t('map.alarmList.data')} data={dataInfo || ''} />
                <GetListItem classes={classes} title={I18n.t('map.alarmList.owner')} data={temp.ownedBy} />
                <GetListItem classes={classes} title={I18n.t('map.alarmList.state')} data={temp.status} />

                {/* <ListItem disableRipple dense button onClick={handlePlayBackClickEvent.bind(null, temp)}>
                    <ListItemIcon className={classes.listTitle}>
                      {'Playback'}
                    </ListItemIcon>
                    <ListItemText primary={<Videocam/>} style={{ textAlign: 'center' }}/>
                  </ListItem> */}
                <ListItem>
                  {/* <Button
                    onClick={handlePlayBackClickEvent.bind(null, temp)}
                    color="primary"
                    variant="contained"
                    size="medium"
                    style={{ width: '100%' }}
                  >
                    <Videocam />
                    Playback
                  </Button> */}
                </ListItem>
              </Fragment>
            );
          })
        ) : (
          <ListItem disableRipple key={121212} role={undefined} dense button>
            <ListItemText primary="No Alarm Selected" />
          </ListItem>
        )}
      </List>
    </Paper>
  );
};

// const mapStateToProps = state => {
//   return {
//     eventTypeList:
//       state.alarmConfig &&
//       state.alarmConfig.createAlarmData &&
//       state.alarmConfig.createAlarmData.eventType
//   };
// };

AlarmTable.defaultProps = {
  eventTypeList: []
};

AlarmTable.propTypes = {
  eventTypeList: PropTypes.array
};

export default AlarmTable;

// GetListItem
function GetListItem({ title, data }) {
  const classes = useStyles();
  let $data = data;
  if (title === 'Data') {
    $data = JSON.stringify(data || false);
  }
  return (
    <ListItem disableRipple dense button>
      <ListItemIcon className={classes.listTitle}>
        <span>{`${title} :`}</span>
      </ListItemIcon>

      <ListItemText
        primary={
          <span title={$data} className={classes.listTextEllipsis}>
            {$data}
          </span>
        }
      />
    </ListItem>
  );
}
GetListItem.defaultProps = {
  title: '',
  data: {}
};

GetListItem.propTypes = {
  title: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object, PropTypes.array])
};
