import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../../utilities/users-service'


export default function NewMatchPage() {
  const [otherUsers, setOtherUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.error('Error fetching other users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOtherUsers();
  }, []);

  return (
    <>
      <h1>Discover New Chemistry</h1>
      {loading && <div>Loading...</div>}
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
            <strong>Age:</strong> {user.age}
          </div>
        <br />
        </li>
        ))}
      </ul>
    </>
  );
}
