import React from 'react';
import { makeStyles } from '@material-ui/core';
import LibraryAdd from '@material-ui/icons/LibraryAdd';
import { I18n } from 'react-i18nify';
import { ToolTip } from 'components/common';

const useStyles = makeStyles(theme => {
  return {
    button: {
      marginRight: theme.spacing(1)
    }
  };
});

function RequestAccessHeader(props) {
  const { openAddRequest } = props;
  const classes = useStyles();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        paddingLeft: '8px',
        paddingRight: '8px',
        height: '60px'
      }}
    >
      <div className={classes.button}>
        <ToolTip title={I18n.t('uvms.requestAccess.createDialog.titleRA')}>
          <LibraryAdd onClick={openAddRequest} />
        </ToolTip>
      </div>
      {/* <div>
        <TableToolbar
          handleGetDataByPage={obj => onClickSearch(obj)}
          fieldList={[
            ['ChannelName', 'channelName', 'iptType'],
            ['ParentDevice', 'parentDevice', 'iptType']
          ]}
        />
      </div> */}
    </div>
  );
}

export default RequestAccessHeader;
