import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

document.addEventListener('DOMContentLoaded', () => {
  const appElement = document.getElementById('app');
  
  if (appElement) {
    const root = ReactDOM.createRoot(appElement);
    root.render(<App />);
  }
});
