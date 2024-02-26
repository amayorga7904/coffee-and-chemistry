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

    useEffect(() => {
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
                const matchesData = response.data 
                setMatches(matchesData);
                console.log('matches data:', matchesData)
                console.log('matches:', matches)
                setLoading(false);
            } catch (error) {
                console.error('Error fetching matches:', error.response ? error.response.data : error.message);
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);
    
    return (
      <div>
        <h1>Your Matches</h1>
        {matches.length > 0 ? (
        <ul>
          {matches.map((match, index) => (
            <li key={index}>
              <div>
                <h2>Match {index + 1}</h2>
                {match.messages.map((message, messageIndex) => (
            <div key={messageIndex}>
              {message.sender._id !== getUser()._id && (
                <div>
              <p><strong>{message.sender.name}</strong> </p>
              <p>Age: {message.sender.age}</p>
              <p>Bio: {message.sender.bio}</p>
              <p>Content: {message.content}</p>
                  <button>✔</button>
                  <button>✖</button>
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
