import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/WarningOutlined';
import CloseIcon from '@material-ui/icons/Close';
import classNames from 'classnames';
import { green, amber, indigo } from '@material-ui/core/colors';
import withStyles from '@material-ui/core/styles/withStyles';
import { I18n } from 'react-i18nify';

const anchorOrigin = { vertical: 'top', horizontal: 'right' };
const containerSize = { width: 300, height: 140 };
const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const stylesForContent = Theme => {
  const { messageCenter, common, error } = Theme.palette;
  return {
    root: {
      width: `${containerSize.width}px`,
      height: `${containerSize.height}px`,
      color: common.white,
      flexGrow: 0
    },
    typoColor: {
      color: common.white
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
    icon: {
      fontSize: 20
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: '8px'
    },
    msg: {
      overflow: 'hidden',
      height: '40px',
      '& span': {
        width: '100%'
      }
    },
    messageCon: {
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      boxOrient: 'vertical',
      overflow: 'hidden',
      width: '252px'
    },
    msgClamp: {
      // whiteSpace: 'nowrap',
      // textOverflow: 'ellipsis',
      // overflow: 'hidden',
      wordBreak: 'break-word',
      lineClamp: 2
    },
    titleClamp: {
      whiteSpace: 'nowrap',
      lineClamp: 1,
      display: 'flex',
      alignItems: 'center'
    },
    message_content: {
      display: 'flex',
      alignItems: 'center'
    },
    action: {
      width: '100%',
      paddingLeft: 0,
      marginLeft: 0,
      justifyContent: 'space-between'
    },
    FormControlLabelRoot: {
      marginBottom: 0
    }
  };
};

const stylesForSnack = () => ({
  anchorOriginTopRight: {
    top: '30px'
  }
});

const Content = props => {
  const { classes, source, className, message, onClose, variant, mute, onMute, ...other } = props;
  const Icon = variantIcon[variant];
  return (
    <SnackbarContent
      className={classNames(classes[variant], className, classes.root)}
      aria-describedby="client-snackbar"
      message={
        <>
          {source && (
            <Typography
              variant="subtitle1"
              title={source}
              classes={{ subtitle1: classes.typoColor }}
              className={classNames(classes.messageCon, classes.titleClamp)}
            >
              <Icon className={classNames(classes.icon, classes.iconVariant)} />
              <span className={classes.message_content}>{source}</span>
            </Typography>
          )}
          <div className={classes.msg} title={message}>
            <span className={classNames(classes.messageCon, classes.msgClamp)}>{message}</span>
          </div>
        </>
      }
      classes={{
        action: classes.action
      }}
      action={
        <>
          <FormControlLabel
            classes={{ root: classes.FormControlLabelRoot, label: classes.typoColor }}
            control={
              <Checkbox
                classes={{ root: classes.typoColor }}
                checked={mute}
                onChange={e => {
                  onMute(e.target.checked);
                }}
                value="mute"
              />
            }
            label={I18n.t('global.messageCenter.muteTenMinutes')}
          />
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={onClose}
          >
            <CloseIcon className={classes.icon} />
          </IconButton>
        </>
      }
      {...other}
    />
  );
};
const ContentWrapper = withStyles(stylesForContent)(Content);

function Snackbars(props) {
  const onClose = (event, reason) => {
    const { id, onClose, open } = props;
    // eslint-disable-next-line no-unused-expressions
    reason !== 'clickaway' && open && onClose(id);
  };

  const { classes, type, source, message, open, mute, autoHideDuration, onMute, zIndex } = props;
  return (
    <div className="isc-Snackbar">
      <Snackbar
        anchorOrigin={anchorOrigin}
        open={open}
        onClose={onClose}
        autoHideDuration={autoHideDuration}
        style={{ zIndex: zIndex + 1400 }}
        classes={{
          anchorOriginTopRight: classes.anchorOriginTopRight
        }}
      >
        <ContentWrapper
          onClose={onClose}
          variant={type}
          source={source}
          message={message}
          mute={mute}
          onMute={onMute}
        />
      </Snackbar>
    </div>
  );
}

Snackbars.propTypes = {
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
  id: PropTypes.number.isRequired
};

export default withStyles(stylesForSnack)(Snackbars);
