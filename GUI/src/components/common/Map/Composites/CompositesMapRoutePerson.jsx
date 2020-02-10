import { useEffect } from 'react';
import { loadModules } from 'esri-loader';
import { urls } from 'commons/map/setting';
import tools from 'commons/map/utils';

const modulesUri = ['esri/Graphic', 'esri/layers/GraphicsLayer'];

const MapRoutePerson = props => {
  const { map, view, routes, keyId } = props;
  useEffect(() => {
    loadModules([...modulesUri], { url: urls.module.current.js })
      .then(([Graphic, GraphicsLayer]) => {
        // go to map
        const graphicsLayer = new GraphicsLayer({
          id: 'routeGraphicsLayer'
        });
        map.add(graphicsLayer);
        graphicsLayer.when(() => {
          view.goTo(
            {
              center: [103.811346, 1.336091]
            },
            {
              duration: 2000,
              easing: 'in-expo'
            }
          );
        });

        let graphics = [];
        routes.forEach(temp => {
          const result = tools.mapTools.getPersonalRoute({ Graphic }, temp, keyId);
          graphics = graphics.concat(result);
        });

        view.graphics.addMany([...graphics]);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Map Route:', error.message, 'error:', error);
      });

    return function cleanup() {
      view.graphics.removeAll();
    };
  }, [keyId, routes, view.graphics]);

  return null;
};

export default MapRoutePerson;
