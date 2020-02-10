import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { TableToolbar } from 'components/common';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => {
  return {
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      marginTop: theme.spacing(2)
    },
    vms_search: {
      flex: 1,
      marginRight: theme.spacing(1)
    }
  };
});

function AlarmConfigVmsSearch(props) {
  const classes = useStyles();
  const { selectOptions, onSearch } = props;

  function handleAlarmConfigSearch(obj) {
    onSearch(obj);
  }
  return (
    <div className={classes.wrapper}>
      <TableToolbar
        handleGetDataByPage={handleAlarmConfigSearch}
        fieldList={[
          ['ChannelName', 'channelName', 'iptType'],
          ['ParentDevice', 'parentDevice', 'iptType'],
          ['GroupName', 'groupName', 'iptType']
        ]}
        dataList={{
          'Select Model': {
            data: selectOptions.map(item => item.name),
            type: 'normal'
          }
        }}
      />
    </div>
  );
}

AlarmConfigVmsSearch.defaultProps = {
  selectOptions: []
};

AlarmConfigVmsSearch.propTypes = {
  selectOptions: PropTypes.array
};

export default AlarmConfigVmsSearch;
