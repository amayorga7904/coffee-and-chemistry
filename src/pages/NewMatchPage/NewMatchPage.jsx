import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, getUser } from '../../utilities/users-service';
import { useNavigate } from 'react-router-dom';
import { useUserData } from './UserDataContext';
import { useParams } from 'react-router-dom';

export default function NewMatchPage() {
  const { setUserData } = useUserData()
  const { userId } = useParams()
  const [otherUsers, setOtherUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [content, setContent] = useState('')

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

  const setMatch = async (receiverId, content) => {
    const token = getToken();
    const matchData = {
      receiver: receiverId,
      content: content,
    };

    try {
      const response = await axios.post('/api/matches/', matchData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('response data', response.data)
      console.log('Match created successfully');
      console.log('content', matchData.content);
      const user = otherUsers.find(user => user._id === receiverId);
      console.log('User data:', user);
      console.log('receiver:', receiverId);
      const currentUser = getUser()
      // Redirect to match history page
      navigate(`/matches/${currentUser._id}`, { state: { userData: user, newMatchData: response.data } });
      setContent('')
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

const handleContentChange = (e) => {
  setContent(e.target.value)
}

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
            <input type="text" value={content} onChange={handleContentChange} />
            <button onClick={() => setMatch(user._id, content)}>Create Match</button>
            <br />
          </li>
        ))}
      </ul>
    </>
  );
}
