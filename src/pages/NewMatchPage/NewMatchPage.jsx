import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, getUser } from '../../utilities/users-service';
import { useNavigate } from 'react-router-dom';
import { useUserData } from './UserDataContext';
import { useParams } from 'react-router-dom';
import defaultProfilePicture from '../../utilities/default-image';
import Card from 'react-bootstrap/Card';
import './NewMatchPage.css'

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
      setCurrentIndex(prevIndex => prevIndex + 1); 
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
      setCurrentIndex(prevIndex => prevIndex + 1); 
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const currentProfile = otherUsers[currentIndex];

  return (
    <div>
      <>
        <h1>𝔻𝕚𝕤𝕔𝕠𝕧𝕖𝕣 ℕ𝕖𝕨 ℂ𝕙𝕖𝕞𝕚𝕤𝕥𝕣𝕪</h1>
        <div>
          {loading && <div>Loading...</div>}
          {currentProfile && (
            <div key={currentProfile._id}>
              <Card  className='container'>
                <Card.Img variant="top" 
                  src={currentProfile.profilePicture || defaultProfilePicture}
                  alt="Profile" 
                  fluid 
                />
                <Card.Body>
                  <Card.Title><strong>{currentProfile.name}</strong> {currentProfile.age}</Card.Title>
                  <Card.Text>
                    {currentProfile.bio}
                  </Card.Text>
                  <Card.Text>
                    <input placeholder='Your Best Pickup Line!' type="text" value={content} onChange={handleContentChange} />
                  </Card.Text>
                </Card.Body>
                <Card.Body className='buttons'>
                  <button className='match-button' onClick={() => setMatch(currentProfile._id, content)}>✔</button>
                  <button className='reject-button' onClick={() => rejectUser(currentProfile._id)}>✖</button>
                </Card.Body>
              </Card>
              <br />
            </div>
          )}
        </div>
      </>
    </div>
  );
}