import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { IconButton, Tooltip } from '@material-ui/core';
import { SaveAlt } from '@material-ui/icons';
import { I18n } from 'react-i18nify';

/**
 * @return {null}
 */
function Download(props) {
  const { handleExport, className, exportData, isIconNeeded } = props;

  const [exportDataState, setExportState] = useState(null);

  const getBlob = useCallback(base64 => {
    const contentType = 'application/octet-stream';
    return b64toBlob(getData(base64), contentType);
  }, []);

  const downloadFile = useCallback(
    (fileName, data) => {
      const content = `data:application/octet-stream;charset=utf-8;base64,${data}`;
      const blob = getBlob(content);
      window.navigator.msSaveBlob(blob, fileName);
    },
    [getBlob]
  );

  const exportCSV = useCallback(
    exportData => {
      const aTag = document.createElement('a');
      const browserType = checkBrowser();
      if (browserType === 'IE' || browserType === 'Edge') {
        aTag.href = '#';
        aTag.click();
        downloadFile(exportData.fileName, exportData);
      } else {
        const urlCreator = window.URL || window.webkitURL;
        const url = urlCreator.createObjectURL(exportData);
        aTag.download = exportData.fileName;
        aTag.href = url;
        aTag.click();
        window.URL.revokeObjectURL(url);
      }
    },
    [downloadFile]
  );

  useEffect(() => {
    if (!_.isEmpty(exportData) && !_.isEqual(exportDataState, exportData)) {
      exportCSV(exportData);
      setExportState(exportData);
    }
  }, [exportCSV, exportData, exportDataState]);

  function checkBrowser() {
    const { userAgent } = navigator;
    if (userAgent.indexOf('Trident') > -1) {
      return 'IE';
    } else if (userAgent.indexOf('Edge') > -1) {
      return 'Edge';
    } else {
      return 'Other';
    }
  }

  function getData(base64) {
    return base64.substr(base64.indexOf('base64,') + 7, base64.length);
  }

  function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }
  if (!isIconNeeded) {
    return null;
  }
  return (
    <Tooltip title={I18n.t('component.button.export')}>
      <IconButton onClick={() => handleExport()} className={className}>
        <SaveAlt />
      </IconButton>
    </Tooltip>
  );
}

Download.defaultProps = {
  exportData: null,
  handleExport: () => {},
  className: '',
  isIconNeeded: false
};
Download.propTypes = {
  handleExport: PropTypes.func,
  // eslint-disable-next-line react/no-unused-prop-types
  exportData: PropTypes.any,
  className: PropTypes.string,
  isIconNeeded: PropTypes.bool
};

export default Download;
