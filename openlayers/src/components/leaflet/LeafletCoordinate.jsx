import React, { Component } from "react";
import L from "leaflet";
import a from "proj4leaflet/src/proj4leaflet";
import OlProj from "ol/proj";
console.log(a)
export default class LeafletCoordinate extends Component{
  componentDidMount() {
    // [103.84435325860977, 1.38758564176523] [51.505, -0.09]
    let aa = {x: 103.84435325860977, y: 1.38758564176523}

    function _getLngLat(poi) {
      var lnglat = {};
      lnglat.lng = poi.x / 20037508.34 * 180;
      var mmy = poi.y / 20037508.34 * 180;
      lnglat.lat = 180 / Math.PI * (2 * Math.atan(Math.exp(mmy * Math.PI / 180)) - Math.PI / 2);
      return lnglat;
    }

    function _getMercator(poi) {//[114.32894, 30.585748]
      var mercator = {};
      var earthRad = 6378137.0;
      // console.log("mercator-poi",poi);
      mercator.x = poi.x * Math.PI / 180 * earthRad;
      var a = poi.y * Math.PI / 180;
      mercator.y = earthRad / 2 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
      // console.log("mercator",mercator);
      return mercator; //[12727039.383734727, 3579066.6894065146]
    }

    console.log(_getMercator(aa));

    const center = [103.8852096, 1.3697024]; // 新加坡
    const center1 = [30.374558, 104.09144]; // 成都

    // const centeraa = OlProj.transform(center, 'WGS84' ,'EPSG:4326');
    this.map = L.map('map').setView({
      lat: 1.3291406454039345,
      lng: 103.85530471801756
    }, 12);
    var token = 'pk.eyJ1IjoiZG9tb3JpdHoiLCJhIjoiY2o0OHZuY3MwMGo1cTMybGM4MTFrM2dxbCJ9.yCQe43DMRqobazKewlhi9w';
    var mapboxUrl = 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/{z}/{x}/{y}@2x?access_token=' + token;
    // https://maps-{a-c}.onemap.sg/v3/Grey/{z}/{x}/{y}.png
      // http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
    L.tileLayer(mapboxUrl).addTo(this.map);

  };
  render() {
    return (
      <div id="map" style={{ height: "600px"}} />
    );
  }
}
