import React from 'react';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Repeat from '@material-ui/icons/Repeat';
import ExitToApp from '@material-ui/icons/ExitToApp';
import { I18n } from 'react-i18nify';
import { makeStyles, Link } from '@material-ui/core';

import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import { IVHTable, Pagination, ToolTip } from 'components/common';

import PresetConfrim from './PresetConfrim';

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

function PtzPreset(props) {
  const {
    dataSource,
    getPtzPreset,
    setPTZpreset,
    delPTZpreset,
    itemSource,
    ptzControl,
    userId
  } = props;
  const [pageSize, setPageSize] = React.useState(PAGE_SIZE);
  const [pageNo, setPageNo] = React.useState(PAGE_NUMBER);
  const [formDataSource, setformDataSource] = React.useState(dataSource);
  const [searchstr, setsearchstr] = React.useState('');
  const [popConfirm, setpopConfirm] = React.useState(false);
  const classes = useStyles();

  React.useEffect(() => {
    getPtzPreset({
      psize: pageSize,
      pindex: pageNo,
      index: '',
      name: searchstr
    });
  }, []);

  React.useEffect(() => {
    getPtzPreset({
      psize: pageSize,
      pindex: pageNo,
      index: '',
      name: searchstr
    });
  }, [pageNo, pageSize]);

  React.useEffect(() => {
    setformDataSource(dataSource);
  }, [dataSource]);

  const columns = [
    {
      title: I18n.t('uvms.live.preset.presetName'),
      dataIndex: 'name',
      renderItem: item => (
        <Link
          onClick={() => {
            ptzControl({
              deviceId: itemSource.deviceId,
              channelId: itemSource.channelId,
              action: 'goto-preset',
              ptzInd: itemSource.ptzInd,
              userId,
              value: item.index
            });
          }}
        >
          {item.name}
        </Link>
      )
    }
  ];

  const ExtraCell = item => {
    // const { notificationMethod, defaultNotiMethod } = item;
    return (
      <>
        <ToolTip title="Set">
          <IconButton aria-label="Set" style={{ padding: 4 }} onClick={() => setpopConfirm(item)}>
            <ExitToApp />
          </IconButton>
        </ToolTip>

        <ToolTip title="Reset">
          <IconButton
            aria-label="Delete"
            style={{ padding: 4 }}
            onClick={() =>
              delPTZpreset({
                deviceId: itemSource.deviceId,
                channelId: itemSource.channelId,
                index: item.index,
                pageNo,
                pageSize
              })
            }
          >
            <Repeat />
          </IconButton>
        </ToolTip>
      </>
    );
  };

  const extraCell = {
    columns: [
      {
        title: I18n.t('uvms.live.preset.operation'),
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

  function onChangePage(e, page) {
    setPageNo(page);
  }

  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageSize(value);
  }

  return (
    <div>
      <Paper className={classes.root} elevation={1}>
        <InputBase
          className={classes.input}
          placeholder={I18n.t('uvms.live.preset.placeholder')}
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
            getPtzPreset({ psize: pageSize, pindex: pageNo, index: '', name: searchstr });
          }}
        >
          <SearchIcon />
        </IconButton>
      </Paper>

      <div>
        <IVHTable
          tableMaxHeight="calc(100% - 200px)"
          // handleChooseAll={handleChooseAll}
          // rowSelection={rowSelection}
          extraCell={extraCell}
          keyId="index"
          columns={columns}
          dataSource={formDataSource.items || []}
          style={{ width: '100%' }}
        />
        <Pagination
          page={pageNo}
          rowsPerPage={pageSize}
          count={parseInt(formDataSource.totalCount, 10) || 0}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
        />
        {popConfirm && (
          <PresetConfrim
            onClose={() => {
              setpopConfirm(false);
            }}
            setPTZpreset={setPTZpreset}
            item={popConfirm}
            itemSource={itemSource}
            pageNo={pageNo}
            pageSize={pageSize}
          />
        )}
      </div>
    </div>
  );
}

export default PtzPreset;
