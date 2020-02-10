/*
 * @Description: Map UI Switch Layer
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-07-15 10:08:17
 * @LastEditTime: 2019-09-23 03:53:02
 * @LastEditors: Kevin
 */

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { I18n } from 'react-i18nify';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import ListSubheader from '@material-ui/core/ListSubheader';
import { layerId } from 'commons/map/setting';

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.spacing(28),
    maxWidth: theme.spacing(45),
    backgroundColor: theme.palette.background.paper
  },
  layerToggle: {
    width: theme.spacing(30)
  },
  listText: {
    color: theme.palette.text.primary
  },
  listPadding: {
    paddingTop: 20
  }
}));

const layerList = [
  {
    title: I18n.t('map.switchLayer.normal'),
    alias: 'clusterNormal'
  },
  {
    title: I18n.t('map.switchLayer.alarm'),
    alias: 'clusterAlarm'
  }
];

export default function LayerToggle(props) {
  const { map, view } = props;
  const isReady = map && view;
  const classes = useStyles();
  const [layersChecked, setLayersChecked] = useState(() => layerList.map(item => item.alias));
  return (
    <List
      id="layerToggle"
      subheader={
        <ListSubheader className={classes.listPadding}>
          <Typography color="textSecondary" variant="subtitle1">
            Map Layer
          </Typography>
        </ListSubheader>
      }
      className={classes.root}
    >
      {getLayerList(layerList)}
    </List>
  );

  function getLayerList(data) {
    return data.map(item => {
      return (
        <ListItem
          disableRipple
          key={item.alias}
          dense
          button
          disabled={!isReady}
          onClick={handleToggleLayerClickEvent.bind(null, item.alias)}
        >
          <Checkbox
            checked={layersChecked.includes(item.alias)}
            tabIndex={-1}
            disableRipple
            value={item.alias}
          />
          <ListItemText className={classes.listText} primary={item.title} />
        </ListItem>
      );
    });
  }

  function handleToggleLayerClickEvent(value) {
    if (!layersChecked.includes(value)) {
      const temp = [...layersChecked, value];
      setFeatureAndImageLayer(value, true);
      setLayersChecked(temp);
    }
    if (layersChecked.includes(value)) {
      const temp = layersChecked.filter(item => item !== value);
      setFeatureAndImageLayer(value, false);
      setLayersChecked(temp);
    }
  }

  function setFeatureAndImageLayer(type, isVisible) {
    const featureLayer = map.findLayerById(layerId[type]);
    // const imageLayer = map.findLayerById(layerId.image);
    // const subImageLayer = imageLayer.findSublayerById(imageLayerId[layerId[type]]);
    featureLayer.visible = isVisible;
    // subImageLayer.visible = isVisible;
  }
}
