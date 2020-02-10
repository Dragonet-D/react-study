import React, { useState } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { UnfoldMore, UnfoldLess, KeyboardArrowUp, KeyboardArrowDown } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  headerContainer: {
    flex: '0 0 auto',
    display: 'flex',
    height: theme.spacing(5),
    width: '100%',
    backgroundColor: theme.palette.background.default,
    alignItems: 'center',
    '&:hover': {
      cursor: 'move'
    }
  },
  headerTitle: {
    flex: '0 0 auto',
    fontWeight: 'bold',
    paddingLeft: theme.spacing(1)
  },
  headerSpacing: {
    flex: '1 1 100%'
  },
  headerOperation: {
    flex: '0 0 auto',
    paddingRight: theme.spacing()
  },
  cursorPointer: {
    cursor: 'pointer'
  },
  hide: {
    display: 'none'
  }
}));

export default function DialogWindowHeader(props) {
  const {
    title,
    setWindowPosition,
    setWindowSize,
    setWindowEnableResizing,
    setWindowDisableDragging,
    setWindowMinSize,
    default: def,
    minWidth,
    minHeight,
    elementClassName
  } = props;
  const [defaultOperation, setDefaultOperation] = useState({
    restoreDown: true,
    maximize: false,
    restoreUp: true,
    minimize: false
  });
  const classes = useStyles();

  return (
    <div
      className={classNames(classes.headerContainer, 'dialog-window-header')}
      onClick={handleWindowHeaderClickEvent}
    >
      <div className={classes.headerTitle}>{title}</div>
      <div className={classes.headerSpacing} />
      <div className={classes.headerOperation}>
        <span
          title="Restore Down"
          className={classNames(classes.cursorPointer, {
            [classes.hide]: defaultOperation.restoreDown
          })}
        >
          <UnfoldLess onClick={handleRestoreDownClickEvent} />
        </span>
        <span
          title="Maximize"
          className={classNames(classes.cursorPointer, {
            [classes.hide]: defaultOperation.maximize
          })}
        >
          <UnfoldMore onClick={handleMaximizeClickEvent} />
        </span>
        <span
          title="Restore Up"
          className={classNames('restore-up', classes.cursorPointer, {
            [classes.hide]: defaultOperation.restoreUp
          })}
        >
          <KeyboardArrowUp onClick={handleRestoreUpClickEvent} />
        </span>
        <span
          title="Minimize"
          className={classNames(classes.cursorPointer, {
            [classes.hide]: defaultOperation.minimize
          })}
        >
          <KeyboardArrowDown onClick={handleMinimizeClickEvent} />
        </span>
      </div>
    </div>
  );

  function handleWindowHeaderClickEvent() {
    const dialogWindow = document.getElementsByClassName('dialog-window');
    const currentDialogWindowElement = document.getElementsByClassName(elementClassName);
    const currentDialogWindowElementStyle = currentDialogWindowElement[0];
    if (currentDialogWindowElementStyle && currentDialogWindowElementStyle.zIndex === 1100) {
      return;
    }
    for (const node of dialogWindow) {
      if (node.className.includes(elementClassName)) {
        node.style.zIndex = 1100;
      } else {
        node.style.zIndex = 1050;
      }
    }
  }

  function handleRestoreDownClickEvent() {
    setDefaultOperation(state => {
      const allTrue = setDefaultOperationValueToTrue(state);
      return {
        ...allTrue,
        maximize: false,
        minimize: false
      };
    });

    setWindowPosition({ x: def.x, y: def.y });
    setWindowSize({ width: def.width, height: def.height });
  }

  function handleMaximizeClickEvent() {
    setDefaultOperation(state => {
      const allTrue = setDefaultOperationValueToTrue(state);
      return {
        ...allTrue,
        restoreDown: false,
        minimize: false
      };
    });

    setWindowPosition({ x: 15, y: 15 });
    setWindowSize({ width: '98%', height: '95%' });
  }

  function handleRestoreUpClickEvent() {
    setDefaultOperation(state => {
      const allTrue = setDefaultOperationValueToTrue(state);
      return {
        ...allTrue,
        maximize: false,
        minimize: false
      };
    });

    restoreUpWindow();
  }

  function handleMinimizeClickEvent() {
    setDefaultOperation(state => {
      const allTrue = setDefaultOperationValueToTrue(state);
      return {
        ...allTrue,
        restoreUp: false
      };
    });

    minimizeWindow();
  }

  function setDefaultOperationValueToTrue(state) {
    return Object.keys(state).reduce((previous, current) => {
      return {
        ...previous,
        [current]: true
      };
    }, {});
  }

  function disableWindowSizing() {
    setWindowEnableResizing({
      top: false,
      right: false,
      bottom: false,
      left: false,
      topRight: false,
      bottomRight: false,
      bottomLeft: false,
      topLeft: false
    });
  }

  function enableWindowSizing() {
    setWindowEnableResizing({
      top: true,
      right: true,
      bottom: true,
      left: true,
      topRight: true,
      bottomRight: true,
      bottomLeft: true,
      topLeft: true
    });
  }

  function minimizeWindow() {
    disableWindowSizing();
    setWindowDisableDragging(true);
    setWindowPosition({ x: 0, y: 0 });
    setWindowSize({
      width: 200,
      height: 45
    });

    const el = document.getElementsByClassName(elementClassName)[0];
    setElementStyles(el, {
      minHeight: '45px',
      minWidth: '200px'
    });

    let dialogWindowContainer = document.getElementsByClassName('dialog-window-container')[0];
    if (!dialogWindowContainer) {
      dialogWindowContainer = createDialogWindowContainer();
    }

    const dialogWindowHeader = createMinimumDialogWindow(el);
    dialogWindowContainer.append(dialogWindowHeader);
    el.parentElement.append(dialogWindowContainer);
    setElementStyles(el, {
      display: 'none'
    });
  }

  function restoreUpWindow() {
    const currentMinimumDialogWindowElement = document.getElementById(elementClassName);
    const dialogWindowContainer = document.getElementsByClassName('dialog-window-container')[0];
    if (!dialogWindowContainer.childNodes[0]) {
      dialogWindowContainer.parentElement.removeChild(dialogWindowContainer);
    }

    if (dialogWindowContainer.contains(currentMinimumDialogWindowElement)) {
      dialogWindowContainer.removeChild(currentMinimumDialogWindowElement);
    }

    const currentDialogWindowElement = document.getElementsByClassName(elementClassName)[0];
    setElementStyles(currentDialogWindowElement, {
      display: 'block'
    });

    enableWindowSizing();
    setWindowDisableDragging(false);
    setWindowPosition({ x: def.x, y: def.y });
    setWindowSize({
      width: def.width,
      height: def.height
    });
    setWindowMinSize({
      minWidth,
      minHeight
    });
  }

  function createMinimumDialogWindow(el) {
    const headerElement = el.getElementsByClassName('dialog-window-header')[0];
    const headerElementClone = headerElement && headerElement.cloneNode(true);
    headerElementClone.id = elementClassName;
    const restoreUpElement = headerElementClone.getElementsByClassName('restore-up')[0];
    const allHeaderOperationElement = restoreUpElement.parentElement.childNodes;
    if (allHeaderOperationElement[0]) {
      allHeaderOperationElement.forEach(node => {
        setElementStyles(node, {
          display: 'none'
        });
      });
    }
    setElementStyles(restoreUpElement, {
      display: 'inline'
    });
    setElementStyles(headerElementClone, {
      width: '200px',
      height: '40px',
      minWidth: '200px',
      minHeight: '40px',
      position: 'static',
      marginLeft: '15px'
    });

    // add click event
    restoreUpElement.addEventListener('click', handleRestoreUpClickEvent);

    return headerElementClone;
  }

  function createDialogWindowContainer() {
    const element = document.createElement('div');
    element.className = 'dialog-window-container';
    const styles = {
      display: 'flex',
      width: '100%',
      height: '50px',
      position: 'absolute',
      bottom: 0,
      left: 0
    };

    setElementStyles(element, styles);
    return element;
  }

  function setElementStyles(el, styles) {
    Object.keys(styles).forEach(key => {
      el.style[key] = styles[key];
    });
  }
}
