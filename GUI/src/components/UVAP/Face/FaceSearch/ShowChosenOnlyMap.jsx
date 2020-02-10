import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import PropTypes from 'prop-types';
import { MapRoutes } from 'components/common/Map';
import { handleEventDataToShowInMap } from './utils';

function ShowChosenOnlyMap(props) {
  const { onClose, open, dataSource } = props;
  function handleClose() {
    onClose();
  }

  return (
    <Drawer open={open} onClose={handleClose} anchor="right" variant="temporary">
      <div style={{ width: '50vw', height: '100%' }}>
        <MapRoutes routes={handleEventDataToShowInMap(dataSource)} keyId="address" />
      </div>
    </Drawer>
  );
}

ShowChosenOnlyMap.defaultProps = {
  open: false,
  onClose: () => {}
};

ShowChosenOnlyMap.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};

export default ShowChosenOnlyMap;
