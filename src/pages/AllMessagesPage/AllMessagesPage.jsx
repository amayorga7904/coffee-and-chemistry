import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getToken, getUser } from '../../utilities/users-service';
import axios from 'axios';

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
    <div>
      <h1>Your Messages</h1>
      {loading ? (
        <p>Loading...</p>
      ) : matches.length > 0 ? (
        <ul>
          {matches.map((match, index) => (
            <li key={index}>
              <div>
                {match.users.map(user => user._id !== getUser()._id && (
                  <div key={user._id}>
                    <p><strong>{user.name}</strong></p>
                    <Link to={`/messages/${match._id}`} state={{ matchData: match }}>View Messages</Link>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No messages yet</p>
      )}
    </div>
  );
}
