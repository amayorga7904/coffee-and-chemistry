import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../../utilities/users-service';
import { useNavigate } from 'react-router-dom';
import { useUserData } from './UserDataContext';

export default function NewMatchPage() {
  const { setUserData } = useUserData()

  const [otherUsers, setOtherUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Call the useNavigate hook to get the navigation function

  useEffect(() => {
    const token = getToken();
    const fetchOtherUsers = async () => {
      try {
        const response = await axios.get('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOtherUsers(response.data);
      } catch (error) {
        console.error('Error fetching other users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOtherUsers();
  }, []);

  const setMatch = async (receiverId) => {
    const token = getToken();
    const matchData = {
      receiver: receiverId,
      content: 'Initial message or content for the match',
    };

    try {
      const response = await axios.post('/api/matches/new', matchData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Match created successfully');
      const user = otherUsers.find(user => user._id === receiverId);
      console.log('User data:', user);
      // Redirect to match history page
      navigate('/matches', { state: { userData: user, newMatchData: response.data } });
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  return (
    <>
      <h1>Discover New Chemistry</h1>
      {loading && <div>Loading...</div>}
      <ul>
        {otherUsers.map((user) => (
          <li key={user._id}>
            <div>
              <strong>Name:</strong> {user.name}
            </div>
            <div>
              <strong>Bio:</strong> {user.bio}
            </div>
            <div>
              <strong>Age:</strong> {user.age}
            </div>
            <button onClick={() => setMatch(user._id)}>Create Match</button>
            <br />
          </li>
        ))}
      </ul>
    </>
  );
}
