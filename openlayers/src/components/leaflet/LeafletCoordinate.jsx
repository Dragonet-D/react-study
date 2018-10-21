import React, { Component } from "react";
import L from "leaflet";
import a from "proj4leaflet/src/proj4leaflet";
import OlProj from "ol/proj";
console.log(a)
export default class LeafletCoordinate extends Component{
  componentDidMount() {
    this.map = L.map('map').setView({
      lat: 1.3697024,
      lng: 103.8852096
    }, 12);
    var token = 'pk.eyJ1IjoiZG9tb3JpdHoiLCJhIjoiY2o0OHZuY3MwMGo1cTMybGM4MTFrM2dxbCJ9.yCQe43DMRqobazKewlhi9w';
    var mapboxUrl = 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/{z}/{x}/{y}@2x?access_token=' + token;
    L.tileLayer(mapboxUrl).addTo(this.map);
    L.marker({
      lat: 1.3697024,
      lng: 103.8852096
    }).addTo(this.map)
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
  };
  render() {
    return (
      <div id="map" style={{ height: "100vh"}} />
    );
  }
}
