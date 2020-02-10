import React, { useCallback, useState, useEffect } from 'react';
import { IVHTable, PreviewImage, Pagination } from 'components/common';
import { I18n } from 'react-i18nify';
import _ from 'lodash';
import CardMedia from '@material-ui/core/CardMedia';
import { addBase64Prefix } from 'utils/utils';
import makeStyles from '@material-ui/core/styles/makeStyles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FaceDialog from '../FaceDialog';

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      height: '400px',
      maxHeight: '400px',
      width: '600px'
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  };
});

function ViewEnrolledPersonsBySpecialWatch(props) {
  const classes = useStyles();
  const {
    dataSource,
    onChangeRowsPerPage,
    onChangePage,
    pageSize,
    pageNo,
    handleClose,
    onDelete,
    get
  } = props;

  const [previewStatus, setPreviewStatus] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [selectedItem, setSelectedItem] = useState({});
  const [data, setData] = useState([]);

  const handlePreview = useCallback(
    target => () => {
      setPreviewStatus(true);
      setPreviewImage(target);
    },
    []
  );

  useEffect(() => {
    if (dataSource.items) {
      setData(dataSource.items);
    }
  }, [dataSource.items]);

  useEffect(() => {
    get(clear);
  }, [get, clear]);

  function clear() {
    setSelectedItem({});
  }

  const columns = [
    {
      title: I18n.t('vap.face.faceSearch.image'),
      dataIndex: 'info.avatar',
      render: text => (
        <CardMedia
          onClick={handlePreview(addBase64Prefix(text))}
          style={{ height: 40, width: 40 }}
          image={addBase64Prefix(text)}
        />
      ),
      noTooltip: true,
      width: 50
    },
    // {
    //   title: I18n.t('vap.face.specialWatchList.startFrom'),
    //   dataIndex: 'id'
    // },
    {
      title: I18n.t('vap.face.faceEnrollment.confidenceScore'),
      dataIndex: 'confidenceThreshold'
    }
    // {
    //   title: I18n.t('vap.face.faceSearch.referenceNo'),
    //   dataIndex: 'id'
    // }
  ];

  function handleItemSelect(item) {
    const { id } = item;
    const { checked } = event.target;
    setData(dataSource => {
      setSelectedItem(checked ? item : {});
      return dataSource.map(item => {
        if (item.id === id) {
          return {
            ...item,
            checked
          };
        }
        return item;
      });
    });
  }

  const rowSelection = {
    onChange: handleItemSelect
  };

  function previewClose() {
    setPreviewStatus(false);
  }

  function handleDelete() {
    onDelete(selectedItem);
  }
  return (
    <>
      <FaceDialog
        open
        isActionNeed={false}
        dialogWidth={classes.wrapper}
        handleClose={handleClose}
        title={
          <div className={classes.title}>
            <span>{I18n.t('vap.face.specialWatchList.specialWatchList')}</span>
            {!_.isEmpty(selectedItem) && !_.isEmpty(data) && (
              <IconButton size="small" onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        }
      >
        <IVHTable
          keyId="id"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          tableMaxHeight="calc(100% - 56px)"
        />
        <Pagination
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
          count={dataSource.totalCount || 0}
          page={pageNo}
          rowsPerPage={pageSize}
        />
      </FaceDialog>
      <PreviewImage open={previewStatus} onClose={previewClose} image={previewImage} />
    </>
  );
}

ViewEnrolledPersonsBySpecialWatch.defaultProps = {
  dataSource: {},
  onChangeRowsPerPage: () => {},
  onChangePage: () => {},
  pageSize: () => {},
  pageNo: () => {},
  handleClose: () => {},
  onDelete: () => {}
};

export default ViewEnrolledPersonsBySpecialWatch;
