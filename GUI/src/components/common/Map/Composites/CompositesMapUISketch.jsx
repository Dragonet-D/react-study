import { useEffect, useContext } from 'react';
import Context from 'utils/createContext';
import { loadModules } from 'esri-loader';
import { urls, layerId } from 'commons/map/setting';

const modulesUri = [
  'esri/widgets/Sketch',
  'esri/layers/GraphicsLayer',
  'esri/geometry/geometryEngine',
  'esri/geometry/support/webMercatorUtils'
];

const MapUILocation = props => {
  const { map, view, getMapInformation } = props;
  const { highlight } = useContext(Context);

  useEffect(() => {
    loadModules(modulesUri, { url: urls.module.current.js })
      .then(([Sketch, GraphicsLayer, geometryEngine, webMercatorUtils]) => {
        const myGraphicsLayer = new GraphicsLayer({
          id: layerId.graphic
        });

        map.add(myGraphicsLayer);
        myGraphicsLayer.when(() => {
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
        setTimeout(() => {
          setSketchWidget({ Sketch, geometryEngine, webMercatorUtils }, myGraphicsLayer);
        }, 3000);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Locate Widget:', error.message, 'error:', error);
      });

    return function cleanup() {
      const graphicsLayer = map.findLayerById(layerId.graphic);
      map.remove(graphicsLayer);
    };
  }, []);

  return null;

  function setSketchWidget(mapClass, myGraphicsLayer) {
    const { Sketch, geometryEngine, webMercatorUtils } = mapClass;
    const normalLayer = map.findLayerById(layerId.normal);
    if (!myGraphicsLayer) return;
    const sketch = new Sketch({
      layer: myGraphicsLayer,
      view,
      availableCreateTools: ['polygon', 'rectangle', 'circle']
    });
    view.ui.add(sketch, { position: 'top-right', index: 0 });

    if (!normalLayer) return;
    normalLayer.queryFeatures().then(result => {
      const channels = result.features;
      let completedChannels = [];
      let mapResult = [];
      sketch.on('create', event => {
        // Query IVH Camera Feature Layer
        if (event.state === 'complete') {
          const { geometry } = event.graphic;

          // IVH Camera
          channels.forEach(item => {
            let intersects = false;
            if (item.geometry) {
              const channelPoint = geometry.spatialReference.isWGS84
                ? webMercatorUtils.webMercatorToGeographic(item.geometry)
                : item.geometry;
              intersects = geometryEngine.intersects(channelPoint, geometry);
            } else {
              intersects = false;
            }
            if (intersects) {
              view.whenLayerView(normalLayer).then(layerView => {
                highlight.set([
                  {
                    OBJECTID: item.attributes.OBJECTID,
                    highlight: layerView.highlight(item)
                  }
                ]);
                mapResult.push(item.attributes);
                completedChannels.push(item.attributes);
              });
            }
          });

          if (getMapInformation) {
            getMapInformation(mapResult);
          }
        }
      });

      sketch.on('update', event => {
        const startingChannels = [...mapResult];
        const { geometry } = event.graphics[0];

        if (event.state === 'complete') {
          completedChannels = [];
          channels.forEach(item => {
            let intersects = false;
            if (item.geometry) {
              const channelPoint = geometry.spatialReference.isWGS84
                ? webMercatorUtils.webMercatorToGeographic(item.geometry)
                : item.geometry;
              intersects = geometryEngine.intersects(channelPoint, geometry);
            } else {
              intersects = false;
            }
            if (intersects) {
              completedChannels.push(item.attributes);
            }
          });

          const deletingChannels = startingChannels.filter(item => {
            return !completedChannels.some(temp => {
              if (item.OBJECTID === temp.OBJECTID) {
                return true;
              }
              return false;
            });
          });
          const addingChannels = completedChannels.filter(item => {
            return !startingChannels.some(temp => {
              if (item.OBJECTID === temp.OBJECTID) {
                return true;
              }
              return false;
            });
          });

          view.whenLayerView(normalLayer).then(layerView => {
            const highlightStore = highlight.getAll();

            // delete
            highlight.set(
              highlightStore.filter(temp => {
                return deletingChannels.some(item => {
                  if (item.OBJECTID === temp.OBJECTID) {
                    temp.highlight.remove();
                    return false;
                  }
                  return true;
                });
              })
            );

            const highlightChannels = channels.filter(channel => {
              return addingChannels.some(temp => {
                if (channel.attributes.OBJECTID === temp.OBJECTID) {
                  return true;
                }
                return false;
              });
            });

            // add
            highlight.set(
              highlightChannels.map(temp => {
                return {
                  OBJECTID: temp.attributes.OBJECTID,
                  highlight: layerView.highlight(temp)
                };
              })
            );
          });

          if (getMapInformation) {
            mapResult = mapResult.filter(item => {
              return !deletingChannels.some(temp => {
                if (item.OBJECTID === temp.OBJECTID) {
                  return true;
                }
                return false;
              });
            });
            mapResult = [...mapResult, ...addingChannels];

            if (getMapInformation) {
              getMapInformation(mapResult);
            }
          }
        }

        if (event.state === 'cancel') {
          const highlightStore = highlight.getAll();

          // delete
          highlight.replace(
            highlightStore.filter(temp => {
              return !completedChannels.some(item => {
                if (item.OBJECTID === temp.OBJECTID) {
                  temp.highlight.remove();
                  return true;
                }
                return false;
              });
            })
          );

          mapResult = mapResult.filter(temp => {
            return !completedChannels.some(item => {
              if (item.OBJECTID === temp.OBJECTID) {
                return true;
              }
              return false;
            });
          });

          if (getMapInformation) {
            getMapInformation(mapResult);
          }
        }
      });
    });
  }
};

export default MapUILocation;
