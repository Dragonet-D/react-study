import React, { memo, useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import { routerRedux } from 'dva';
import makeStyles from '@material-ui/core/styles/makeStyles';
import PropTypes from 'prop-types';
import { I18n } from 'react-i18nify';
import _ from 'lodash';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import VideoCamIcon from '@material-ui/icons/Videocam';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import { addBase64Prefix } from 'utils/utils';
import Player from 'pages/VMS/player/PlayerComponent';
import { MapDrawing } from 'components/common/Map';
import { ListItemPreview, DialogTitle, PreviewImage } from 'components/common';
import stroe from '@/index';

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      width: '50vw',
      padding: '0 24px',
      height: '100%'
    },
    item: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    alarm_type: {
      width: '50%'
    },
    channel: {
      display: 'flex',
      alignItems: 'center'
    },
    channel_container: {
      display: 'flex'
    },
    media: {
      width: 40,
      height: 40,
      cursor: 'pointer'
    },
    forward: {
      marginLeft: '8px'
    },
    face_wrapper: {
      display: 'flex'
    },
    face: {
      display: 'flex',
      alignItems: 'center',
      width: '50%',
      marginTop: 8
    },
    face_label: {
      width: '33.33333%'
    },
    map: {
      minHeight: 400,
      flex: 1
    },
    video: {
      minHeight: 400,
      flex: 1
    }
  };
});

const VapAlarmShowDetails = memo(props => {
  const classes = useStyles();
  const { handleClose, open, dataSource, getHandleType, streamData, playbackStreamData } = props;
  const [videoActive, setVideoActive] = useState('');
  const [channelChecked, setChannelChecked] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewStatus, setPreviewStatus] = useState(false);

  const enrolledFace = _.get(dataSource, 'personImages.imgBase64', '');
  const matchedFace = _.get(dataSource, 'snapshot', '');

  function handleDrawerClose() {
    handleClose();
  }

  const handleVideoPlay = target => () => {
    setVideoActive(prev => {
      if (target === prev) {
        return '';
      } else {
        getHandleType(target, {
          channelId: _.get(dataSource, 'sourceId.deviceChannelId', ''),
          channelName: _.get(dataSource, 'sourceId.sourceName', ''),
          deviceId: _.get(dataSource, 'sourceId.deviceId', ''),
          from: new Date().getTime(_.get(dataSource, 'time', Date.now())) - 5000,
          to: new Date().getTime(_.get(dataSource, 'time', Date.now())) + 5000
        });
        return target;
      }
    });
  };

  function toggleChannel(e) {
    const { checked } = e.target;
    setChannelChecked(checked);
  }

  const handlePreview = image => () => {
    setPreviewImage(image);
    setPreviewStatus(true);
  };

  function onPreviewClose() {
    setPreviewStatus(false);
  }

  function handleForward() {
    stroe.dispatch(routerRedux.push('/uvap/face/face-enrollment'));
  }

  return (
    <Drawer open={!!open} anchor="left" onClose={handleDrawerClose} keepMounted={false}>
      <>
        <DialogTitle>Alarm Details</DialogTitle>
        <div className={classes.wrapper}>
          <ListItemPreview
            className={classes.alarm_type}
            dataSource={{ [I18n.t('alarm.history.alarmType')]: dataSource.alarmTypeDesc }}
          />
          <div className={classes.channel}>
            <Typography color="textSecondary">{I18n.t('alarm.history.channelInfo')}</Typography>
            <FormControlLabel
              value="start"
              control={<Switch checked={channelChecked} color="primary" onChange={toggleChannel} />}
              label={_.get(dataSource, 'sourceId.sourceName', '')}
              labelPlacement="start"
            />
            <IconButton onClick={handleVideoPlay('live')}>
              <VideoCamIcon color={videoActive === 'live' ? 'primary' : 'inherit'} />
            </IconButton>
            <IconButton onClick={handleVideoPlay('playback')}>
              <OndemandVideoIcon color={videoActive === 'playback' ? 'primary' : 'inherit'} />
            </IconButton>
          </div>
          <div className={classes.channel_container}>
            {channelChecked && (
              <div className={classes.map}>
                <MapDrawing
                  graphics={{
                    geometry: {
                      type: 'point',
                      longitude: _.get(dataSource, 'sourceId.location.longitude', ''),
                      latitude: _.get(dataSource, 'sourceId.location.latitude', '')
                    },
                    symbol: {
                      image: '/static/media/online.png',
                      width: 20,
                      height: 30
                    }
                  }}
                />
              </div>
            )}
            {videoActive === 'live' && !_.isEmpty(streamData) && (
              <div className={classes.video}>
                <Player url={_.get(streamData, 'urls', '')} keyId="1" scale={1} />
              </div>
            )}
            {videoActive === 'playback' && !_.isEmpty(playbackStreamData) && (
              <div className={classes.video}>
                <Player url={_.get(playbackStreamData, 'urls', '')} keyId="2" scale={1} />
              </div>
            )}
          </div>
          <Typography>{I18n.t('alarm.history.details')}</Typography>
          <div className={classes.item}>
            <ListItemPreview
              dataSource={{
                [I18n.t('alarm.history.confidenceLevel')]: _.get(dataSource, 'data.confidence', 0)
              }}
            />
            <ListItemPreview
              dataSource={{
                [I18n.t('alarm.history.notificationGroup')]: _.get(
                  dataSource,
                  'data.personGroupName',
                  ''
                )
              }}
            />
          </div>
          <div className={classes.item}>
            <ListItemPreview
              className={classes.alarm_type}
              dataSource={{
                [I18n.t('alarm.history.personName')]: _.get(dataSource, 'data.personName')
              }}
            />
          </div>
          <div className={classes.face}>
            <Typography variant="subtitle2" color="textSecondary" className={classes.face_label}>
              {I18n.t('alarm.history.enrolledFace')}
            </Typography>
            {enrolledFace && (
              <CardMedia
                onClick={handlePreview(addBase64Prefix(enrolledFace))}
                className={classes.media}
                image={addBase64Prefix(enrolledFace)}
              />
            )}
          </div>
          <div className={classes.face}>
            <Typography variant="subtitle2" color="textSecondary" className={classes.face_label}>
              {I18n.t('alarm.history.matchedFace')}
            </Typography>
            {matchedFace && (
              <CardMedia
                onClick={handlePreview(addBase64Prefix(matchedFace))}
                className={classes.media}
                image={addBase64Prefix(matchedFace)}
              />
            )}
            <Button className={classes.forward} onClick={handleForward}>
              {I18n.t('alarm.button.forward')}
            </Button>
          </div>
        </div>
        <PreviewImage open={previewStatus} onClose={onPreviewClose} image={previewImage} />
      </>
    </Drawer>
  );
});

VapAlarmShowDetails.defaultProps = {
  handleClose: () => {},
  open: false,
  dataSource: {},
  getHandleType: () => {}
};

VapAlarmShowDetails.propTypes = {
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  dataSource: PropTypes.object,
  getHandleType: PropTypes.func
};

export default VapAlarmShowDetails;
