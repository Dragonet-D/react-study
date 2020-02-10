import React, { Fragment, useState } from 'react';
import { withStyles } from '@material-ui/core';
import { PlayArrow, Add, Remove, Home, VideocamOff } from '@material-ui/icons';
import PropTypes from 'prop-types';

function LiveMode(props) {
  const { classes, getControlInfo } = props;
  const [setVideoStatus] = useState('stopstream');

  function handlePlay(e) {
    getControlInfo(e);
  }

  const handlePlayStatus = e => () => {
    setVideoStatus(e);
    getControlInfo(e);
  };

  return (
    <Fragment>
      <div className={classes.content}>
        {['up', 'right', 'down', 'left'].map(item => {
          const classItem = `arrow_${item}`;
          return (
            <PlayArrow
              onClick={handlePlay.bind(this, item)}
              key={item}
              className={`${classes.empty_arrow} ${classes[classItem]}`}
            />
          );
        })}
        <div className={classes.empty}>
          {['upleft', 'upright', 'downleft', 'downright'].map(item => {
            const classItem = `arrow_${item}`;
            return (
              <PlayArrow
                onClick={handlePlay.bind(this, item)}
                key={item}
                className={`${classes.empty_arrow} ${classes[classItem]}`}
              />
            );
          })}
          <section className={classes.control}>
            <div className={classes.voice_control}>
              <Add className={classes.empty_arrow} onClick={handlePlay.bind(this, 'zoomin')} />
            </div>
            <div className={classes.home}>
              <Home className={`${classes.empty_arrow}`} onClick={handlePlay.bind(this, 'home')} />
            </div>
            <div className={classes.line} />
            <div className={classes.voice_control}>
              <Remove
                className={`${classes.empty_arrow}`}
                onClick={handlePlay.bind(this, 'zoomout')}
              />
            </div>
          </section>
        </div>
      </div>
      <div className={classes.content_control}>
        <div className={classes.video_control}>
          {<VideocamOff onClick={handlePlayStatus('stopstream')} className={classes.video_icon} />}
        </div>
      </div>
    </Fragment>
  );
}

const styles = theme => {
  const emptyArrowDistance = '-5px';
  const arrowDistance = '3px';
  const { palette } = theme;
  const { default: defaultBackColor } = palette.background;
  return {
    content: {
      width: '150px',
      height: '150px',
      backgroundColor: palette.primary.light,
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      marginTop: '10px'
    },
    empty: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      backgroundColor: defaultBackColor,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    },
    empty_arrow: {
      color: palette.text.primary,
      position: 'absolute',
      cursor: 'pointer',
      '&:hover': {
        color: theme.palette.secondary.dark
      }
    },
    arrow_upleft: {
      top: emptyArrowDistance,
      left: emptyArrowDistance,
      transform: 'rotate(-135deg)'
    },
    arrow_upright: {
      top: emptyArrowDistance,
      right: emptyArrowDistance,
      transform: 'rotate(-45deg)'
    },
    arrow_downleft: {
      bottom: emptyArrowDistance,
      left: emptyArrowDistance,
      transform: 'rotate(135deg)'
    },
    arrow_downright: {
      bottom: emptyArrowDistance,
      right: emptyArrowDistance,
      transform: 'rotate(45deg)'
    },
    arrow_up: {
      top: arrowDistance,
      left: '50%',
      transform: 'rotate(-90deg) translateY(-50%)'
    },
    arrow_right: {
      right: arrowDistance,
      top: '50%',
      transform: 'translateY(-50%)'
    },
    arrow_down: {
      bottom: arrowDistance,
      left: '50%',
      transform: 'rotate(90deg) translateY(50%)'
    },
    arrow_left: {
      left: arrowDistance,
      top: '50%',
      transform: 'rotate(-180deg) translateY(50%)'
    },
    control: {
      width: '90px',
      height: '90px',
      borderRadius: '50%',
      backgroundColor: palette.primary.light,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    },
    voice_common: {
      color: palette.text.primary
    },
    home: {
      width: '36px',
      height: '36px',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      backgroundColor: defaultBackColor,
      borderRadius: '50%'
    },
    line: {
      height: '1px',
      backgroundColor: defaultBackColor,
      margin: '14px 0'
    },
    voice_control: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    },
    content_control: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      paddingRight: '6px'
    },
    video_icon: {
      color: palette.text.primary,
      cursor: 'pointer',
      '&:hover': {
        color: theme.palette.secondary.dark
      }
    },
    video_control: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: '4px'
    }
  };
};
LiveMode.defaultProps = {
  getControlInfo: () => {}
};
LiveMode.propTypes = {
  getControlInfo: PropTypes.func
};

export default withStyles(styles)(LiveMode);
