import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UrlShortener from './components/UrlShortener';
import Statistics from './components/Statistics';
import RedirectHandler from './components/RedirectHandler';
import AuthIntegration from './components/AuthIntegration';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UrlShortener />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/auth" element={<AuthIntegration />} />
        <Route path="/:shortcode" element={<RedirectHandler />} />
      </Routes>
    </Router>
  );
}

export default App;
