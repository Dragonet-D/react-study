import React, { useCallback, useState } from 'react';
import { SingleSelect, Button } from 'components/common';
import { I18n } from 'react-i18nify';
import C from 'classnames';
import PropTypes from 'prop-types';
import CompareList from './CompareList';
import { getGroupIdByName } from '../utils';
import styles from './CompareSearchControl.module.less';

function CompareSearchControl(props) {
  const { allTheAppsData, getCompareData } = props;
  const [vaEngine, setVaEngine] = useState('');
  const [imageData, setImageData] = useState({});

  const isDisabled = !(vaEngine && imageData.one && imageData.two);

  const handleVaEngine = useCallback(e => {
    setVaEngine(e);
  }, []);

  const getImageData = useCallback(e => {
    setImageData(e);
  }, []);

  const handleCompare = () => {
    if (!isDisabled) {
      getCompareData({ vaEngine: getGroupIdByName(allTheAppsData, vaEngine), ...imageData });
    }
  };
  return (
    <>
      <CompareList getImageData={getImageData} />
      <div className={C(styles.wrapper)}>
        <SingleSelect
          className={C(styles.engine)}
          label={I18n.t('vap.face.faceSearch.VAEngine')}
          onSelect={handleVaEngine}
          value={vaEngine}
          selectOptions={allTheAppsData
            .filter(item => item.labels && item.labels.includes('FRS'))
            .map(item => item.name)}
        />
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={handleCompare}
          disabled={isDisabled}
        >
          {I18n.t('vap.button.compare')}
        </Button>
      </div>
    </>
  );
}

CompareSearchControl.propTypes = {
  getCompareData: PropTypes.func.isRequired
};

export default CompareSearchControl;
