import React from 'react';
import { I18n } from 'react-i18nify';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'dva';
import { ScrollBar } from 'components/common';
import Collapse from '@material-ui/core/Collapse';
import GroupSearch from './GroupSearch';
import UsersList from './GroupManagemnt/UsersList';
import GroupControl from './GroupControl';

const useStyles = makeStyles(theme => {
  return {
    wrapper: {
      padding: `0 ${theme.spacing(1)}px`,
      height: props => (props.searchMode === 'group' ? 'calc(100% - 40px)' : 'calc(100% - 113px)'),
      maxHeight: props =>
        props.searchMode === 'group' ? 'calc(100% - 40px)' : 'calc(100% - 113px)'
    },
    title: {
      paddingBottom: theme.spacing(1),
      color: theme.palette.text.secondary,
      display: 'none'
    },
    group_wrapper: {
      display: 'flex',
      height: 'calc(100% - 2px)'
    },
    group: {
      width: '260px',
      borderBottom: 'none'
    },
    group_info: {
      flex: 1,
      marginLeft: props => (props.searchMode === 'group' ? theme.spacing(2) : 0),
      paddingLeft: props => (props.searchMode === 'group' ? theme.spacing(1) : 0),
      borderBottom: 'none'
    },
    control_wrapper: {
      display: 'flex',
      alignItems: 'center'
    },
    delete_wrapper: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    delete_btn: {
      width: theme.spacing(6),
      height: theme.spacing(6)
    }
  };
});

function PersonListing(props) {
  const { onEdit, allTheAppsData, searchMode, faceEnrollment } = props;
  const classes = useStyles(props);
  const { choseGroupData } = faceEnrollment;
  const isGroupChosen = !_.isEmpty(choseGroupData);

  return (
    <section className={classes.wrapper}>
      <Typography component="h5" className={classes.title}>
        {I18n.t('vap.face.faceEnrollment.personListing')}
      </Typography>
      <div className={classes.group_wrapper}>
        {searchMode === 'group' && (
          <div className={classes.group}>
            <GroupSearch />
          </div>
        )}
        <ScrollBar className={classes.group_info}>
          {searchMode === 'group' && (
            <Collapse in={isGroupChosen}>
              <Typography component="h5">{I18n.t('vap.face.faceEnrollment.groupInfo')}</Typography>
              <section className={classes.control_wrapper}>
                <GroupControl allTheAppsData={allTheAppsData} dataSource={choseGroupData} />
              </section>
            </Collapse>
          )}
          <UsersList searchMode={searchMode} onEdit={item => onEdit(item)} />
        </ScrollBar>
      </div>
    </section>
  );
}

PersonListing.defaultProps = {
  onEdit: () => {}
};

PersonListing.propTypes = {
  onEdit: PropTypes.func
};

export default connect(({ faceEnrollment }) => ({ faceEnrollment }))(PersonListing);
