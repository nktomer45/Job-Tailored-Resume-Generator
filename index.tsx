import React from 'react';
import ReactDOM from 'react-dom/client';
import MainApp from './App.tsx'; // Changed import name from App to MainApp

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <MainApp /> {/* Use the new import name MainApp */}
  </React.StrictMode>
);