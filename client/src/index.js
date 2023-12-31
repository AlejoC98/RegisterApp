import React, {} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

const root = ReactDOM.createRoot(document.getElementById('root'));

axios.interceptors.request.use(config => {
  if (document.querySelector(".loading-container")) {
    document.querySelector(".loading-container").style.display = "flex";
  }
    return config;
});

axios.interceptors.response.use(response => {
  setTimeout(() => {
    if (document.querySelector(".loading-container")) {
      document.querySelector(".loading-container").style.display = "none";
    }
  }, 800);
    return response;
}, (err) => {
  setTimeout(() => {
    if (document.querySelector(".loading-container")) {
      document.querySelector(".loading-container").style.display = "none";
    }
  }, 800);
    return Promise.reject(err);
});

root.render(
  <BrowserRouter>    
    <App />
  </BrowserRouter>
);
