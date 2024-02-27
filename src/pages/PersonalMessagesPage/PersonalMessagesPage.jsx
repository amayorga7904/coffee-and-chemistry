import { useLocation } from "react-router-dom"

export default function PersonalMessagesPage() {
    const location = useLocation();
    const { matchData } = location.state || {};

    // Now you can access the match data
    console.log('Person With Whom You Matched:', matchData.users[0].name)
    console.log('Match content:', matchData.messages[0].content)
    console.log('Match status:', matchData.status)
    return (
        <div>
            <h1>Personal Messages</h1>
            {matchData && (
                <div>
                    <p>Match name: {matchData.users[0].name}</p>
                    <p>Match content: {matchData.messages[0].content}</p>
                    <p>Match status: {matchData.status}</p>
                    {/* Render other properties of matchData */}
                </div>
            )}
        </div>
    );
}
