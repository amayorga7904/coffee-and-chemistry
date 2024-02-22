import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function MatchHistoryPage() {
    const location = useLocation();
    console.log('Location state:', location.state);
    const userData = location.state?.userData;
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const newMatchData = location.state?.newMatchData;
        if (newMatchData) {
          setMatches(prevMatches => [...prevMatches, newMatchData]);
        }
      }, [location.state]);
  
    return (
      <div>
        <h1>Your Matches</h1>
        {matches.length > 0 ? (
        <ul>
          {matches.map((match, index) => (
            <li key={index}>
              <div>
                <h2>Match {index + 1}</h2>
                <p>Receiver: {match.receiver}</p>
                <p>Content: {match.content}</p>
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