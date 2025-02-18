import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './EmailForm.css'

const API_URL = import.meta.env.VITE_API_URL;

const EmailForm = () => {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/api/send-otp`, { email })
      localStorage.setItem('otpEmail', email)
      navigate('/verify-otp')
    } catch (error) {
      console.error('Sending OTP failed:', error)
      alert('Error sending OTP')
    }
  }

  return (
    <div className="email-form">
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </label>
        <button type="submit">Send OTP</button>
      </form>
    </div>
  )
}

export default EmailForm 