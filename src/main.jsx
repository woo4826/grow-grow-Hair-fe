import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import WebcamCapture from './WebcamCapture';
import GamePage from './GamePage';
import FinishPage from './FinishPage';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/screenshot" element={<WebcamCapture />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/finish" element={<FinishPage />} />
    </Routes>
  </Router>
);
