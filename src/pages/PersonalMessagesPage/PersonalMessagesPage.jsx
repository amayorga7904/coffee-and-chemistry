import { useLocation } from "react-router-dom";
import { getUser } from "../../utilities/users-service";
import { useState, useEffect } from "react";

export default function PersonalMessagesPage() {
    const location = useLocation();
    const { matchData } = location.state || {};
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        setCurrentUser(getUser());
    }, []);

    // Now you can access the match data and the current user
    console.log('Match data:', matchData);
    console.log('Current user:', currentUser);

    return (
        <div>
            <h1>Personal Messages</h1>
            {matchData && currentUser && (
                <div>
                    {matchData.messages.map((message, index) => (
                        <p key={index}>
                            <strong>{message.sender._id === currentUser._id ? currentUser.name : matchData.users.find(user => user._id !== currentUser._id).name}</strong>: {message.content}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}

