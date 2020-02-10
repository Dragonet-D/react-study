import React from 'react';
import Typography from '@material-ui/core/Typography';
import { I18n } from 'react-i18nify';
import styles from './CompareResult.module.less';

function CompareResult({ compareResultData }) {
  return (
    <div className={styles.wrapper}>
      {compareResultData.confidence !== undefined && (
        <>
          <Typography component="span" color="textSecondary" className={styles.result}>
            {I18n.t('vap.face.faceCompare.compareResult')}
          </Typography>
          <Typography component="span" color="textPrimary" className={styles.result}>
            {`confidence: ${compareResultData.confidence}`}
          </Typography>
        </>
      )}
    </div>
  );
}

export default CompareResult;
