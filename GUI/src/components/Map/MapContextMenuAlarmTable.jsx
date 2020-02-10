/*
 * @Description: alarm table menu
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @LastEditors: Kevin
 * @Date: 2019-04-10 23:56:12
 * @LastEditTime: 2019-08-29 00:42:41
 */

import React, { Fragment, useContext } from 'react';
import classNames from 'classnames';
import Context from 'utils/createContext';
import moment from 'moment';
import { I18n } from 'react-i18nify';
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  makeStyles
} from '@material-ui/core';
import { Th, CellWithTooltip as TableCell } from 'components/common/material-ui/CellWithTooltip';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: 350,
    height: 300,
    padding: 10,
    overflowY: 'auto'
  },
  iconSize: {
    fontSize: 18
  },
  cellCenter: {
    textAlign: 'center'
  },
  tableScroll: {
    width: '100%',
    height: '100%',
    minWidth: 300,
    paddingBottom: 32,
    overflowX: 'auto'
  },
  ellipsis: {
    fontSize: '14px',
    textAlign: 'center',
    verticalAlign: 'middle',
    maxWidth: 50,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  ellipsisTitle: {
    fontSize: '14px',
    textAlign: 'center',
    verticalAlign: 'middle',
    maxWidth: 300,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    paddingBottom: theme.spacing(3)
  },
  contextMenuArea: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  hideContextMenu: {
    display: 'none'
  },
  thPadding: {
    paddingBottom: `${theme.spacing(1.25)}px !important`
  }
}));

export default function AlarmTableMenu(props) {
  const { eventTypeList } = props;
  const classes = useStyles();
  const {
    contextMenu: { alarmTable }
  } = useContext(Context);

  const { hideContextMenuAlarmTable, menuAlarmTableData } = alarmTable;
  return (
    <Paper
      id="alarmTableMenuArea"
      className={classNames(classes.root, classes.contextMenuArea, {
        [classes.hideContextMenu]: hideContextMenuAlarmTable
      })}
    >
      {menuAlarmTableData.map(item => {
        const name = item.$sourceId.sourceName || '';
        return (
          <TableUnit
            key={item.time}
            name={name}
            data={item.nodes}
            eventTypeList={eventTypeList}
            classes={classes}
          />
        );
      })}
    </Paper>
  );
}

const TableUnit = ({ name, data, eventTypeList, classes }) => {
  const eventTypeObj = {};
  eventTypeList.forEach(item => {
    if (!!item[0] && !!item[1]) {
      const [key, value] = item;
      eventTypeObj[key] = value;
    }
  });

  return (
    <Fragment>
      <br />
      <Typography gutterBottom variant="body1" title={name} className={classes.ellipsisTitle}>
        {`${I18n.t('map.contextMenuAlarmTable.title')}: ${name}`}
      </Typography>
      <Table padding="none">
        <TableHead>
          <TableRow>
            <Th className={classes.thPadding}>
              {I18n.t('map.contextMenuAlarmTable.tableHeaderOne')}
            </Th>
            <Th className={classes.thPadding}>
              {I18n.t('map.contextMenuAlarmTable.tableHeaderTwo')}
            </Th>
            <Th className={classes.thPadding}>
              {I18n.t('map.contextMenuAlarmTable.tableHeaderThree')}
            </Th>
          </TableRow>
        </TableHead>

        <TableBody>
          {data ? (
            data.map(item => {
              const time = moment(item.time).format('DD/MM/YYYY HH:mm:ss');
              const alarmType = eventTypeObj[item.alarmType];
              const name = item.$sourceId.sourceName || '';
              return (
                <TableRow key={item.time}>
                  <TableCell className={classes.ellipsis}>{time}</TableCell>
                  <TableCell className={classes.ellipsis}>{alarmType}</TableCell>
                  <TableCell className={classes.ellipsis}>{name}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={3}>{I18n.t('map.contextMenuAlarmTable.noData')}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Fragment>
  );
};
