import React from 'react';
import { connect } from 'dva';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import { ChannelGroupTreeBox, ChannelGroupDetailsBox, NullPage } from 'components/VMS/ChannelGroup';

const useStyles = makeStyles(() => {
  return {
    pageContainer: {
      height: 'calc(100% - 47px)',
      width: '100%',
      display: 'flex',
      borderRadius: '4px',
      marginTop: '6px'
    }
  };
});

function ChannelGroup(props) {
  const classes = useStyles();
  const { dispatch, global, VMSChannelGroup } = props;
  const { userId } = global;
  const moduleName = VMSChannelGroup.namespace;
  const { groupDetails, addPageStatus } = VMSChannelGroup;

  function handleAddPageStatus(status) {
    dispatch({
      type: `${moduleName}/changeAddPageStatus`,
      payload: {
        userId,
        status
      }
    });
  }
  function handleClearDetails() {
    dispatch({
      type: `${moduleName}/clearDetails`,
      payload: {}
    });
  }
  return (
    <div className={classes.pageContainer} id="pageContainer">
      <ChannelGroupTreeBox handleAddPageStatus={handleAddPageStatus} />
      {_.isEmpty(groupDetails) && !addPageStatus ? (
        <NullPage />
      ) : (
        <ChannelGroupDetailsBox
          handleAddPageStatus={handleAddPageStatus}
          handleClearDetails={handleClearDetails}
        />
      )}
    </div>
  );
}

export default connect(({ VMSChannelGroup, global }) => ({
  VMSChannelGroup,
  global
}))(ChannelGroup);
