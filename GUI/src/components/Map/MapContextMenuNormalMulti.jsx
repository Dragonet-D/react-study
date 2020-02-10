/*
 * @Description: sensor List Of Same Coordinate
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @LastEditors: Kevin
 * @Date: 2019-04-09 03:08:54
 * @LastEditTime: 2019-08-29 00:47:52
 */

import React, { Component, useContext, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Context from 'utils/createContext';
import { I18n } from 'react-i18nify';
import {
  withStyles,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@material-ui/core';
import { Videocam, CameraAlt } from '@material-ui/icons';

const styles1 = () => ({
  menu: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 160,
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
});

const SensorListOfSameCoordinate = ({ classes, ...props }) => {
  const {
    contextMenu: { normalMulti }
  } = useContext(Context);
  const {
    hideContextMenuNormalMulti,
    setHideContextMenuNormalMulti,
    menuMultiParameter,
    handleShowLiveViewClickEvent,
    handleShowThumbnailsClickEvent
  } = normalMulti;
  const { data, mapEvent, attributes } = menuMultiParameter;
  return (
    <Paper
      id="sensorListDataOfSameCoordinate"
      className={classNames(classes.menu, classes.contextMenuArea, {
        [classes.hideContextMenu]: hideContextMenuNormalMulti
      })}
    >
      <SensorListOfSameCoordinateTree
        sensorList={data}
        featureAttr={attributes}
        contextMenuEvent={mapEvent}
        setHideContextMenuNormalMulti={setHideContextMenuNormalMulti}
        handleShowLiveViewClickEvent={handleShowLiveViewClickEvent}
        handleShowThumbnailsClickEvent={handleShowThumbnailsClickEvent}
        {...props}
      />
    </Paper>
  );
};

SensorListOfSameCoordinate.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles1)(SensorListOfSameCoordinate);

const styles = () => ({
  root: {},
  svgIcon: {
    fontSize: 16
  },
  itemText: {
    padding: 0
  },
  itemIcon: {
    padding: 0,
    marginRight: 5
  },
  listItem: {
    paddingRight: 0,
    paddingLeft: 10
  },
  listItemDesen: {
    height: 26,
    paddingTop: 2,
    paddingBottom: 2
  },
  searchArea: {
    marginBottom: 5
  },
  actionIcon: {
    '&:hover': {
      cursor: 'pointer'
    }
  },
  textItemOverflow: {
    maxWidth: 80,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  hideTextAction: {
    display: 'none'
  }
});

class ListTree extends Component {
  render() {
    const { sensorList, ...reset } = this.props;
    const data = sensorList;
    return (
      <div>
        <List disablePadding dense>
          {data.map(temp => (
            <ListItemsUI key={temp.channelId || temp.groupId} item={temp} {...reset} />
          ))}
        </List>
      </div>
    );
  }
}

ListTree.propTypes = {
  classes: PropTypes.object.isRequired
};

const SensorListOfSameCoordinateTree = withStyles(styles)(ListTree);

class ListItemsUI extends Component {
  render() {
    const {
      view,
      classes,
      item,
      contextMenuEvent,
      setHideContextMenuNormalMulti,
      handleShowLiveViewClickEvent,
      handleShowThumbnailsClickEvent,
      featureAttr
    } = this.props;

    return (
      <Fragment>
        <ListItem
          key={item.channelId || item.groupId}
          className={classes.listItem}
          classes={{ dense: classes.listItemDesen }}
          button
          disableRipple
        >
          <ListItemText
            title={item.channelName || ''}
            classes={{
              root: classNames(classes.itemText, {
                [classes.textItemOverflow]: true
              })
            }}
            inset
            primary={item.channelName || item.groupName}
          />

          <ListItemSecondaryAction className={classNames({ [classes.hideTextAction]: false })}>
            <Videocam
              title={I18n.t('map.contextMenuNormalMulti.liveView')}
              className={classes.actionIcon}
              classes={{ root: classes.svgIcon }}
              onClick={() => {
                handleShowLiveViewClickEvent(item);
                setHideContextMenuNormalMulti(true);
              }}
            />
            <CameraAlt
              title={I18n.t('map.contextMenuNormalMulti.thumbnail')}
              className={classes.actionIcon}
              classes={{ root: classes.svgIcon }}
              onClick={() => {
                handleShowThumbnailsClickEvent({
                  view,
                  objectID: featureAttr.OBJECTID,
                  channel: item,
                  mapEvent: contextMenuEvent
                });
                setHideContextMenuNormalMulti(true);
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </Fragment>
    );
  }
}
