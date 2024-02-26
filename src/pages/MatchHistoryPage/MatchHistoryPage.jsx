import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getToken, getUser } from '../../utilities/users-service';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function MatchHistoryPage() {
    const location = useLocation();
    console.log('Location state:', location.state);
    const { newMatchData } = location.state || {};
    const userData = newMatchData?.userData;
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useParams()

    const fetchMatches = async () => {
        try {
            const currentUser = getUser()
            console.log('current user:', currentUser)
            const token = getToken();
            const response = await axios.get(`/api/matches/${currentUser._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('response:', response.data)
            const matchesData = response.data.filter(match => match.status !== 'rejected')
            setMatches(matchesData);
            console.log('matches data:', matchesData)
            console.log('matches:', matches)
            setLoading(false);
        } catch (error) {
            console.error('Error fetching matches:', error.response ? error.response.data : error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);
    
    const handleReject = async (matchId) => {
      const currentUser = getUser();
      const token = getToken();
    
      try {
        // Instead of deleting, update match status to "rejected"
        await axios.put(`/api/matches/${currentUser._id}/${matchId}`, { status: 'rejected' }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Assuming you want to update the matches state after rejecting a match
        fetchMatches();
      } catch (error) {
        console.error('Error rejecting match:', error);
      }
    }
    
    
    return (
      <div>
        <h1>Your Matches</h1>
        {matches.length > 0 ? (
        <ul>
          {matches.map((match, index) => (
            <li key={index}>
              <div>
                {match.messages.map((message, messageIndex) => (
            <div key={messageIndex}>
              {message.sender._id !== getUser()._id && (
                <div>
              <p><strong>{message.sender.name}</strong> </p>
              <p>Age: {message.sender.age}</p>
              <p>Bio: {message.sender.bio}</p>
              <p>Content: {message.content}</p>
                  <button>✔</button>
                  <button onClick={() => handleReject(match._id)}>✖</button>
                </div>
              )}
              </div>
              ))}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No matches yet</p>
      )}
      </div>
    );
  }
