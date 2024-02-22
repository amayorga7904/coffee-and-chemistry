import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, getUser } from '../../utilities/users-service'

export default function MatchHistoryPage() {
  const [otherUsers, setOtherUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getToken()
    const fetchOtherUsers = async () => {
      try {
        const response = await axios.get('/api/users', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        setOtherUsers(response.data);
      } catch (error) {
        setError('Error fetching other users. Please try again later.');
        console.error('Error fetching other users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOtherUsers();
  }, []);

  return (
    <>
      <h1>Your Matches</h1>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <ul>
        {otherUsers.map(user => (
          <li key={user._id}>
          <div>
            <strong>Name:</strong> {user.name}
          </div>
          <div>
            <strong>Bio:</strong> {user.bio}
          </div>
          <div>
            <strong>Born:</strong> {user.born}
          </div>
        <br />
        </li>
        ))}
      </ul>
    </>
  );
}
