import React from 'react'; // Import React library for building the UI
import ReactDOM from 'react-dom/client'; // Import ReactDOM for rendering the app to the DOM
import './index.css'; // Import custom CSS for the project
import App from './App'; // Import the App component that is the main entry point of the application
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter for handling routing in the app
import reportWebVitals from './reportWebVitals'; // Import reportWebVitals to measure and report performance

// Create a root DOM element to render the app into
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app inside React.StrictMode, which helps identify potential problems in the app
root.render(
  <React.StrictMode>
    {/* Wrap the App component with BrowserRouter to enable routing functionality */}
    <BrowserRouter>
      <App />  {/* Main App component where the rest of the app resides */}
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function to log results
// (for example: reportWebVitals(console.log)) or send to an analytics endpoint.
// Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
