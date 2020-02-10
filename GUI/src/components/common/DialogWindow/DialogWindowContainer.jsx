/* eslint-disable react/jsx-boolean-value */
import React, { useState } from 'react';
import classNames from 'classnames';
import { Rnd } from 'react-rnd';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    border: `2px solid ${theme.palette.background.default}`,
    boxShadow: '0 0 10px rgba(0,0,0,0.8)'
  }
}));

export default function DialogWindowContainer(props) {
  const { properties, children } = props;
  const [elementClassName, setElementClassName] = useState(() => {
    return generateElementClassName();
  });
  const classes = useStyles();
  const [size, setSize] = useState({
    width: properties.default.width,
    height: properties.default.height
  });
  const [minSize, setMinSize] = useState({
    minWidth: properties.minWidth,
    minHeight: properties.minHeight
  });
  const [enableResizing, setEnableResizing] = useState({
    top: true,
    right: true,
    bottom: true,
    left: true,
    topRight: true,
    bottomRight: true,
    bottomLeft: true,
    topLeft: true
  });
  const [disableDragging, setDisableDragging] = useState(false);
  const [position, setPosition] = useState({ x: properties.default.x, y: properties.default.y });

  return (
    <Rnd
      className={classNames('dialog-window', elementClassName)}
      position={position}
      size={size}
      minHeight={minSize.minHeight || 40}
      minWidth={minSize.minWidth || 200}
      enableResizing={enableResizing}
      disableDragging={disableDragging}
      onDragStop={(e, d) => {
        setPosition({ x: d.x, y: d.y });
      }}
      onResize={(e, direction, ref, delta, position) => {
        setSize({ width: ref.offsetWidth, height: ref.offsetHeight, ...position });
      }}
      {...properties}
    >
      <div className={classes.container}>
        {React.Children.map(children, child => {
          return React.cloneElement(child, {
            setWindowSize: setSize,
            setWindowMinSize: setMinSize,
            setWindowPosition: setPosition,
            setWindowEnableResizing: setEnableResizing,
            setWindowDisableDragging: setDisableDragging,
            setElementClassName,
            elementClassName,
            ...properties
          });
        })}
      </div>
    </Rnd>
  );

  function generateElementClassName() {
    const ID = Math.random()
      .toString(36)
      .substring(0.14);
    return ID;
  }

  // function getDefaultPosition() {
  //   const { top, bottom, left, right } = properties.default;
  //   const mapNode = document.getElementById('home-map');
  //   const windowNode = dialogContainerRef.current;
  //   const offsetParentHeight = mapNode.offsetHeight;
  //   const offsetParentWidth = mapNode.offsetWidth;
  //   const height = windowNode.offsetHeight;
  //   const width = windowNode.offsetWidth;
  //   if (top && left) {
  //     return { x: left, y: top };
  //   }

  //   if (top && right) {
  //     return { x: offsetParentWidth - width - right, y: top };
  //   }

  //   if (bottom && right) {
  //     return { x: offsetParentWidth - width - right, y: offsetParentHeight - height - bottom };
  //   }

  //   if (bottom && left) {
  //     return { x: left, y: offsetParentHeight - height - bottom };
  //   }

  //   return { x: 0, y: 0 };
  // }
}
