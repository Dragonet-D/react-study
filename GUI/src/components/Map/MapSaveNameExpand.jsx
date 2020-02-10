import { useState, useEffect, useContext } from 'react';
import { loadModules } from 'esri-loader';
import Context from 'utils/createContext';
import { urls } from 'commons/map/setting';

const MapSaveNameExpand = props => {
  const { view } = props;
  const {
    contextMenu: { aoi }
  } = useContext(Context);
  const { setAOIExpandInstance } = aoi;
  const [saveNameExpand, setsaveNameExpand] = useState(null);

  useEffect(() => {
    loadModules(['esri/widgets/Expand'], {
      url: urls.module.current.js
    })
      .then(([Expand]) => {
        const expand = new Expand({
          view,
          expandIconClass: 'esri-icon-sketch-rectangle',
          expandTooltip: 'Expand AOI Panel',
          expanded: false,
          content: document.getElementById('saveNamePopUp')
        });

        view.ui.add(expand, { position: 'top-right', index: 1 });
        setsaveNameExpand(expand);
        setAOIExpandInstance(expand);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Alarm List Expand:', error.message, 'error:', error);
      });

    return function cleaup() {
      view.ui.remove(saveNameExpand);
    };
  }, []);

  return null;
};

export default MapSaveNameExpand;
