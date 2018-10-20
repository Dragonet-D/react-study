import React, { Component } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default class Leaflet extends Component{
    constructor(props) {
        super(props)
      this.map = {}
    }
    componentDidMount() {
      this.map = L.map('map').setView([51.505, -0.09], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      L.marker([51.5, -0.09]).addTo(this.map)
        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        .openPopup();
    }
    render() {
        return(
            <div style={{width: "100vw", height: "100vh"}} id="map"/>
        )
    }
};
