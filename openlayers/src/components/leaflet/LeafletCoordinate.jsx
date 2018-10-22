import React, { Component } from "react";
import L from "leaflet";
import "leaflet-draw";
import "./../../lib/leaflet.awesome-markers.css";
import "./../../lib/material-icon-label";
import "leaflet.label/src/Label";

export default class LeafletCoordinate extends Component{
  state = {
    mapWith: "600px",
    mapHeight: "600px"
  };
  componentDidMount() {
    this.map = L.map('map');
    this.map.setView(new L.LatLng(1.3697024, 103.8852096), 12);
    var token = 'pk.eyJ1IjoiZG9tb3JpdHoiLCJhIjoiY2o0OHZuY3MwMGo1cTMybGM4MTFrM2dxbCJ9.yCQe43DMRqobazKewlhi9w';
    var mapboxUrl = 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/{z}/{x}/{y}@2x?access_token=' + token;
    L.tileLayer(mapboxUrl).addTo(this.map);
    var awesomeIcons = ['add_circle', 'place', 'add', 'alarm', 'star'];
    var colors = ['red', 'blue', 'green', 'purple', 'orange', 'darkred', 'lightred', 'beige', 'darkblue', 'darkgreen', 'cadetblue', 'darkpurple', 'white', 'pink', 'lightblue', 'lightgreen', 'gray', 'black', 'lightgray'];
    var awesomeIcon = awesomeIcons[Math.floor(Math.random()*awesomeIcons.length)];
    var color = colors[Math.floor(Math.random()*colors.length)];
    L.marker(new L.LatLng(1.3697024, 103.8852096), {icon: L.MaterialIconWithLabel.icon({icon: awesomeIcon, prefix: 'fa', markerColor: "red"}) })
      .bindPopup("<b>中国</b><br>安徽黄山.").addTo(this.map)
    const drawnItems = L.featureGroup().addTo(this.map);
    const editableLayers = new L.FeatureGroup();
    this.map.addLayer(editableLayers);
    const options = {
      position: 'topright',
      edit: {
        featureGroup: drawnItems,
        poly : {
          allowIntersection : false
        }
      },
      draw: {
        polygon : {
          allowIntersection: false,
          showArea: false
        },
        polyline: false,
        marker: false,
        circlemarker: false
      }
    };
    const drawControl = new L.Control.Draw(options);
    this.map.addControl(drawControl);
    // Object created - bind popup to layer, add to feature group
    this.map.on(L.Draw.Event.CREATED, function(event) {
      const layer = event.layer;
      drawnItems.addLayer(layer);
    });

    // Object(s) edited - update popups
    this.map.on(L.Draw.Event.EDITED, function(event) {
      let layers = event.layers,
        content = null;
      layers.eachLayer(function(layer) {
        if (content !== null) {
          // layer.setPopupContent(content);
        }
      });
    });
    this.map.on("zoomend", function(event) {
      console.log(event.target.getZoom());
    });
  };
  test = () => {
    this.setState({
      mapWith: "800px",
      mapHeight: "700px"
    });
    setTimeout(() => {
      console.log(this.map);
    }, 1000)
  };
  render() {
    const { mapWith, mapHeight } = this.state;
    return (
      <React.Fragment>
        <div id="map" style={{ width: mapWith, height: mapHeight}} />
        <button onClick={this.test}>click</button>
      </React.Fragment>
    );
  }
}
