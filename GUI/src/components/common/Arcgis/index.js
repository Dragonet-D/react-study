import * as MapViews from './composites/Map';
import * as WebViews from './composites/WebMap';

const ArcGis = {
  Map: MapViews.Map,
  Scene: MapViews.Scene,
  WebMap: WebViews.WebMap,
  WebScene: WebViews.WebScene
};

export default ArcGis;

export const { Map } = ArcGis;
export const { Scene } = ArcGis;
export const { WebMap } = ArcGis;
export const { WebScene } = ArcGis;
