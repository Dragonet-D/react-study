import L from "leaflet";
import createLeafletHook from "./react-use-ref-leaflet";

const useMap = createLeafletHook(L.map, "useMap");
const useMarker = createLeafletHook(L.marker, "useMarker");
const usePopup = createLeafletHook(L.popup, "usePopup");
const useTooltip = createLeafletHook(L.tooltip, "useTooltip");
const useTileLayer = createLeafletHook(L.tileLayer, "useTileLayer");
const useTileLayerWMS = createLeafletHook(L.tileLayer.wms, "useTileLayerWMS");
const useImageOverlay = createLeafletHook(L.imageOverlay, "useImageOverlay");
const useVideoOverlay = createLeafletHook(L.videoOverlay, "useVideoOverlay");

export {
  useMap,
  useMarker,
  usePopup,
  useTooltip,
  useTileLayer,
  useTileLayerWMS,
  useImageOverlay,
  useVideoOverlay
};