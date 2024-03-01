import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, getUser } from '../../utilities/users-service';
import { useNavigate } from 'react-router-dom';
import { useUserData } from './UserDataContext';
import { useParams } from 'react-router-dom';
import defaultProfilePicture from '../../utilities/default-image';

export default function NewMatchPage() {
  const { setUserData } = useUserData();
  const { userId } = useParams();
  const [otherUsers, setOtherUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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
      setMatchedUsers(prevMatchedUsers => [...prevMatchedUsers, receiverId]);
      setContent('');
      setCurrentIndex(prevIndex => prevIndex + 1); // Move to the next profile
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const rejectUser = async (userId) => {
    const currentUser = getUser();
    const token = getToken();
    try {
      await axios.put(`/matches/${currentUser._id}/reject/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOtherUsers(prevOtherUsers => prevOtherUsers.filter(user => user._id !== userId));
      setCurrentIndex(prevIndex => prevIndex + 1); // Move to the next profile
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const currentProfile = otherUsers[currentIndex];

  return (
    <>
      <h1>Discover New Chemistry</h1>
      {loading && <div>Loading...</div>}
      <div>
        {currentProfile && (
          <div key={currentProfile._id}>
            <img 
              src={currentProfile.profilePicture || defaultProfilePicture}
              alt="Profile" 
              style={{ width: '100px', height: '100px' }} // Set width and height for the profile picture
            />
            <div>
              <p><strong>{currentProfile.name}</strong> {currentProfile.age}</p>
            </div>
            <div>
              <p>{currentProfile.bio}</p>
            </div>
            <input placeholder='Your Best Pickup Line!' type="text" value={content} onChange={handleContentChange} />
            <button onClick={() => setMatch(currentProfile._id, content)}>✔</button>
            <button onClick={() => rejectUser(currentProfile._id)}>✖</button>
            <br />
          </div>
        )}
      </div>
    </>
  );
}
