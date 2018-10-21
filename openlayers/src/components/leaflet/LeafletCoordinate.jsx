import React, { Component } from "react";
import L from "leaflet";
import "leaflet-draw";
import "./../../lib/leaflet.awesome-markers.css";
import "./../../lib/material-icon-label";

export default class LeafletCoordinate extends Component{
  componentDidMount() {
    this.map = L.map('map').setView({
      lat: 1.3697024,
      lng: 103.8852096
    }, 12);
    var token = 'pk.eyJ1IjoiZG9tb3JpdHoiLCJhIjoiY2o0OHZuY3MwMGo1cTMybGM4MTFrM2dxbCJ9.yCQe43DMRqobazKewlhi9w';
    var mapboxUrl = 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/{z}/{x}/{y}@2x?access_token=' + token;
    L.tileLayer(mapboxUrl).addTo(this.map);
    var awesomeIcons = ['add_circle', 'place', 'add', 'alarm', 'star'];
    var colors = ['red', 'blue', 'green', 'purple', 'orange', 'darkred', 'lightred', 'beige', 'darkblue', 'darkgreen', 'cadetblue', 'darkpurple', 'white', 'pink', 'lightblue', 'lightgreen', 'gray', 'black', 'lightgray'];
    var awesomeIcon = awesomeIcons[Math.floor(Math.random()*awesomeIcons.length)];
    var color = colors[Math.floor(Math.random()*colors.length)];
    L.marker({
      lat: 1.3697024,
      lng: 103.8852096
    }, {icon: L.MaterialIconWithLabel.icon({icon: awesomeIcon, prefix: 'fa', markerColor: "red"}) })
      .addTo(this.map)
      .bindPopup("<b>中国</b><br>安徽黄山.")
      .openPopup();
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
      console.log(event);
      const content = getPopupContent(layer);
      if (content !== null) {
        // layer.bindPopup(content);
      }
      drawnItems.addLayer(layer);
    });

    // Object(s) edited - update popups
    this.map.on(L.Draw.Event.EDITED, function(event) {
      let layers = event.layers,
        content = null;
      layers.eachLayer(function(layer) {
        content = getPopupContent(layer);
        if (content !== null) {
          // layer.setPopupContent(content);
        }
      });
    });
    const _round = function(num, len) {
      return Math.round(num*(Math.pow(10, len)))/(Math.pow(10, len));
    };
    // Helper method to format LatLng object (x.xxxxxx, y.yyyyyy)
    const strLatLng = function(latlng) {
      return "("+_round(latlng.lat, 6)+", "+_round(latlng.lng, 6)+")";
    };
    const getPopupContent = function(layer) {
      // Marker - add lat/long
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        return strLatLng(layer.getLatLng());
        // Circle - lat/long, radius
      } else if (layer instanceof L.Circle) {
        var center = layer.getLatLng(),
          radius = layer.getRadius();
        return "Center: "+strLatLng(center)+"<br />"
          +"Radius: "+_round(radius, 2)+" m";
        // Rectangle/Polygon - area
      } else if (layer instanceof L.Polygon) {
        const latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs(),
          area = L.GeometryUtil.geodesicArea(latlngs);
        return "Area: "+L.GeometryUtil.readableArea(area, true);
        // Polyline - distance
      } else if (layer instanceof L.Polyline) {
        let latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs(),
          distance = 0;
        if (latlngs.length < 2) {
          return "Distance: N/A";
        } else {
          for (var i = 0; i < latlngs.length-1; i++) {
            distance += latlngs[i].distanceTo(latlngs[i+1]);
          }
          return "Distance: "+_round(distance, 2)+" m";
        }
      }
      return null;
    };
  };
  render() {
    return (
      <div id="map" style={{ height: "100vh"}} />
    );
  }
}
