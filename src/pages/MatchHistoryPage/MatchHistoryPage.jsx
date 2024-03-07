// import { useLocation } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { getToken, getUser } from '../../utilities/users-service';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import { useMatchData } from './MatchDataContext';
// import defaultProfilePicture from '../../utilities/default-image' 
// import { Card, Button } from 'react-bootstrap'; 
// import './MatchHistoryPage.css'; 


// export default function MatchHistoryPage() {
//     const location = useLocation();
//     const { newMatchData } = location.state || {};
//     const userData = newMatchData?.userData;
//     const [matches, setMatches] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const { userId } = useParams()
//     const navigate = useNavigate()
//     const { setMatchData } = useMatchData();

//     const fetchMatches = async () => {
//         try {
//             const currentUser = getUser()
//             const token = getToken();
//             const response = await axios.get(`/matches/${currentUser._id}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             const matchesData = response.data.filter(match => match.status === 'pending')
//             console.log('match data', matchesData)
//             setMatches(matchesData);
//             setLoading(false);
//         } catch (error) {
//             console.error('Error fetching matches:', error.response ? error.response.data : error.message);
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchMatches();
//     }, [setMatchData]);
    
//     const handleReject = async (matchId) => {
//       const currentUser = getUser();
//       const token = getToken();
    
//       try {
//         await axios.put(`/matches/${currentUser._id}/reject/${matchId}`, { status: 'rejected' }, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         fetchMatches();
//       } catch (error) {
//         console.error('Error rejecting match:', error);
//       }
//     }
    
//     const handleAccept = async (match, matchId) => {
//       const currentUser = getUser();
//       const token = getToken();
    
//       try {
//         await axios.put(`/matches/${currentUser._id}/accept/${matchId}`, { status: 'accepted' }, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         fetchMatches();
//         navigate(`/messages/${matchId}`, { state: { matchData: match } })
//       } catch (error) {
//         console.error('Error accepting match:', error);
//       }
//     }

//     return (
//       <div>
//         <h1>𝕐𝕠𝕦𝕣 𝕄𝕒𝕥𝕔𝕙𝕖𝕤</h1>
//         {matches.length > 0 ? (
//           <div>
//             {matches.map((match, index) => (
//               <div key={index}>
//                 <div>
//                   {match.messages.map((message, messageIndex) => (
//                     <div key={messageIndex}>
//                       {message.sender._id !== getUser()._id && (
//                         <Card className="match-card">
//                           <Card.Img
//                             variant="top"
//                             src={message.sender.profilePicture || defaultProfilePicture}
//                             alt="Profile"
//                             style={{ width: '300px', height: '300px' }}
//                           />
//                           <Card.Body>
//                             <Card.Title>
//                               <strong>{message.sender.name}</strong> {message.sender.age}
//                             </Card.Title>
//                             <Card.Text>{message.sender.bio}</Card.Text>
//                             <Card.Text>"{message.content}"</Card.Text>
//                             {match.status === 'pending' && (
//                               <div>
//                                 <Button className="accept-button" onClick={() => handleAccept(match, match._id)}>
//                                   ✔
//                                 </Button>
//                                 <Button className="reject-button" onClick={() => handleReject(match._id)}>
//                                   ✖
//                                 </Button>
//                               </div>
//                             )}
//                           </Card.Body>
//                         </Card>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p>Sorry, looks like no one likes you!</p>
//         )}
//       </div>
//     );
//   }