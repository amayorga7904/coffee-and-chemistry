import { set } from 'mongoose'
import { signUp } from '../../utilities/users-service'
import React, { useState } from 'react'

const signUpData = {
  name: '',
  email: '',
  age: '',
  bio: '',
  password: '',
  confirm: '',
  error: ''
}

const SignUpForm = ({ setUser }) => {
  const [formData, setFormData] = useState(signUpData)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      error: ''
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, bio, age, confirm } = formData;
  
    // Check if age is less than 18
    if (parseInt(age) < 18) {
      setFormData({ ...formData, error: 'Sorry! You must be 18 years or older to sign up' });
      return;
    }
  

    // const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1)

    // setFormData({ ...formData, name: capitalizedName })
    
    // Check if email is valid
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   setFormData({ ...formData, error: 'Please enter a valid email' });
    //   return;
    // }
  
    // Check if password and confirm password match
    if (password !== confirm) {
      setFormData({ ...formData, error: 'Passwords do not match' });
      return;
    }
  
    try {
      const user = await signUp(formData);
      setUser(user);
    } catch {
      // An error occurred
      // Probably due to a duplicate email
      setFormData({ ...formData, error: 'Sign Up Failed - Try Again' });
    }
  };
  
  const disable = formData.password !== formData.confirm

  return (
    <div>
      <div className='form-container'>
        <form 
          autoComplete='off' 
          onSubmit={handleSubmit}
        >
          <label>First Name</label>
          <input 
            type='text' 
            name='name' 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
          <label>Bio</label>
          <input 
            type='text' 
            name='bio' 
            value={formData.bio} 
            onChange={handleChange} 
            required 
          />
          <label>Age</label>
          <input 
            type='number' 
            name='age' 
            value={formData.age} 
            onChange={handleChange} 
            required 
          />
          <label>Email</label>
          <input 
            type='email' 
            name='email' 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <label>Password</label>
          <input 
            type='password' 
            name='password' 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
          <label>Confirm</label>
          <input 
            type='password' 
            name='confirm' 
            value={formData.confirm} 
            onChange={handleChange} 
            required 
          />
          <button 
            variant='dark' 
            type='submit' 
            disabled={disable}>
            SIGN UP
          </button>
        </form>
      </div>
      <p className='error-message'>&nbsp;{formData.error}</p>
    </div>
  )
}

export default SignUpForm