import React from 'react';
import { I18n } from 'react-i18nify';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { MultipleSelect } from 'components/common';
import { handleFrsGroupList } from 'components/UVAP/Instance/util';

function MultipleLibraryParam(props) {
  const { frsGroups, getFrsGroups, handleSetData, value, appId, required } = props;

  // frsGroups
  const [frsGroupsList, setFrsGroupsList] = React.useState([]);
  const [groupNamesList, setGroupNamesList] = React.useState([]);

  const libraryIds = React.useMemo(() => groupNamesList, [groupNamesList]);

  const handleLibraryIds = React.useCallback(() => {
    handleSetData(JSON.stringify(libraryIds.map(id => id)));
  }, [handleSetData, libraryIds]);

  React.useEffect(() => {
    const newList = JSON.parse(value);
    if (value && value.length > 0 && !_.isEqual(newList, groupNamesList)) {
      setGroupNamesList(newList.map(id => _.toString(id)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    if (groupNamesList.length > 0) handleLibraryIds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupNamesList]);

  React.useEffect(() => {
    setFrsGroupsList(handleFrsGroupList(frsGroups, appId) || []);
  }, [appId, frsGroups]);

  React.useEffect(() => {
    getFrsGroups();
  }, [getFrsGroups]);

  return (
    <MultipleSelect
      label={I18n.t('vap.dialog.instance.common.assignLibrary')}
      value={groupNamesList}
      selectOptions={frsGroupsList}
      onSelect={setGroupNamesList}
      keyValue
      dataIndex={{ name: 'name', key: 'id', value: 'libraryId' }}
      required={required}
    />
  );
}

MultipleLibraryParam.defaultProps = {
  getFrsGroups: () => {},
  frsGroups: [],
  handleSetData: () => {},
  value: '[]',
  appId: '',
  required: false
};

MultipleLibraryParam.propTypes = {
  getFrsGroups: PropTypes.func,
  frsGroups: PropTypes.array,
  handleSetData: PropTypes.func,
  value: PropTypes.string,
  appId: PropTypes.string,
  required: PropTypes.bool
};

export default MultipleLibraryParam;
