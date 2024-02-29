import { useEffect, useState } from 'react';
import { getUser } from '../../utilities/users-service';
import defaultProfilePicture from '../../utilities/default-image';

export default function ProfilePage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser();
                setUser(userData);
                console.log('User data:', userData);
            } catch (error) {
                console.error('Error fetching user:', error);
            } 
        };

        fetchUser();
    }, []);

    return (
        <div>
            <br />
            <br />
            <p>{user && (
                <div>
                    <p><strong>{user.name}</strong> {user.age}</p>
                    <img 
                        src={user.profilePicture || defaultProfilePicture}
                        alt="Profile" 
                        style={{ width: '300px', height: '300px' }} // Set width and height for the profile picture
                    />
                    <p>{user.bio}</p>
                    <button>Edit Bio</button>
                </div>
                )}
            </p>
        </div>
    );
}
