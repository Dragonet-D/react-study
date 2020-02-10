import { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';
import { urls } from 'commons/map/setting';

const MapDrawing = props => {
  const { map, view, graphics } = props;
  const [drawGraphics, setDrawGraphics] = useState(null);

  useEffect(() => {
    loadModules(['esri/Graphic', 'esri/layers/GraphicsLayer'], { url: urls.module.current.js })
      .then(([Graphic, GraphicsLayer]) => {
        const point = {
          type: graphics.geometry.type,
          longitude: graphics.geometry.longitude,
          latitude: graphics.geometry.latitude
        };
        const markerSymbol = {
          type: 'picture-marker',
          url: graphics.symbol.image,
          width: graphics.symbol.width,
          height: graphics.symbol.height
        };
        const $graphics = new Graphic({
          geometry: point,
          symbol: markerSymbol
        });
        view.graphics.add($graphics);
        setDrawGraphics($graphics);

        // go to map
        const graphicsLayer = new GraphicsLayer({
          id: 'drawingGraphicsLayer'
        });

        map.add(graphicsLayer);
        graphicsLayer.when(() => {
          view.goTo(
            {
              target: $graphics
            },
            {
              duration: 2000,
              easing: 'in-expo'
            }
          );
        });
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Map Grahpics:', error.message, 'error:', error);
      });

    return function cleanup() {
      view.ui.remove(drawGraphics);
      const graphicsLayer = map.findLayerById('drawingGraphicsLayer');
      map.remove(graphicsLayer);
    };
  }, []);

  return null;
};

export default MapDrawing;
