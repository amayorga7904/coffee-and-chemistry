import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getToken, getUser } from '../../utilities/users-service';
import axios from 'axios';
import defaultProfilePicture from '../../utilities/default-image' 
import './AllMessagesPage.css'

export default function AllMessages() {
  const location = useLocation();
  const { newMatchData } = location.state || {};
  const matchData = newMatchData ? newMatchData.matchData : {};
  const userData = matchData.userData;
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      const currentUser = getUser();
      const token = getToken();
      const response = await axios.get(`/matches/${currentUser._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const matchesData = response.data.filter(match => match.status === 'accepted');
      console.log('Filtered Matches:', matchesData); // Log filtered matches
      setMatches(matchesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching matches:', error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  console.log('Matches:', matches); // Log matches state

  return (
    <div className="your-messages-container">
      <h1>𝕐𝕠𝕦𝕣 𝕄𝕖𝕤𝕤𝕒𝕘𝕖𝕤</h1>
      {loading ? (
        <p>Loading...</p>
      ) : matches.length > 0 ? (
        <div className="messages-list">
          {matches.map((match, index) => (
            <div key={index} className="message-item">
              <div className="message-preview">
                {match.users.map(user => user._id !== getUser()._id && (
                  <div key={user._id} className="user-preview">
                    <Link to={`/messages/${match._id}`} state={{ matchData: match }} className="user-link">
                      <img src={user.profilePicture || defaultProfilePicture} alt="Profile" className="profile-picture" />
                      <strong className="user-name">{user.name}</strong>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No messages yet</p>
      )}
    </div>
  );
}