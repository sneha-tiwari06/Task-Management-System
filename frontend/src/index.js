import React from 'react';
import ReactDOM from 'react-dom/client';

import "bootstrap/dist/css/bootstrap.min.css";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
// This will output a long, random string like:

// nginx
// Copy
// Edit
// a3f1b5c8d9e2a7b8f4c3e5d6a9c1b0f8d7e6c5a4b2e3d9f1a0b1c2d3e4f5a6b7
// Use this as your JWT secret key.

