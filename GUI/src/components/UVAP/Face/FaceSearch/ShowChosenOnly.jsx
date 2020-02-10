import React, { useCallback, useState, useEffect } from 'react';
import Drawer from '@material-ui/core/Drawer';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { IVHTable } from 'components/common';
import { I18n } from 'react-i18nify';
import IconButton from '@material-ui/core/IconButton';
import LocationIcon from '@material-ui/icons/LocationOn';
import CloseIcon from '@material-ui/icons/Close';
import { dataFormatForEventsList } from './utils';

function ShowChosenOnly(props) {
  const { onClose, open, dataSource, chosenShowInMap } = props;

  const [data, setData] = useState([]);

  useEffect(() => {
    setData(dataFormatForEventsList(dataSource));
  }, [dataSource]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleShowInMap = useCallback(() => {
    chosenShowInMap();
  }, [chosenShowInMap]);

  const handleSortChange = obj => {
    const data = _.get(obj, 'data.dataIndex', '');
    switch (data) {
      case '_confidenceScore':
        setData(_.orderBy(dataFormatForEventsList(dataSource), ['_confidenceScore'], [obj.sort]));
        break;
      case '_eventTime':
        setData(_.orderBy(dataFormatForEventsList(dataSource), ['time'], [obj.sort]));
        break;
      case '_eventType':
        setData(_.orderBy(dataFormatForEventsList(dataSource), ['type'], [obj.sort]));
        break;
      case '_channels':
        setData(_.orderBy(dataFormatForEventsList(dataSource), ['_channels'], [obj.sort]));
        break;
      case '_vaEngine':
        setData(_.orderBy(dataFormatForEventsList(dataSource), ['_vaEngine'], [obj.sort]));
        break;
      case '_group':
        setData(_.orderBy(dataFormatForEventsList(dataSource), ['_group'], [obj.sort]));
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      title: I18n.t('vap.face.faceEnrollment.confidenceScore'),
      dataIndex: '_confidenceScore',
      sorter: {
        order: 'desc',
        active: true
      }
    },
    {
      title: I18n.t('vap.face.faceSearch.eventTime'),
      dataIndex: '_eventTime',
      sorter: {
        order: 'desc',
        active: false
      }
    },
    {
      title: I18n.t('vap.face.faceSearch.eventType'),
      dataIndex: '_eventType',
      sorter: {
        order: 'desc',
        active: false
      }
    },
    {
      title: I18n.t('vap.face.faceSearch.channels'),
      dataIndex: '_channels',
      sorter: {
        order: 'desc',
        active: false
      }
    },
    {
      title: I18n.t('vap.face.faceSearch.VAEngine'),
      dataIndex: '_vaEngine',
      sorter: {
        order: 'desc',
        active: false
      }
    },
    {
      title: I18n.t('vap.face.faceSearch.notificationGroup'),
      dataIndex: '_group',
      sorter: {
        order: 'desc',
        active: false
      }
    }
  ];
  return (
    <>
      <Drawer open={open} onClose={handleClose} variant="temporary">
        <div style={{ width: '50vw' }}>
          <div>
            <IconButton onClick={handleShowInMap}>
              <LocationIcon />
            </IconButton>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <IVHTable
            dataSource={data}
            keyId="_id"
            columns={columns}
            handleSortChange={handleSortChange}
          />
        </div>
      </Drawer>
    </>
  );
}

ShowChosenOnly.defaultProps = {
  open: false,
  onClose: () => {},
  chosenShowInMap: () => {}
};

ShowChosenOnly.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  chosenShowInMap: PropTypes.func
};

export default ShowChosenOnly;
