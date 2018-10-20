import React, { Component } from "react";
import L from "leaflet";

export default class Leaflet extends Component{
    constructor(props) {
        super(props)
      this.map = {}
    }
    componentDidMount() {
      this.map = L.map('map').setView([51.505, -0.09], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      var colors = ['red', 'blue', 'green', 'purple', 'orange', 'darkred', 'lightred', 'beige', 'darkblue', 'darkgreen', 'cadetblue', 'darkpurple', 'white', 'pink', 'lightblue', 'lightgreen', 'gray', 'black', 'lightgray'];

      var awesomeIcons = ['add_circle', 'place', 'add', 'alarm', 'star'];

      var rndCoordinates = function(from, to, fixed) {
        return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
      };

      for (var i = 0; i <= 100; i++) {
        var color = colors[Math.floor(Math.random()*colors.length)];
        var awesomeIcon = awesomeIcons[Math.floor(Math.random()*awesomeIcons.length)];
        var geo = [rndCoordinates(51.3,51.8, 3), rndCoordinates(0.3,-0.4,3)];

        L.marker(geo, {icon: L.MaterialIconWithLabel.icon({icon: awesomeIcon, prefix: 'fa', markerColor: color}) })
          .addTo(this.map).bindPopup("<b>中国</b><br>安徽黄山.")
          .openPopup();
      }
    }
    render() {
        return(
            <div style={{width: "100vw", height: "100vh"}} id="map"/>
        )
    }
};
