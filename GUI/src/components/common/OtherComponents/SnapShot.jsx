import React, { useRef, useState } from 'react';
import Cropper from 'react-cropper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import { I18n } from 'react-i18nify';
import { showBase64Size } from 'utils/utils';
import 'cropperjs/dist/cropper.css';
import msg from 'utils/messageCenter';
import IVHDialog from '../material-ui/IVHDialog';
import UploadSingleImage from './UploadSingleImage';

const useStyles = makeStyles(() => {
  return {
    dialog: {
      width: 1000,
      maxWidth: 1000,
      height: 500
    },
    wrapper: {
      display: 'flex'
    },
    preview: {
      width: '100%',
      height: 300,
      overflow: 'hidden'
    },
    cropper: {
      flex: 2
    },
    preview_wrapper: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    no_data: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  };
});

function SnapShot(props) {
  const classes = useStyles();
  const cropper = useRef(null);

  const { title, getSnapShotImage, imageSize, ...rest } = props;
  const [imageSrc, setImageSrc] = useState('');
  function getImage(e) {
    setImageSrc(e);
  }

  function handleSave() {
    if (typeof cropper.current.getCroppedCanvas() === 'undefined' || !imageSrc) {
      return;
    }
    const snapShotData = cropper.current.getCroppedCanvas().toDataURL();
    if (showBase64Size(snapShotData) > imageSize) {
      msg.error(
        I18n.t('global.remindInformation.faceUploadImageSizeLarge'),
        I18n.t('global.remindInformation.uploadFaceImage')
      );
      return;
    }
    getSnapShotImage(snapShotData);
  }

  return (
    <IVHDialog title={title} handleSave={handleSave} dialogWidth={classes.dialog} {...rest}>
      <div className={imageSrc ? '' : classes.no_data}>
        {imageSrc && (
          <div className={classes.wrapper}>
            <Cropper
              className={classes.cropper}
              style={{ height: 350, width: 650 }}
              aspectRatio={1}
              preview=".snap_shot_img_preview"
              guides
              src={imageSrc}
              ref={cropper}
            />
            {imageSrc && (
              <div className={classes.preview_wrapper}>
                <Typography variant="h6" color="textSecondary">
                  {I18n.t('vap.label.preview')}
                </Typography>
                <div className={`snap_shot_img_preview ${classes.preview}`} />
              </div>
            )}
          </div>
        )}
        <UploadSingleImage getImage={getImage} />
      </div>
    </IVHDialog>
  );
}

SnapShot.defaultProps = {
  title: I18n.t('vap.face.faceEnrollment.uploadFaceImage'),
  getSnapShotImage: () => {},
  imageSize: 1024
};

export default SnapShot;
