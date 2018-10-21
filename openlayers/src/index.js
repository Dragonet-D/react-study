import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// import "leaflet.label/libs/leaflet/leaflet-src";
// import "leaflet.label/src/Label";
// import "leaflet.label/src/BaseMarkerMethods";
// import "leaflet.label/src/Marker.Label";
// import "leaflet.label/src/CircleMarker.Label";
// import "leaflet.label/src/Path.Label";
// import "leaflet.label/src/Map.Label";
// import "leaflet.label/src/FeatureGroup.Label";
// import "leaflet.label/dist/leaflet.label.css";

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
