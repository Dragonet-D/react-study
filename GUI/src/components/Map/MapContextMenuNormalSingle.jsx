/*
 * @Description: Context Menu of Map Feature(Icon)
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @LastEditors: Kevin
 * @Date: 2019-03-05 11:31:20
 * @LastEditTime: 2019-08-29 00:49:21
 */

import React, { useContext } from 'react';
import Context from 'utils/createContext';
import classNames from 'classnames';
import { I18n } from 'react-i18nify';
import { List, ListItem, ListItemText, Paper, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  menu: {
    width: 160,
    padding: 3
  },
  contextMenuArea: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  hideContextMenu: {
    display: 'none'
  }
}));

export default function ContextMenu({ view }) {
  const classes = useStyles();
  const {
    contextMenu: { normalSingle }
  } = useContext(Context);
  const {
    hideContextMenuNormalSingle,
    setHideContextMenuNormalSingle,
    menuSingleParameter,
    handleShowLiveViewClickEvent,
    handleShowThumbnailsClickEvent
  } = normalSingle;
  const { mapEvent: contextMenuEvent, attributes: cameraInfos } = menuSingleParameter;

  return (
    <Paper
      id="contextMenuArea"
      className={classNames(classes.menu, classes.contextMenuArea, {
        [classes.hideContextMenu]: hideContextMenuNormalSingle
      })}
    >
      <List>
        <ListItem
          disableRipple
          key="Open Live View"
          role={undefined}
          dense
          button
          onClick={() => {
            handleShowLiveViewClickEvent(cameraInfos);
            setHideContextMenuNormalSingle(true);
          }}
        >
          <ListItemText primary={I18n.t('map.contextMenuNormalSingle.liveView')} />
        </ListItem>
        <ListItem
          disableRipple
          key="Thumbnails"
          role={undefined}
          dense
          button
          onClick={() => {
            handleShowThumbnailsClickEvent({
              view,
              channel: cameraInfos,
              mapEvent: contextMenuEvent
            });
            setHideContextMenuNormalSingle(true);
          }}
        >
          <ListItemText primary={I18n.t('map.contextMenuNormalSingle.thumbnail')} />
        </ListItem>
      </List>
    </Paper>
  );
}
