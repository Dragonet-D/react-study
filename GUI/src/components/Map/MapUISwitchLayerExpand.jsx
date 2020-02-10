import { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';
import { urls } from 'commons/map/setting';

const MapUISwitchLayerExpand = props => {
  const [switchLayerExpand, setSwitchLayerExpand] = useState();
  useEffect(() => {
    loadModules(['esri/widgets/Expand'], { url: urls.module.current.js })
      .then(([Expand]) => {
        const expand = new Expand({
          view: props.view,
          expandIconClass: 'esri-icon-drag-horizontal',
          expandTooltip: 'Expand Layer Switch',
          expanded: false,
          content: document.getElementById('layerToggle')
        });

        props.view.ui.add(expand, { position: 'top-right', index: 0 });
        setSwitchLayerExpand(expand);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Switch Layer Expand:', error.message, 'error:', error);
      });

    return function cleanup() {
      props.view.ui.remove(switchLayerExpand);
    };
  }, []);
  return null;
};

export default MapUISwitchLayerExpand;
