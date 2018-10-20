import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import "./lib/leaflet.awesome-markers.css";
import "leaflet/dist/leaflet.css";
import "./lib/leaflet.awesome-markers";
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
