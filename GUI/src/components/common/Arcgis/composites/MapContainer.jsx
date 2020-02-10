/*
 * @Description: Map Container
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-06-03 14:26:09
 * @LastEditTime: 2019-08-14 15:28:16
 * @LastEditors: Kevin
 */

import React from 'react';
import PropTypes from 'prop-types';

export default class MapContainer extends React.Component {
  render() {
    const { id, style } = this.props;
    return <div id={id} style={style} />;
  }

  shouldComponentUpdate() {
    return false;
  }
}

MapContainer.defaultProps = {
  style: {}
};

MapContainer.propTypes = {
  id: PropTypes.string.isRequired,
  style: PropTypes.object
};
