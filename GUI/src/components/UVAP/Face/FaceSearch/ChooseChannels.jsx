import React, { useCallback } from 'react';
import Drawer from '@material-ui/core/Drawer';
import PropTypes from 'prop-types';
import { MapSketch } from 'components/common';
import tools from 'commons/map/utils';
// import { channelData } from './test';
import FaceChannel from './FaceChannel';

function ChooseChannels(props) {
  const { open, onClose, getChannelGroup, getChannel, searchChannnel } = props;
  const [expandTarget, setExpandTarget] = React.useState([]);
  const [channelData, setChannelData] = React.useState([]);
  const [channelSelected, setChannelSelected] = React.useState([]);
  const handleClose = useCallback(() => {
    onClose(false);
  }, [onClose]);

  React.useEffect(() => {
    searchChannnel({
      pageNo: 0,
      pageSize: 99999
    }).then(res => {
      if (res) {
        const items = tools.dataTools.filterTreeNode(res.items);
        items.map(x => {
          // x.groupId = JSON.stringify(x.groupId);
          x.groupId = x.groupId.join(',');
          x.groupName = x.groupName.join(',');
          if (x.nodes) {
            x.nodes.forEach(e => {
              e.groupId = e.groupId.join(',');
              e.groupName = e.groupName.join(',');
            });
          }
          // x.groupName = JSON.stringify(x.groupName);
          return x;
        });
        setChannelData(items);
      }
    });
  }, []);

  return (
    <>
      <Drawer open={open} anchor="right" keepMounted onClose={handleClose}>
        <div style={{ width: '50vw', height: '100%', position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: 30,
              left: 58,
              width: 220,
              height: '35%',
              zIndex: 9999,
              backgroundColor: 'red',
              borderRadius: '4px'
            }}
            hidden
          >
            <FaceChannel
              getChannelGroup={getChannelGroup}
              getChannel={getChannel}
              expandTarget={expandTarget}
              onSelectCams={items => {
                console.log(items);
                const hl = items.map(x => {
                  return { channelId: x.channelId };
                });
                setChannelSelected(hl);
              }}
            />
          </div>
          <MapSketch
            channelData={channelData}
            getMapInformation={e => {
              const targetArr = [];
              e.forEach(x => {
                if (x.groupId) {
                  targetArr.push(x.groupId);
                }
              });
              setExpandTarget(targetArr);
            }}
            channelSelected={channelSelected}
          />
        </div>
      </Drawer>
    </>
  );
}

ChooseChannels.defaultProps = {
  open: false,
  onClose: () => {}
  // channelData: []
};

ChooseChannels.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
  // channelData: PropTypes.array
};

export default ChooseChannels;
