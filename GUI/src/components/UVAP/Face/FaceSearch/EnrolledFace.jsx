import React, { useState, useCallback, useEffect } from 'react';
import C from 'classnames';
import _ from 'lodash';
import Typography from '@material-ui/core/Typography';
import { I18n } from 'react-i18nify';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import CardMedia from '@material-ui/core/CardMedia';
import SwipeableViews from 'react-swipeable-views';
import useTheme from '@material-ui/core/styles/useTheme';
import { NoData, TabPanel } from 'components/common';
import Dialog from '@material-ui/core/Dialog';
import styles from './EnrolledFace.module.less';

function EnrolledFace(props) {
  const { className, searchResult, personImages, getPersonInformation } = props;
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [valueWrapper, setValueWrapper] = useState(0);
  const [previewStatus, setPreviewStatus] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const imagesList = personImages || [];
  const isWrapperArrowShow = searchResult.length > 1;
  const isArrowShow = imagesList.length > 1;

  useEffect(() => {
    setValue(0);
    setValueWrapper(0);
  }, [searchResult]);

  const handleSwipeIndexChange = useCallback(
    type => () => {
      switch (type) {
        case 'minus':
          setValue(prev => {
            let index = prev;
            index--;
            if (index < 0) {
              index = imagesList.length - 1;
            }
            return index;
          });
          break;
        case 'add':
          setValue(prev => {
            let index = prev;
            index++;
            if (index === imagesList.length) {
              index = 0;
            }
            return index;
          });
          break;
        default:
          break;
      }
    },
    [imagesList.length]
  );

  const handleWrapperIndexChange = type => () => {
    console.log('type:', type);
    setValue(0);
    switch (type) {
      case 'minus':
        setValueWrapper(prev => {
          let index = prev;
          index--;
          if (index < 0) {
            index = searchResult.length - 1;
          }
          getPersonInformation(searchResult[index]);
          return index;
        });
        break;
      case 'add':
        setValueWrapper(prev => {
          let index = prev;
          index++;
          if (index === searchResult.length) {
            index = 0;
          }
          getPersonInformation(searchResult[index]);
          return index;
        });
        break;
      default:
        break;
    }
  };

  const handlePreview = image => () => {
    setPreviewStatus(true);
    setPreviewImage(image);
  };

  function previewClose() {
    setPreviewStatus(false);
  }

  return (
    <>
      <Dialog open={previewStatus} footer={null} onClose={previewClose}>
        <img alt="Avatar" style={{ width: '100%' }} src={previewImage} />
      </Dialog>
      <div className={C(className, styles.box)}>
        <Typography component="div" color="textSecondary" className={styles.title}>
          {I18n.t('vap.face.faceCompare.enrolledFace')}
        </Typography>
        {_.isEmpty(searchResult) && <NoData />}
        <div style={{ position: 'relative' }}>
          {isWrapperArrowShow && (
            <>
              <IconButton
                className={C(styles.btn, styles.btn_wrapper_left)}
                size="small"
                onClick={handleWrapperIndexChange('minus')}
              >
                <KeyboardArrowLeftIcon fontSize="large" />
              </IconButton>
              <IconButton
                className={C(styles.btn, styles.btn_wrapper_right)}
                size="small"
                onClick={handleWrapperIndexChange('add')}
              >
                <KeyboardArrowRightIcon fontSize="large" />
              </IconButton>
            </>
          )}
          <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={valueWrapper}>
            {searchResult.map((itemWrapper, index) => (
              <TabPanel
                value={valueWrapper}
                index={index}
                dir={theme.direction}
                key={itemWrapper.personId}
              >
                <div className={styles.wrapper}>
                  {!_.isEmpty(imagesList) && (
                    <>
                      <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={value}
                        className={styles.slide_wrapper}
                        slideClassName={styles.slide_inner}
                      >
                        {imagesList.map((item, index) => (
                          <TabPanel value={value} index={index} dir={theme.direction} key={item.id}>
                            <div className={styles.content}>
                              <div className={styles.avatar_wrapper}>
                                {isArrowShow && (
                                  <>
                                    <IconButton
                                      className={C(styles.btn, styles.btn_in, styles.btn_left)}
                                      size="small"
                                      onClick={handleSwipeIndexChange('minus')}
                                    >
                                      <KeyboardArrowLeftIcon fontSize="large" />
                                    </IconButton>
                                    <IconButton
                                      className={C(styles.btn, styles.btn_in, styles.btn_right)}
                                      size="small"
                                      onClick={handleSwipeIndexChange('add')}
                                    >
                                      <KeyboardArrowRightIcon fontSize="large" />
                                    </IconButton>
                                  </>
                                )}
                                <CardMedia
                                  onClick={handlePreview(`data:image/png;base64,${item.imgBase64}`)}
                                  className={styles.avatar}
                                  image={`data:image/png;base64,${item.imgBase64}`}
                                />
                              </div>
                            </div>
                          </TabPanel>
                        ))}
                      </SwipeableViews>
                    </>
                  )}
                  {!_.isEmpty(searchResult) && (
                    <div className={styles.info}>
                      <Typography component="div" className={styles.item}>
                        <Typography
                          component="span"
                          color="textSecondary"
                          className={styles.item_name}
                        >
                          {I18n.t('vap.label.personName')}
                        </Typography>
                        <span className={styles.item_value}>{itemWrapper.personInfo.fullName}</span>
                      </Typography>
                      <Typography component="div" className={styles.item}>
                        <Typography
                          component="span"
                          color="textSecondary"
                          className={styles.item_name}
                        >
                          {I18n.t('vap.face.faceEnrollment.identifyNo')}
                        </Typography>
                        <span className={styles.item_value}>
                          {itemWrapper.personInfo.identityNo}
                        </span>
                      </Typography>
                      {itemWrapper.confidence && (
                        <Typography component="div" className={styles.item}>
                          <Typography
                            component="span"
                            color="textSecondary"
                            className={styles.item_name}
                          >
                            {I18n.t('vap.face.faceSearch.confidence')}
                          </Typography>
                          <span className={styles.item_value}>{itemWrapper.confidence}</span>
                        </Typography>
                      )}
                    </div>
                  )}
                </div>
              </TabPanel>
            ))}
          </SwipeableViews>
        </div>
      </div>
    </>
  );
}

EnrolledFace.defaultProps = {
  getPersonInformation: () => {}
};

export default EnrolledFace;
