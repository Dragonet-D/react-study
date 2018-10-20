import React, { Component } from "react";
import L from "leaflet";
import "leaflet-draw"

export default class LeafletDraw extends Component{
  constructor(props) {
    super(props)
    this.map = {}
  }
  componentDidMount() {
    this.map = L.map('mapp').setView([51.505, -0.09], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    var editableLayers = new L.FeatureGroup();
    this.map.addLayer(editableLayers);

    var MyCustomMarker = L.Icon.extend({
      options: {
        shadowUrl: null,
        iconAnchor: new L.Point(12, 12),
        iconSize: new L.Point(24, 24),
        iconUrl: 'link/to/image.png'
      }
    });
    var drawnItems = L.featureGroup().addTo(this.map);
    var options = {
      position: 'topright',
      draw: {
        polyline: {
          shapeOptions: {
            color: '#f357a1',
            weight: 10
          }
        },
        polygon: {
          allowIntersection: false, // Restricts shapes to simple polygons
          drawError: {
            color: '#e1e100', // Color the shape will turn when intersects
            message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
          },
          shapeOptions: {
            color: '#bada55'
          }
        },
        circle: true, // Turns off this drawing tool
        rectangle: {
          shapeOptions: {
            clickable: false
          }
        },
        marker: {
          icon: new MyCustomMarker()
        }
      },
      edit: {
        featureGroup: editableLayers, //REQUIRED!!
        remove: false
      },
      delete: true
    };

    var drawControl = new L.Control.Draw(options);
    this.map.addControl(drawControl);

    this.map.on(L.Draw.Event.CREATED, function (e) {
      var type = e.layerType,
        layer = e.layer;
        // console.log(e);
      if (type === 'marker') {
        layer.bindPopup('A popup!');
      }

      editableLayers.addLayer(layer);
    });
  }
  render() {
    return(
      <div style={{width: "100vw", height: "100vh"}} id="mapp"/>
    )
  }
};
