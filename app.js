import React from 'react';
import ReactDOM from 'react-dom';
class App extends React.Component{
    render(){
        return(
            <div>
                <h1>Hello React!</h1>
            </div>
        )
    }
}
ReactDOM.render(
    <App/>,document.getElementById('container')
);