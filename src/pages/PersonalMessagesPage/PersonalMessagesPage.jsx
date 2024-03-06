import { useLocation } from "react-router-dom";
import { getUser } from "../../utilities/users-service";
import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../utilities/users-service";
import defaultProfilePicture from '../../utilities/default-image' 
import './PersonalMessagesPage.css'

export default function PersonalMessagesPage() {
    const location = useLocation();
    const { matchData } = location.state || {};
    const [currentUser, setCurrentUser] = useState(null);
    const [messageContent, setMessageContent] = useState('');
    const [messages, setMessages] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        setCurrentUser(getUser());
        if (matchData && matchData.messages) {
            setMessages(matchData.messages); // Reverse the messages array to display the latest message at the bottom
        }
    }, [matchData]);

    const getSenderInfo = (message) => {
        const sender = message.sender;
        if (sender._id === currentUser._id) {
            return currentUser;
        } else {
            return matchData.users.find(user => user._id !== currentUser._id);
        }
    };

    const handleSubmit = async () => {
        try {
            const token = getToken();
            const response = await axios.post(`/messages/${matchData._id}`, {
                content: messageContent
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log('Message sent successfully:', response.data);
            // Update messages state with the new message
            setMessages(prevMessages => [
                ...prevMessages,
                { content: messageContent, sender: currentUser }
            ]);
            // Clear the message content after sending
            setMessageContent('');
        } catch (error) {
            console.error('Error sending message:', error.response ? error.response.data : error.message);
        }
    };

    const handleChange = (e) => {
        setMessageContent(e.target.value);
    };

    const handleDelete = async (matchId) => {
        try {
            // Get the current user and token
            const token = getToken();
    
            // Make a DELETE request to delete the match entry
            await axios.delete(`/matches/${matchId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccessMessage('Successfully Deleted the Conversation! Get Out')
            // Optionally, you might want to update the UI to reflect the deletion
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };
    
        return (
            <div className="personal-messages-container">
              <h1>Personal Messages</h1>
              {matchData && currentUser && (
                <div className="messages-container">
                  {messages.map((message, index) => (
                    <div key={index} className={message.senderId === currentUser._id ? "sent-message" : "received-message"}>
                      <img 
                        className="profile-picture"
                        src={getSenderInfo(message).profilePicture || defaultProfilePicture} 
                        alt="Profile" 
                      />
                      <p className="message-content">{message.content}</p>
                    </div>
                  ))}
                  <input type="text" value={messageContent} onChange={handleChange} className="message-input" />
                  <button onClick={handleSubmit} className="send-button">Send</button>
                </div>
              )}
              <button onClick={() => handleDelete(matchData._id)} className="delete-button">Delete</button>
              {successMessage && <p className='success-message'>{successMessage}</p>}
            </div>
          );
        }
