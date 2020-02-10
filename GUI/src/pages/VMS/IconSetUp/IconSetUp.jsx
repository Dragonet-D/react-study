import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import msg from 'utils/messageCenter';
import { ToolTip, IVHTable } from 'components/common';
import { isSuccess } from 'utils/helpers';
import { UploadDialog as Upload } from 'components/VMS/IconSetup';
import { I18n } from 'react-i18nify';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Backup from '@material-ui/icons/Backup';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import styles from './IconSetUp.module.less';

const useStyles = makeStyles(theme => {
  return {
    handle: {
      color: theme.palette.text.secondary
    },
    wrap: {
      width: 70,
      height: 40
    },
    media: {
      width: 40,
      height: 40,
      marginLeft: 15
    }
    // mask: {
    //   position: 'absolute',
    //   zIndex: 1,
    //   width: 70,
    //   height: 40,
    //   display: 'none',
    //   justifyContent: 'space-around',
    //   alignItems: 'center'
    // },
    // card: {
    //   position: 'relative',
    //   '&:hover': {
    //     backgroundColor: 'red',
    //     'mask': {
    //       display: 'flex'
    //     }
    //   }
    // }
  };
});
function IconSetUp(props) {
  const moduleName = 'VMSIconSetUp';
  const classes = useStyles();
  const { dispatch, global, VMSIconSetUp } = props;
  const { deviceModelList } = VMSIconSetUp;
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [targetItem, setTargetItem] = useState({});
  const [previewStatus, setPreviewStatus] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const { userId } = global;
  // initial
  useEffect(() => {
    dispatch({
      type: `${moduleName}/getDeviceModelList`
    });
  }, [dispatch]);

  const columns = [
    {
      title: I18n.t('uvms.iconSetUp.channelType'),
      dataIndex: 'modelId'
    },
    {
      title: I18n.t('uvms.channel.status'),
      dataIndex: 'status'
    }
  ];

  const handlePreview = src => () => {
    setPreviewStatus(true);
    setPreviewImage(src);
  };

  const previewClose = () => {
    setPreviewStatus(false);
    setPreviewImage('');
  };
  const UploadCell = item => {
    return (
      <ToolTip title="Upload">
        <IconButton aria-label="Upload" onClick={() => openUpload(item)}>
          <Backup />
        </IconButton>
      </ToolTip>
    );
  };
  const IconCell = item => {
    return (
      <>
        {item.iconUri && (
          <Card className={classes.wrap}>
            <div className={styles.card}>
              <div className={styles.mask}>
                <IconButton
                  size="small"
                  onClick={handlePreview(
                    `https://172.16.38.123:32100/api/ummi-device${item.iconUri}`
                  )}
                >
                  <VisibilityIcon className={classes.handle} />
                </IconButton>
                <IconButton size="small" onClick={() => deleteIcon(item.iconId)}>
                  <DeleteIcon className={classes.handle} />
                </IconButton>
              </div>
              <CardMedia
                classes={{ root: classes.media }}
                image={`https://172.16.38.123:32100/api/ummi-device${item.iconUri}`}
                onClick={handlePreview(
                  `https://172.16.38.123:32100/api/ummi-device${item.iconUri}`
                )}
              />
            </div>
          </Card>
        )}
      </>
    );
  };
  const extraCell = {
    columns: [
      {
        title: I18n.t('uvms.iconSetUp.icon'),
        dataIndex: ''
      },
      {
        title: I18n.t('global.button.Operation'),
        dataIndex: ''
      }
    ],
    components: [
      {
        component: IconCell,
        key: '11'
      },
      {
        component: UploadCell,
        key: '12'
      }
    ]
  };
  function openUpload(item) {
    setOpenUploadDialog(true);
    setTargetItem(item);
  }
  function upload(file) {
    dispatch({
      type: `${moduleName}/uploadDeviceIcon`,
      payload: { file }
    }).then(uploadRes => {
      if (!uploadRes) return;
      if (isSuccess(uploadRes)) {
        dispatch({
          type: `${moduleName}/saveDeviceIcon`,
          payload: {
            ...targetItem,
            iconUri: uploadRes.data,
            createdId: userId,
            lastUpdatedId: userId
          }
        }).then(res => {
          if (!res) return;
          if (isSuccess(res)) {
            setOpenUploadDialog(false);
            dispatch({
              type: `${moduleName}/getDeviceModelList`
            });
          } else if (res) {
            msg.error(res.message, 'Icon Setup');
          }
        });
      } else if (uploadRes) {
        msg.error(uploadRes.message, 'Icon Setup');
      }
    });
  }
  function deleteIcon(id) {
    dispatch({
      type: `${moduleName}/deleteIcon`,
      payload: {
        id
      }
    });
  }

  return (
    <>
      <IVHTable
        dataSource={deviceModelList || []}
        columns={columns}
        keyId="iconId"
        extraCell={extraCell}
        tableMaxHeight="calc(100% - 42px)"
      />
      {openUploadDialog && (
        <Upload
          openDialog={openUploadDialog}
          onClose={() => {
            setOpenUploadDialog(false);
          }}
          itemData={targetItem}
          handleSubmit={upload}
        />
      )}
      <Dialog open={previewStatus} footer={null} onClose={previewClose}>
        <img alt="icon" style={{ width: '100%' }} src={previewImage} />
      </Dialog>
    </>
  );
}
export default connect(({ VMSIconSetUp, global }) => ({
  VMSIconSetUp,
  global
}))(IconSetUp);
