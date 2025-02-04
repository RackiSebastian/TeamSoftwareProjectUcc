import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../static/css/index.css';
//import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';

ReactDOM.render(
    <BrowserRouter> {/* BrowserRouter allows for content to be dynamically reloaded by wrapping the entire DOM in it */}
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </BrowserRouter>,
  document.getElementById('spotify')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
