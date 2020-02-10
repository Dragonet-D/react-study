/* eslint-disable react/jsx-boolean-value */
import React, { useState, forwardRef, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import C from 'classnames';
import { SnackbarProvider, useSnackbar } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/WarningOutlined';
import { green, amber, indigo } from '@material-ui/core/colors';
import { IVHTable } from 'components/common';
import { connect } from 'dva';
import _ from 'lodash';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

function getNewData(newData, prevData) {
  if (!prevData.length) {
    return newData;
  } else {
    return newData
      .concat(prevData)
      .filter(v => !newData.find(a => a.key === v.key) || !prevData.find(a => a.key === v.key));
  }
}

let zIndex = 1400;

const useStyles = makeStyles(theme => {
  const { messageCenter, error } = theme.palette;
  return {
    card: {
      minWidth: 344,
      boxShadow: 'unset'
    },
    title: {
      paddingLeft: theme.spacing(2),
      maxWidth: '270px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    typography: {
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center'
    },
    success: {
      backgroundColor: messageCenter ? messageCenter.success : green[600]
    },
    error: {
      backgroundColor: messageCenter ? messageCenter.error : error.dark
    },
    info: {
      backgroundColor: messageCenter ? messageCenter.info : indigo[700]
    },
    warning: {
      backgroundColor: messageCenter ? messageCenter.warning : amber[700]
    },
    icons: {
      marginLeft: 'auto'
    },
    expand: {
      padding: '8px 8px',
      transform: 'rotate(0deg)',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest
      })
    },
    expandOpen: {
      transform: 'rotate(180deg)'
    },
    collapse: {
      padding: 16
    },
    checkIcon: {
      fontSize: 20,
      paddingRight: 4
    },
    button: {
      padding: 0,
      textTransform: 'none'
    },
    tableHead: {
      fontWeight: 'bold'
    },
    listTitle: {
      width: theme.spacing(17.5),
      justifyContent: 'flex-start',
      paddingRight: 5
    },
    listTextEllipsis: {
      display: 'inline-block',
      maxWidth: theme.spacing(110),
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    fontColorBase: {
      color: theme.palette.text.primary
    }
  };
});

const messageBodyIndex = [
  {
    title: 'Source Name',
    index: 'sourceName'
  },
  {
    title: 'ID',
    index: 'notificationId'
  },
  {
    title: 'Type',
    index: 'notificationType'
  }
];

function getBodyTableData(data) {
  if (data.notificationContent && data.notificationContent.data) {
    const notificationContentData = data.notificationContent.data;
    if (notificationContentData.deviceInfo) {
      return { ...notificationContentData.deviceInfo };
    }

    return { ...notificationContentData };
  }

  return {};
}

function MessageBody({ messageInfo, type, handleSnackCloseAndReadMsg }) {
  const classes = useStyles();
  const alarmMsg = { ...messageInfo };
  const data = getBodyTableData(alarmMsg);
  const columns = Object.keys(data).map(item => {
    return {
      title: item,
      dataIndex: item,
      width: 50
    };
  });
  return (
    <Card className={C(classes.card, classes[type])}>
      <CardContent>
        {messageBodyIndex.map(item => {
          return (
            <ListItem key={item.index} disableRipple dense button>
              <ListItemIcon className={classes.listTitle}>
                <span className={classes.fontColorBase}>{`${item.title} :`}</span>
              </ListItemIcon>

              <ListItemText
                primary={
                  <span title={alarmMsg[item.index]} className={classes.listTextEllipsis}>
                    {alarmMsg[item.index]}
                  </span>
                }
              />
            </ListItem>
          );
        })}
        {/** content */}
        <IVHTable
          classCustom={{ tableHead: classes.fontColorBase }}
          columns={columns}
          dataSource={[data]}
        />
      </CardContent>
      <CardActions>
        <Button variant="outlined" size="small" onClick={handleSnackCloseAndReadMsg}>
          Cancel
        </Button>
      </CardActions>
    </Card>
  );
}

