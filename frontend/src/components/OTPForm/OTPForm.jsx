import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './OTPForm.css'

const API_URL = import.meta.env.VITE_API_URL;

const OTPForm = () => {
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_URL}/api/verify-otp`, { 
        email: localStorage.getItem('otpEmail'),
        otp 
      })
      if (response.data.success) {
        navigate('/welcome')
      } else {
        console.error('Verification failed: Invalid OTP')
        alert('Error verifying OTP')
      }
    } catch (error) {
      console.error('Verification failed:', error)
      alert('Error verifying OTP')
    }
  }

  return (
    <div className="otp-form">
      <form onSubmit={handleSubmit}>
        <label>
          Enter OTP:
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </label>
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  )
}

export default OTPForm 