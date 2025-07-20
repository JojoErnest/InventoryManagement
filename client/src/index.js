import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWrapper from './AppWrapper'; // ⬅️ Ganti ke AppWrapper
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);

reportWebVitals();
