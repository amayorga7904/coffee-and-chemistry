import { useEffect, useState } from 'react';
import { getUser } from '../../utilities/users-service';
import defaultProfilePicture from '../../utilities/default-image';
import { getToken } from '../../utilities/users-service';
import axios from 'axios';
import Card from 'react-bootstrap/Card';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [bio, setBio] = useState('');
    const [originalBio, setOriginalBio] = useState(''); // Store the original bio
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [error, setError] = useState('');


    const fetchUser = async () => {
        try {
            const userData = await getUser();
            setUser(userData);
            setOriginalBio(userData.bio); // Set the original bio when user data is fetched
        } catch (error) {
            console.error('Error fetching user:', error);
        } 
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const updateBio = async () => {
        try {
            const token = getToken();
            await axios.put(
                `/profile/${getUser()._id}`,
                { bio },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSuccessMessage('Log Out and Log Back in to see the Updated Bio. Sucks, I Know');
            setIsEditingBio(false);
            setOriginalBio(bio); // Update the original bio after successful update
        } catch (error) {
            console.error('Error updating bio:', error);
        }
    };

    const handleBioChange = (e) => {
        setBio(e.target.value);
    };

    const handleBioDoubleClick = () => {
        setIsEditingBio(true);
        setBio(originalBio); // Reset the bio to the original value when editing starts
    };

    const handleBioBlur = () => {
        setIsEditingBio(false);
        // Update bio only if it's not empty
        if (bio.trim() !== '') {
            updateBio(); // Update bio when the user finishes editing (on blur)
        } else {
            setBio(originalBio); // Restore the original bio if the new bio is empty
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            setIsEditingBio(false);
            // Update bio only if it's not empty
            if (bio.trim() !== '') {
                updateBio(); // Update bio when the user presses Enter
            } else {
                setBio(originalBio); // Restore the original bio if the new bio is empty
            }
        }
    };


    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
        setError('');
        setSuccessMessage('');
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
          const userToken = getToken();
          const formDataToSend = new FormData();
          formDataToSend.append('image', profilePicture);
      
          const response = await fetch('/api/users/:userId/profile-image', {
            method: 'PUT',
            body: formDataToSend,
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });
      
          if (response.ok) {
            // Handle successful upload
            console.log('Profile picture uploaded successfully');
            setSuccessMessage('Successfully Submitted a Profile Picture! Now Log Out and Log Back in to see it');
          } else {
            setError('Failed to upload profile picture');
          }
        } catch (error) {
          console.error('Error occurred during profile picture upload:', error);
          setError('Failed to upload profile picture');
        }
      };



    return (
        <div>
            <br />
            <br />
            <Card>
                {user && (
                    <div>
                        <Card.Title><strong>{user.name}</strong> {user.age}</Card.Title>
                        <Card.Img
                            src={user.profilePicture || defaultProfilePicture}
                            alt="Profile" 
                            style={{ width: '300px', height: '300px' }}
                        />
                        <br />
                        <br />
                        <Card.Text>
                        {isEditingBio ? (
                            <textarea
                                value={bio}
                                onChange={handleBioChange}
                                onBlur={handleBioBlur}
                                onKeyPress={handleKeyPress} // Handle Enter key press
                                placeholder="Edit Bio"
                                autoFocus 
                                style={{ 
                                    color: '#aaa'
                                }}// Automatically focus on the textarea when editing starts
                            />
                        ) : (
                            <p onDoubleClick={handleBioDoubleClick}>{user.bio}</p>
                        )}
                        </Card.Text>
                    </div>
                )}
                <div>
                    <form onSubmit={handleSubmit}>
                        <br />
                        <br />
                        <label>Upload Profile Picture:</label>
                        <input type='file' name='profilePicture' onChange={handleFileChange} accept='image/*' />
                        <button type='submit'>Upload</button>
                        {error && <p className='error-message'>{error}</p>}
                        </form>
                        {error && <p className='error-message'>{error}</p>}
                        {successMessage && <p className='success-message'>{successMessage}</p>}
                </div>
            </Card>
        </div>
    );
}
