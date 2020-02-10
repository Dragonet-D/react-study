import React from 'react';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import { I18n } from 'react-i18nify';
import Typography from '@material-ui/core/Typography';
import { IVHTable, ToolTip } from 'components/common';
import moment from 'moment';
import { DATE_FORMAT_DATE_PICKER } from 'commons/constants/const';

const useStyles = makeStyles(() => {
  return {
    button: {
      marginLeft: '4px'
    },
    wrapper: {
      position: 'relative'
    },
    input: {
      marginLeft: 8,
      flex: 1
    },
    iconButton: {
      padding: 2
    },
    divider: {
      width: 1,
      height: 18,
      margin: 4
    },
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      marginBottom: 10
    }
  };
});

function DrawerRender(props) {
  const { videoInfo, deleteBookmark, renderCN, renderId, seek } = props;
  const [searchstr, setsearchstr] = React.useState('');
  const [renderList, setrenderList] = React.useState([]);
  const classes = useStyles();

  React.useEffect(() => {
    if (videoInfo[`player${renderId}`]) {
      setrenderList(videoInfo[`player${renderId}`].bookmark);
    }
  });

  const columns = [
    {
      title: I18n.t('uvms.playback.drawerRender.bookmarkComments'),
      dataIndex: 'bookmarkComments'
    },
    {
      title: I18n.t('uvms.playback.drawerRender.bookmarkTimestamp'),
      dataIndex: 'bookmarkTimestamp',
      render: text => moment(new Date(text)).format(DATE_FORMAT_DATE_PICKER)
    }
  ];

  const ExtraCell = item => {
    // const { notificationMethod, defaultNotiMethod } = item;
    return (
      <>
        <ToolTip title={I18n.t('uvms.playback.drawerRender.deleteBookMark')}>
          <Delete
            onClick={() => {
              deleteBookmark(
                {
                  id: item.bookmarkUuid,
                  createdId: item.createdId,
                  channelName: renderCN,
                  name: item.bookmarkComments
                },
                renderId
              );
            }}
          />
        </ToolTip>

        <ToolTip title={I18n.t('uvms.playback.drawerRender.bookmarkSeek')}>
          <RemoveRedEye
            onClick={() => {
              seek(item.bookmarkTimestamp);
            }}
          />
        </ToolTip>
      </>
    );
  };

  const extraCell = {
    columns: [
      {
        title: I18n.t('uvms.playback.drawerRender.operation'),
        dataIndex: ''
      }
    ],
    components: [
      {
        component: ExtraCell,
        key: '12'
      }
    ]
  };

  function searchBookmark(str) {
    const list = videoInfo[`player${renderId}`].bookmark;
    const filterArr = [];
    list.forEach(element => {
      if (element.bookmarkComments.includes(str)) {
        filterArr.push(element);
      }
    });
    setrenderList(filterArr);
  }

  return (
    <div>
      <div style={{ padding: '16px 24px' }}>
        <Typography color="textSecondary" component="h6" variant="h6">
          {I18n.t('uvms.playback.drawerRender.title')}
        </Typography>
      </div>

      <Paper className={classes.root} elevation={1}>
        <InputBase
          className={classes.input}
          placeholder={I18n.t('uvms.playback.drawerRender.placeholder')}
          value={searchstr}
          onChange={e => {
            setsearchstr(e.target.value);
          }}
        />
        <Divider className={classes.divider} />
        <IconButton
          color="primary"
          className={classes.iconButton}
          aria-label="Directions"
          onClick={() => {
            searchBookmark(searchstr.trim());
          }}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
      <IVHTable
        tableMaxHeight="calc(100% - 98px)"
        keyId="bookmarkUuid"
        columns={columns}
        dataSource={renderList || []}
        extraCell={extraCell}
      />
    </div>
  );
}

export default DrawerRender;
