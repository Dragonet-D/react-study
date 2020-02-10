import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  bodyContainer: {
    flex: '1 1 100%',
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    cursor: 'default'
  }
}));

export default function DialogWindowBody(props) {
  const { children, elementClassName } = props;
  const classes = useStyles();
  useEffect(() => {
    const bodyNode = document.getElementById('DIALOG_WINDOW_BODY');
    bodyNode.addEventListener('mousedown', handleWindowBodyClickEvent);
    return function cleanup() {
      bodyNode.removeEventListener('mousedown', handleWindowBodyClickEvent);
    };
  });

  function handleWindowBodyClickEvent(event) {
    event.stopPropagation();
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
  return (
    <div id="DIALOG_WINDOW_BODY" className={classes.bodyContainer}>
      {children}
    </div>
  );
}
