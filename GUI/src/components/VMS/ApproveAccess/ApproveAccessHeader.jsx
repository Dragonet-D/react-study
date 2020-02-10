import React from 'react';
import { TableToolbar } from 'components/common';

function ApproveAccessHeader(props) {
  const { onClickSearch } = props;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: '8px',

        paddingRight: '8px'
      }}
    >
      <div>
        <TableToolbar
          handleGetDataByPage={obj => onClickSearch(obj)}
          fieldList={[
            ['RequestID', 'requestId', 'iptType'],
            ['RequestorGroup', 'requestorGroupname', 'iptType'],
            ['RequestBy', 'requestBy', 'iptType'],
            ['RequestStatus', 'requestStatus', 'dropdownType'],
            ['RequestReason', 'requestComments', 'iptType'],
            ['ActionBy', 'lastUpdatedId', 'iptType']
          ]}
          dataList={{
            RequestStatus: {
              data: [['P', 'Pending'], ['A', 'Approved'], ['R', 'Revoked'], ['J', 'Rejected']],
              type: 'keyVal',
              id: 0,
              val: 1
            }
          }}
        />
      </div>
    </div>
  );
}

export default ApproveAccessHeader;
