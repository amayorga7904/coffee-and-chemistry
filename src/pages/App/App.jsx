import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getUser } from '../../utilities/users-service';
import './App.css';
import AuthPage from '../AuthPage/AuthPage';
import NewMatchPage from '../NewMatchPage/NewMatchPage';
import MatchHistoryPage from '../MatchHistoryPage/MatchHistoryPage';
import NavBar from '../../components/NavBar/NavBar';
import AllMessagesPage from '../AllMessagesPage/AllMessagesPage';
import PersonalMessagesPage from '../PersonalMessagesPage/PersonalMessagesPage';
import HomePage from '../../HomePage';
import ProfilePage from '../ProfilePage./ProfilePage';

export default function App() {
  const [user, setUser] = useState(getUser());

  return (
    <main className="App">
      { user ?
          <>
            <h1>ℂ𝕠𝕗𝕗𝕖𝕖 & ℂ𝕙𝕖𝕞𝕚𝕤𝕥𝕣𝕪</h1>
            <NavBar user={user} setUser={setUser} />
            <Routes>
              {/* Route components in here */}
              <Route path="/matches/new" element={<NewMatchPage />} />
              <Route path="/matches" element={<MatchHistoryPage />} />
              <Route path="/messages" element={<AllMessagesPage />} />
              <Route path="/messages/:matchId" element={<PersonalMessagesPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </>
          :
          <AuthPage setUser={setUser} />
      }
    </main>
  );
}
