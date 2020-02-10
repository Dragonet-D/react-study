import React, { memo, useState, useEffect } from 'react';
import { IVHTable, Pagination, Button, PreviewImage } from 'components/common';
import Typography from '@material-ui/core/Typography';
import { I18n } from 'react-i18nify';
import _ from 'lodash';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CardMedia from '@material-ui/core/CardMedia';
import { dataFormatForEventsList, handleCheckedItem } from './utils';

const useStyles = makeStyles(theme => {
  return {
    title_wrapper: {
      display: 'flex',
      alignItems: 'center',
      padding: `0 8px`
    },
    handle_wrapper: {
      marginLeft: 'auto'
    },
    media_image: {
      height: theme.spacing(5),
      width: theme.spacing(5)
    },
    show_chosen: {
      marginRight: theme.spacing(1)
    }
  };
});

const SearchResult = memo(props => {
  const classes = useStyles();
  const {
    handleChosenOnlyShow,
    eventsDataList,
    getChosenData,
    onChangeRowsPerPage,
    onChangePage,
    pageSize,
    pageNo,
    handleExport
  } = props;

  const [dataSource, setDataSource] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewStatus, setPreviewStatus] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (eventsDataList.items) {
      setDataSource(dataFormatForEventsList(eventsDataList.items));
    } else {
      setDataSource([]);
    }
  }, [eventsDataList]);

  const onChosenOnlyShow = () => {
    handleChosenOnlyShow(true);
    getChosenData(selectedItems);
  };

  const handleChooseAll = e => {
    const { checked } = e.target;
    setDataSource(prevData => {
      const data = prevData.map(item => ({ ...item, checked }));
      setSelectedItems(checked ? data : []);
      return data;
    });
  };

  const columns = [
    {
      title: I18n.t('vap.face.faceEnrollment.confidenceScore'),
      dataIndex: '_confidenceScore',
      width: 70,
      sorter: {
        order: 'desc',
        active: false
      }
    },
    {
      title: I18n.t('vap.face.faceSearch.eventTime'),
      dataIndex: '_eventTime',
      width: 70
    },
    {
      title: I18n.t('vap.face.faceSearch.eventType'),
      dataIndex: '_eventType',
      width: 50
    },
    {
      title: I18n.t('vap.face.faceSearch.channels'),
      dataIndex: '_channels',
      width: 70
    },
    {
      title: I18n.t('vap.face.faceSearch.VAEngine'),
      dataIndex: '_vaEngine',
      width: 80
    },
    {
      title: I18n.t('vap.face.faceSearch.notificationGroup'),
      dataIndex: '_group',
      width: 120
    }
  ];
  function itemSelected(item, event) {
    const { checked } = event.target;
    const { key } = item;
    setDataSource(prevData => {
      const data = handleCheckedItem(prevData, key, checked, 'key');
      setSelectedItems(data.filter(item => item.checked));
      return data;
    });
  }
  const rowSelection = {
    onChange: itemSelected
  };
  const handlePreview = image => () => {
    setPreviewStatus(true);
    setPreviewImage(image);
  };
  const ExtraCellPrev = item => {
    return (
      <CardMedia
        onClick={handlePreview(item._image)}
        className={classes.media_image}
        image={item._image}
      />
    );
  };
  const extraCellPrev = {
    columns: [
      {
        title: I18n.t('vap.face.faceSearch.image'),
        dataIndex: '_image',
        key: '11',
        width: 40
      }
    ],
    components: [
      {
        component: ExtraCellPrev,
        key: '11',
        width: 40
      }
    ]
  };

  function previewClose() {
    setPreviewStatus(false);
  }

  function handleSortChange(e) {
    const data = _.get(e, 'data.dataIndex', '');
    if (data === '_confidenceScore') {
      setDataSource(prev => {
        const data = _.cloneDeep(prev);
        return _.orderBy(data, ['_confidenceScore'], [e.sort]);
      });
    }
  }
  return (
    <>
      <Typography
        color="textSecondary"
        component="div"
        gutterBottom
        className={classes.title_wrapper}
      >
        <span>{I18n.t('vap.face.faceSearch.searchResult')}</span>
        <div className={classes.handle_wrapper}>
          {selectedItems.length > 0 && (
            <Button
              size="small"
              color="secondary"
              variant="contained"
              onClick={onChosenOnlyShow}
              className={classes.show_chosen}
            >
              {I18n.t('vap.face.faceSearch.showChosenOnly')}
            </Button>
          )}
          <IconButton onClick={handleExport}>
            <SaveAltIcon />
          </IconButton>
        </div>
      </Typography>
      <IVHTable
        extraCellPrev={extraCellPrev}
        rowSelection={rowSelection}
        dataSource={dataSource}
        keyId="_id"
        columns={columns}
        handleChooseAll={handleChooseAll}
        handleSortChange={handleSortChange}
      />
      <Pagination
        count={eventsDataList.totalNum || 0}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        page={pageNo}
        rowsPerPage={pageSize}
      />
      <PreviewImage open={previewStatus} onClose={previewClose} image={previewImage} />
    </>
  );
});

SearchResult.defaultProps = {
  handleChosenOnlyShow: () => {},
  eventsDataList: {},
  getChosenData: () => {},
  onChangeRowsPerPage: () => {},
  onChangePage: () => {},
  pageSize: 5,
  pageNo: 0,
  handleExport: () => {}
};

SearchResult.propTypes = {
  handleChosenOnlyShow: PropTypes.func,
  eventsDataList: PropTypes.object,
  getChosenData: PropTypes.func,
  onChangeRowsPerPage: PropTypes.func,
  onChangePage: PropTypes.func,
  pageSize: PropTypes.number,
  pageNo: PropTypes.number,
  handleExport: PropTypes.func
};

export default SearchResult;
