import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import ToDo from './components/hooks/ToDo';
import Test from './components/hooks/Test';
import LeafLet from './components/leaflet';
import CssTest from './components/cssTest';
import Hoc1 from "./components/hoc";
import './App.css';

function App() {
    return (
        <Router>
            <Route exact path="/" component={ToDo}/>
            <Route path="/test" component={Test}/>
            <Route path="/leaflet" component={LeafLet}/>
            <Route path="/css" component={CssTest}/>
            <Route path="/hoc" component={Hoc1}/>
        </Router>
    );
}

export default App;
