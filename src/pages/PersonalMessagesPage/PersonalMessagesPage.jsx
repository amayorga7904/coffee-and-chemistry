import { useLocation } from "react-router-dom";
import { getUser } from "../../utilities/users-service";
import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../utilities/users-service";
import defaultProfilePicture from '../../utilities/default-image' 

export default function PersonalMessagesPage() {
    const location = useLocation();
    const { matchData } = location.state || {};
    const [currentUser, setCurrentUser] = useState(null);
    const [messageContent, setMessageContent] = useState('');
    const [messages, setMessages] = useState([]);

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

    // Now you can access the match data and the current user
    console.log('Match data:', matchData);
    console.log('Current user:', currentUser);

    return (
        <div>
            <h1>Personal Messages</h1>
            {matchData && currentUser && (
                <div>
                    {messages.map((message, index) => (
                        <p key={index}>
                            <img 
                                src={getSenderInfo(message).profilePicture || defaultProfilePicture} 
                                alt="Profile" 
                                style={{ width: '50px', height: '50px' }} // Set width and height for the profile picture
                            />
                            <span> {message.content}</span>
                        </p>
                    ))}
                    <input type="text" value={messageContent} onChange={handleChange}/>
                    <br />
                    <button onClick={handleSubmit} >Send</button>
                </div>
            )}
        </div>
    );
}
