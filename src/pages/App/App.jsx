import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getUser } from '../../utilities/users-service';
import './App.css';
import AuthPage from '../AuthPage/AuthPage';
import NewMatchPage from '../NewMatchPage/NewMatchPage';
import MatchHistoryPage from '../MatchHistoryPage/MatchHistoryPage';
import NavBar from '../../components/NavBar/NavBar';
import MessagesPage from '../MessagesPage/MessagesPage';

export default function App() {
  const [user, setUser] = useState(getUser());

  return (
    <main className="App">
      { user ?
          <>
            <h1>Coffee & Chemistry</h1>
            <NavBar user={user} setUser={setUser} />
            <Routes>
              {/* Route components in here */}
              <Route path="/matches/new" element={<NewMatchPage />} />
              <Route path="/matches" element={<MatchHistoryPage />} />
              <Route path="/messages" element={<MessagesPage />} />
            </Routes>
          </>
          :
          <AuthPage setUser={setUser} />
      }
    </main>
  );
}
