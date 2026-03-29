import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function VerifyCode() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')

  const handleSubmit = () => {
    if (!code) {
      alert('Please enter your verification code')
      return
    }
    // TODO: replace with real API call to backend
    navigate('/candidates')
  }

  return (
    <div>
      <h1>Enter Verification Code</h1>
      <p>A verification code has been sent to your Lamar University email</p>

      <input
        type="text"
        name="code"
        placeholder="Enter code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button onClick={handleSubmit}>Verify</button>
    </div>
  )
}

export default VerifyCode