const SnackMessage = forwardRef((props, ref) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const { message, onClose, id, type, wsMessageCenter = {} } = props;
  const refExpand = useRef(null);
  const audio1 = useRef(null);

  const handleExpandClick = () => {
    setExpanded(!expanded);
    zIndex++;
    refExpand.current.offsetParent.style.zIndex = zIndex;
  };

  const handleDismiss = () => {
    onClose(id);
  };

  useEffect(() => {
    if (wsMessageCenter.wsMute) {
      audio1.current.pause();
    } else {
      audio1.current.play();
    }
  }, [wsMessageCenter, message]);

  const Icon = variantIcon[type];
  return (
    <Card className={classes.card} ref={ref}>
      <CardActions classes={{ root: classes[type] }}>
        <Typography component="div" variant="subtitle2" className={classes.typography}>
          <Icon />
          <Typography component="h6" className={C(classes.title, classes.fontColorBase)}>
            {message.notificationType}
          </Typography>
        </Typography>
        <div className={classes.icons}>
          <IconButton
            aria-label="Show more"
            className={C(classes.expand, { [classes.expandOpen]: expanded })}
            onClick={handleExpandClick}
            ref={refExpand}
          >
            <ExpandMoreIcon classes={{ root: classes.fontColorBase }} />
          </IconButton>
          <IconButton className={classes.expand} onClick={handleDismiss}>
            <CloseIcon classes={{ root: classes.fontColorBase }} />
          </IconButton>
        </div>
      </CardActions>
      <Collapse className={classes[type]} in={expanded} timeout="auto" unmountOnExit>
        <Paper className={C(classes.collapse, classes[type])}>
          <Typography gutterBottom component="div">
            <MessageBody
              key={message.notificationUuid || message.sentTime}
              messageInfo={message}
              type={type}
              handleSnackCloseAndReadMsg={handleDismiss}
            />
          </Typography>
        </Paper>
      </Collapse>
      <audio ref={audio1} preload="true" style={{ display: 'none' }}>
        <track kind="captions" preload="true" style={{ display: 'none' }} />
        <source src="/static/media/audio1.mp3" />
      </audio>
    </Card>
  );
});

SnackMessage.propTypes = {
  id: PropTypes.number.isRequired
};

function MyApp(props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { messageCenter, dispatch } = props;
  const { notifications, wsMessageCenter } = messageCenter;
  const [notificationsState, setNotificationsState] = useState([]);
  const [displayedKeys, setDisplayedKeys] = useState([]);

  const onClose = useCallback(
    key => {
      closeSnackbar(key);
      setTimeout(() => {
        dispatch({
          type: 'messageCenter/read2',
          payload: {
            key,
            unread: false
          }
        });
      });
    },
    [closeSnackbar, dispatch]
  );

  useEffect(() => {
    const tempNotifications = _.cloneDeep(notifications).filter(item => item.unread);
    if (!_.isEmpty(tempNotifications)) {
      getNewData(tempNotifications, notificationsState).forEach(item => {
        if (!displayedKeys.length || !displayedKeys.includes(item.key)) {
          enqueueSnackbar('', {
            persist: false,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left'
            },
            key: item.key,
            children: key => (
              <SnackMessage
                onClose={onClose}
                id={key}
                message={item.message}
                type={item.type}
                wsMessageCenter={wsMessageCenter}
              />
            )
          });
          setDisplayedKeys(prev => {
            const data = _.cloneDeep(prev);
            return [...data, item.key];
          });
        }
      });
    }
    setNotificationsState(tempNotifications);
  }, [displayedKeys, enqueueSnackbar, notifications, notificationsState, onClose, wsMessageCenter]);

  return null;
}

function WSMessageCenter(props) {
  const { messageCenter, dispatch } = props;
  const ref = useRef(null);
  return (
    <SnackbarProvider maxSnack={3} ref={ref}>
      <MyApp messageCenter={messageCenter} dispatch={dispatch} />
    </SnackbarProvider>
  );
}

export default connect(({ messageCenter }) => ({
  messageCenter
}))(WSMessageCenter);
