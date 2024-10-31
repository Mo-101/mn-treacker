import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { setupConnectivityListeners } from './utils/errorHandling';
import './index.css';

// Setup connectivity listeners
setupConnectivityListeners();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);