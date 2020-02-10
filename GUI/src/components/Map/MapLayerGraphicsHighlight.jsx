import { useEffect } from 'react';
import { loadModules } from 'esri-loader';
import { urls, layerId } from 'commons/map/setting';

const modulesUri = ['esri/layers/GraphicsLayer'];

export default function MapLayerGraphicsHighlight(props) {
  const { map } = props;

  useEffect(() => {
    loadModules(modulesUri, { url: urls.module.current.js }).then(([GraphicsLayer]) => {
      const graphicsLayerNew = new GraphicsLayer({
        id: layerId.graphicHighlight
      });
      map.add(graphicsLayerNew);
    });

    return function clearup() {
      const gLayer = map.findLayerById(layerId.graphicHighlight);
      map.remove(gLayer);
    };
  });
  return null;
}
