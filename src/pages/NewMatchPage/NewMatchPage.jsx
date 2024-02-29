import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, getUser } from '../../utilities/users-service';
import { useNavigate } from 'react-router-dom';
import { useUserData } from './UserDataContext';
import { useParams } from 'react-router-dom';

export default function NewMatchPage() {
  const { setUserData } = useUserData();
  const { userId } = useParams();
  const [otherUsers, setOtherUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [matchedUsers, setMatchedUsers] = useState([]);

  useEffect(() => {
    const token = getToken();
    const fetchOtherUsers = async () => {
      try {
        const response = await axios.get('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const currentUser = getUser();
        const filteredUsers = response.data.filter(user => user._id !== currentUser._id);
        setOtherUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching other users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOtherUsers();
  }, []);

  useEffect(() => {
    // Fetch matched users for the logged-in user
    const fetchMatchedUsers = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`/matches/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const matchedUsersIds = response.data.map(match => match.receiver);
        console.log('response data in new match page:', response.data)
        console.log('matched users ids:', matchedUsersIds)
        setMatchedUsers(matchedUsersIds);
      } catch (error) {
        console.error('Error fetching matched users:', error);
      }
    };

    fetchMatchedUsers();
  }, [userId]);

  const setMatch = async (receiverId, content) => {
    const token = getToken();
    const matchData = {
      receiver: receiverId,
      content: content,
    };

    try {
      const response = await axios.post('/matches/', matchData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('response data', response.data);
      console.log('Match created successfully');
      console.log('content', matchData.content);
      // Add the matched user to the list of matched users
      setMatchedUsers(prevMatchedUsers => [...prevMatchedUsers, receiverId]);
      setContent('');
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  // Filter out the matched users from the list of other users
  const filteredUsers = otherUsers.filter(user => !matchedUsers.includes(user._id));

  const rejectUser = async (userId) => {
    const currentUser = getUser();
    const token = getToken();
    try {
      await axios.put(`/matches/${currentUser._id}/reject/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Remove the rejected user from the list of other users
      setOtherUsers(prevOtherUsers => prevOtherUsers.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };
  

  return (
    <>
      <h1>Discover New Chemistry</h1>
      {loading && <div>Loading...</div>}
      <div>
        {filteredUsers.map((user) => (
          <div key={user._id}>
            <div>
              <strong>Name:</strong> {user.name}
            </div>
            <div>
              <strong>Bio:</strong> {user.bio}
            </div>
            <div>
              <strong>Age:</strong> {user.age}
            </div>
            <input placeholder='Your Best Pickup Line!' type="text" value={content} onChange={handleContentChange} />
            <button onClick={() => setMatch(user._id, content)}>✔</button>
            <button onClick={() => rejectUser(user._id)}>✖</button>
            <br />
          </div>
        ))}
      </div>
    </>
  );
}
