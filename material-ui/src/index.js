import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

injectTapEventPlugin();
const Apps = () => {
  return (
    <MuiThemeProvider>
      <App></App>
    </MuiThemeProvider>
  )
}
ReactDOM.render(<Apps />, document.getElementById('root'));
registerServiceWorker();
