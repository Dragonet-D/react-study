import React, { useEffect, useState } from 'react';
import { IVHTable } from 'components/common';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { I18n } from 'react-i18nify';
import { connect } from 'dva';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';

function HandleItems({ item, getData }) {
  const [anchorEl, setAnchorEl] = useState(null);
  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }
  const handleClose = e => () => {
    setAnchorEl(null);
    getData(e, item);
  };
  return (
    <>
      <IconButton size="small" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={handleClose('edit')}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary={I18n.t('vap.face.faceEnrollment.edit')} />
        </MenuItem>
        <MenuItem onClick={handleClose('delete')}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary={I18n.t('vap.face.faceEnrollment.delete')} />
        </MenuItem>
      </Menu>
    </>
  );
}

function GroupList(props) {
  const moduleName = 'faceEnrollment';
  const { dispatch, faceEnrollment, handleGroupInfo } = props;
  const { groupsDataTable } = faceEnrollment;

  useEffect(() => {
    dispatch({
      type: `${moduleName}/getFrsGroupsTable`,
      payload: ''
    });
  }, [dispatch]);

  const handleClose = (e, item) => {
    handleGroupInfo(e, item);
  };

  const columns = [
    {
      title: I18n.t('vap.face.faceEnrollment.groupName'),
      dataIndex: 'name',
      width: 120
    },
    {
      title: I18n.t('vap.face.faceEnrollment.triggerAlarm'),
      dataIndex: 'notificationEnabled',
      render: value => value.toString(),
      width: 60
    }
  ];
  const ExtraCell = item => <HandleItems item={item} getData={handleClose} />;

  const extraCell = {
    columns: [
      {
        title: I18n.t('vap.face.faceEnrollment.action'),
        dataIndex: '',
        width: 50
      }
    ],
    components: [
      {
        component: ExtraCell,
        key: '12',
        width: 50
      }
    ]
  };
  return (
    <IVHTable
      columns={columns}
      dataSource={groupsDataTable}
      keyId="id"
      extraCell={extraCell}
      tableMaxHeight="328px"
    />
  );
}

GroupList.defaultProps = {
  handleGroupInfo: () => {}
};

GroupList.propTypes = {
  handleGroupInfo: PropTypes.func
};

export default connect(({ faceEnrollment }) => ({
  faceEnrollment
}))(GroupList);
