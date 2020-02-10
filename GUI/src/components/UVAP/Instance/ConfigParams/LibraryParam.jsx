import React from 'react';
import { I18n } from 'react-i18nify';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { SingleSelect } from 'components/common';
import { handleFrsGroupList } from 'components/UVAP/Instance/util';

function LibraryParam(props) {
  const { frsGroups, getFrsGroups, handleSetData, value, appId, required } = props;

  // frsGroups
  const [frsGroupsList, setFrsGroupsList] = React.useState([]);
  const [selectedGroup, setSelectedGroup] = React.useState([]);

  React.useEffect(() => {
    if (value && value.length > 0 && !_.isEqual(value, selectedGroup)) {
      setSelectedGroup(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    if (selectedGroup.length > 0) handleSetData(selectedGroup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup]);

  React.useEffect(() => {
    setFrsGroupsList(handleFrsGroupList(frsGroups, appId) || []);
  }, [appId, frsGroups]);

  React.useEffect(() => {
    getFrsGroups();
  }, [getFrsGroups]);

  return (
    <SingleSelect
      label={I18n.t('vap.dialog.instance.common.assignLibrary')}
      selectOptions={frsGroupsList}
      keyValue
      dataIndex={{ name: 'name', key: 'id', value: 'libraryId' }}
      onSelect={setSelectedGroup}
      value={selectedGroup}
      fullWidth
      required={required}
    />
  );
}

LibraryParam.defaultProps = {
  getFrsGroups: () => {},
  frsGroups: [],
  handleSetData: () => {},
  value: '[]',
  appId: '',
  required: false
};

LibraryParam.propTypes = {
  getFrsGroups: PropTypes.func,
  frsGroups: PropTypes.array,
  handleSetData: PropTypes.func,
  value: PropTypes.string,
  appId: PropTypes.string,
  required: PropTypes.bool
};

export default LibraryParam;
