// this component file for the feature one compare to multiple

import React, { useState, useCallback } from 'react';
import { Upload } from 'components/common';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import makeStyles from '@material-ui/core/styles/makeStyles';
import _ from 'lodash';
import { I18n } from 'react-i18nify';
import { getBase64 } from 'utils/utils';
import FaceShow from '../FaceShow';

const useStyles = makeStyles(theme => {
  return {
    wrapper: {},
    item: {
      float: 'left',
      width: '104px',
      marginRight: theme.spacing(1)
    },
    card: {
      marginRight: theme.spacing(1),
      cursor: 'pointer',
      width: '130px'
    },
    media: {
      width: '130px',
      height: '104px'
    },
    upload: {
      width: '130px',
      height: '104px',
      cursor: 'pointer',
      float: 'left',
      marginTop: theme.spacing(1)
    },
    upload_inner: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    text: {
      marginTop: theme.spacing(1)
    }
  };
});

const CompareTargetList = props => {
  const { label } = props;

  const classes = useStyles();
  const [avatarList, setAvatarList] = useState([]);

  const fileUploadChange = useCallback(
    async e => {
      const { name, type, size } = e.file;
      if (!type.includes('image') || size / 1024 / 1000 > 5 || avatarList.length > 10) {
        return;
      }
      const image = await getBase64(e.file);
      setAvatarList(prevData => {
        const data = _.cloneDeep(prevData);
        data.push({
          image,
          name,
          key: Math.random()
        });
        if (data.length > 10) {
          data.length = 10;
        }
        return data;
      });
    },
    [avatarList]
  );

  const handleDelete = useCallback(index => {
    setAvatarList(prevData => {
      const data = _.cloneDeep(prevData);
      data.splice(index, 1);
      return data;
    });
  }, []);

  return (
    <div className={`${classes.wrapper} clearfix`}>
      <span>{label}</span>
      {avatarList.map((item, index) => (
        <FaceShow
          key={item.key}
          image={item.image}
          index={index}
          name={item.name}
          onDelete={handleDelete}
          isDeleteNeed
          className={classes.item}
        />
      ))}
      <div className={classes.upload}>
        <Upload
          name="picture"
          showUploadList={false}
          action=""
          multiple={false}
          beforeUpload={() => false}
          onChange={fileUploadChange}
        >
          <div className={classes.upload_inner}>
            <AddIcon />
            <Typography
              component="span"
              variant="caption"
              color="textSecondary"
              className={classes.text}
            >
              {I18n.t('vap.face.faceEnrollment.uploadFaceImages')}
            </Typography>
          </div>
        </Upload>
      </div>
    </div>
  );
};

export default CompareTargetList;
