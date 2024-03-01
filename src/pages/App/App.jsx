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
import EditProfilePage from '../EditProfilePage/EditProfilePage';

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
              <Route path="/messages" element={<AllMessagesPage />} />
              <Route path="/messages/:matchId" element={<PersonalMessagesPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:userId" element={<EditProfilePage />} />
            </Routes>
          </>
          :
          <AuthPage setUser={setUser} />
      }
    </main>
  );
}
