import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './pages/App/App';
import { MatchDataProvider } from './pages/MatchHistoryPage/MatchDataContext';
import { UserDataProvider } from './pages/NewMatchPage/UserDataContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <UserDataProvider>
      <MatchDataProvider>
        <App />
      </MatchDataProvider>
      </UserDataProvider>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
