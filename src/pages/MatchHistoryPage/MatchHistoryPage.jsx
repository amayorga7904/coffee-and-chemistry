import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getToken, getUser } from '../../utilities/users-service';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function MatchHistoryPage() {
    const location = useLocation();
    console.log('Location state:', location.state);
    const userData = location.state?.userData;
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useParams()

 
    useEffect(() => {
        const newMatchData = location.state?.newMatchData;
        if (newMatchData) {
            // Include the new match in the matches state
            setMatches(prevMatches => [newMatchData, ...prevMatches]);
        }
    }, [location.state]);
    
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
                const matchesData = response.data.matches || [];
                setMatches(matchesData);
                console.log('matches data:', matchesData)
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
              <p>Receiver: {message.receiver}</p>
              <p>Content: {message.content}</p>
              </div>
              ))}
                {/* Add other match details as needed */}
              {userData && (
                <div>
                  <h2>User Info</h2>
                  <p>Name: {userData.name}</p>
                  <p>Bio: {userData.bio}</p>
                  <p>Age: {userData.age}</p>
                </div>
              )}
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