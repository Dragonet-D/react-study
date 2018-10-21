import React, { Component } from "react";
import L from "leaflet";
import "leaflet-draw";

export default class LeafletDraw extends Component{
  constructor(props) {
    super(props);
    this.map = {}
  }
  componentDidMount() {
    this.map = L.map('mapp').setView([51.505, -0.09], 12);
    const osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});

    const drawnItems = L.featureGroup().addTo(this.map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    L.marker([51.5, -0.09]).addTo(this.map);
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
  }
  render() {
    return(
      <div style={{width: "100vw", height: "100vh"}} id="mapp"/>
    )
  }
};
