import React, { useState } from 'react';
import { getToken } from './utilities/users-service';

export default function HomePage() {
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
        setSuccessMessage('Successfully Submitted a Profile Picture!');
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
      <form onSubmit={handleSubmit}>
        <br />
        <br />
        <h3>Move Along if you Already Uploaded a Profile Picture</h3>
        <label>Upload Profile Picture:</label>
        <input type='file' name='profilePicture' onChange={handleFileChange} accept='image/*' />
        <button type='submit'>Upload</button>
        {error && <p className='error-message'>{error}</p>}
        </form>
        {error && <p className='error-message'>{error}</p>}
        {successMessage && <p className='success-message'>{successMessage}</p>}
    </div>
  );
}
