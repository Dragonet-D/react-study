/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { getAuthority } from 'utils/authority';

// const materialKeys = getAuthority();

const Permission = ({ materialKey, children }) => {
  if (getAuthority().includes(materialKey)) {
    return children;
  }

  return null;
};

Permission.propTypes = {
  materialKey: PropTypes.string
};

function isPermissionHas(materialKey) {
  return getAuthority().includes(materialKey);
}

export default Permission;
export { isPermissionHas };
