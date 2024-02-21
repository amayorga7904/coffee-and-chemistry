import { signUp } from '../../utilities/users-service'
import React, { useState } from 'react'

const signUpData = {
  name: '',
  email: '',
  born: '',
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
    e.preventDefault()
    try {
      const { name, email, password, bio, born } = formData
      const user = await signUp(formData)
      setUser(user)
    } catch {
      // An error occurred
      // Probably due to a duplicate email
      setFormData({ ...formData, error: 'Sign Up Failed - Try Again' })
    }
  }
  const disable = formData.password !== formData.confirm

  return (
    <div>
      <div className='form-container'>
        <form 
          autoComplete='off' 
          onSubmit={handleSubmit}
        >
          <label>Name</label>
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
          <label>Date of Birth</label>
          <input 
            type='text' 
            name='born' 
            value={formData.born} 
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