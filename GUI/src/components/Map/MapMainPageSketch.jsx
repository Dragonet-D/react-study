import { useEffect, useContext } from 'react';
import Context from 'utils/createContext';
import { loadModules } from 'esri-loader';
import { urls, layerId } from 'commons/map/setting';

const modulesUri = [
  'esri/widgets/Sketch',
  'esri/layers/GraphicsLayer',
  'esri/geometry/geometryEngine',
  'esri/geometry/support/webMercatorUtils',
  'esri/geometry/Polygon'
];

const MapMainPageSketch = props => {
  const {
    map,
    view,
    setpopSaveName,
    getMapInformation,
    AOILIstOp,
    dispatch,
    userId,
    setData
  } = props;
  const {
    highlight,
    contextMenu: { aoi }
  } = useContext(Context);
  const { setAOISketchInstance } = aoi;

  useEffect(() => {
    dispatch({
      type: 'map/getAOIPolygon',
      payload: {
        createdId: userId
      }
    }).then(res => {
      if (res && res.data) {
        setData(res.data);
      } else {
        setData([]);
      }
    });
    loadModules(modulesUri, { url: urls.module.current.js })
      .then(([Sketch, GraphicsLayer, geometryEngine, webMercatorUtils, Polygon]) => {
        const myGraphicsLayer = new GraphicsLayer({
          id: layerId.graphic
        });

        props.map.add(myGraphicsLayer);
        setTimeout(() => {
          setSketchWidget({ Sketch, geometryEngine, webMercatorUtils, Polygon }, myGraphicsLayer);
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
    const { Sketch, webMercatorUtils, Polygon } = mapClass; // geometryEngine, webMercatorUtils
    const normalLayer = map.findLayerById(layerId.normal);
    if (!myGraphicsLayer) return;
    const sketch = new Sketch({
      layer: myGraphicsLayer,
      view,
      availableCreateTools: ['polygon', 'rectangle', 'circle']
    });
    setAOISketchInstance(sketch);
    view.ui.add(sketch, { position: 'top-right', index: 0 });
    if (!normalLayer) return;
    normalLayer.queryFeatures().then(result => {
      const channels = result.features;
      let completedChannels = [];
      let mapResult = [];
      sketch.on('create', event => {
        view.graphics.removeAll();
        if (sketch.createGraphic) return;
        // Query IVH Camera Feature Layer
        if (event.state === 'complete') {
          const { geometry } = event.graphic;

          const query = normalLayer.createQuery();
          query.geometry = geometry;
          query.spatialRelationship = 'intersects';
          normalLayer.queryFeatures(query).then(res => {
            console.log(res);
            view.whenLayerView(normalLayer).then(layerView => {
              res.features.forEach(item => {
                highlight.set(layerView.highlight(item));
              });

              // const id = item.attributes.OBJECTID;
              // if (highLight.has(id)) {
              //   const content = highLight.get(id);
              //   content.push(1);
              //   highLight.set(id, content);
              // } else {
              //   view.whenLayerView(normalLayer).then(layerView => {
              //     highLight.set(item.attributes.OBJECTID, [layerView.highlight(item)]);
              //   });
              // }
            });
            // sethighLight(highLight);
          });
          // IVH Camera
          //   channels.forEach(item => {
          //     let intersects = false;
          //     if (item.geometry) {
          //       const channelPoint = geometry.spatialReference.isWGS84
          //         ? webMercatorUtils.webMercatorToGeographic(item.geometry)
          //         : item.geometry;
          //       intersects = geometryEngine.intersects(channelPoint, geometry);
          //     } else {
          //       intersects = false;
          //     }
          //     if (intersects) {
          //       view.whenLayerView(normalLayer).then(layerView => {
          //         highlight.set([
          //           {
          //             OBJECTID: item.attributes.OBJECTID,
          //             highlight: layerView.highlight(item)
          //           }
          //         ]);
          //         mapResult.push(item.attributes);
          //         completedChannels.push(item.attributes);
          //       });
          //     }
          //   });

          //   if (getMapInformation) {
          //     getMapInformation(mapResult);
          //   }
        }

        if (event.state === 'start') {
          highlight.clear();
          sketch.layer.removeAll();
        }
      });

      sketch.on('update', event => {
        const startingChannels = [...mapResult];
        const { geometry } = event.graphics[0];

        if (event.state === 'complete') {
          completedChannels = [];
          const query = normalLayer.createQuery();
          query.geometry = geometry;
          query.spatialRelationship = 'intersects';
          normalLayer.queryFeatures(query).then(res => {
            highlight.clear();
            view.whenLayerView(normalLayer).then(layerView => {
              res.features.forEach(item => {
                highlight.set(layerView.highlight(item));
              });

              // const id = item.attributes.OBJECTID;
              // if (highLight.has(id)) {
              //   const content = highLight.get(id);
              //   content.push(1);
              //   highLight.set(id, content);
              // } else {
              //   view.whenLayerView(normalLayer).then(layerView => {
              //     highLight.set(item.attributes.OBJECTID, [layerView.highlight(item)]);
              //   });
              // }
            });
            // sethighLight(highLight);
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

        if (event.state === 'start') {
          // const id = event.graphics[0].uid;
          // AOIExpandInstance.expand();
          const channels = new Promise(resolve => {
            const channelId = [];
            const query = normalLayer.createQuery();
            query.geometry = event.graphics[0].geometry;
            query.spatialRelationship = 'intersects';
            normalLayer.queryFeatures(query).then(res => {
              res.features.forEach(item => {
                channelId.push({
                  channelId: item.attributes.channelId
                });
              });
              resolve(channelId);
            });
          });

          const geometry = event.graphics[0].geometry.spatialReference.isWGS84
            ? webMercatorUtils.geographicToWebMercator(event.graphics[0].geometry)
            : event.graphics[0].geometry;

          const centerPoint = new Polygon({
            rings: geometry.rings,
            spatialReference: { wkid: 102100 }
          });
          console.log(centerPoint.centroid);
          //
          // webMercatorUtils.geographicToWebMercator()

          const ringData = geometry.rings[0].map(x => {
            return {
              xCoordinate: x[0],
              yCoordinate: x[1]
            };
          });

          channels.then(channelId => {
            const editSample = {
              centerCoordinates: {
                latitude: centerPoint.centroid.latitude,
                longitude: centerPoint.centroid.longitude
              },
              channels: channelId,
              createdId: userId,
              geometryData: ringData,
              geometryId: '',
              geometryType: geometry.type,
              pageFrom: 'channel page',
              zoomId: view.zoom.toString()
              // zoomName: userId
            };
            AOILIstOp(geometry, editSample);
            setpopSaveName(true);
          });
        }

        if (event.state === 'cancel') {
          setpopSaveName(false);
        }
      });
    });
  }
};

export default MapMainPageSketch;
