import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function VerifyIdentity() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    lNumber: '',
    department: '',
    email: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.lNumber || !formData.department || !formData.email) {
      alert('Please fill in all fields')
      return
    }
    // TODO: replace with real API call to backend
    navigate('/verify-code')
  }

  return (
    <div>
      <h1>Voter Verification</h1>
      <p>Enter your information to receive a verification code</p>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        type="text"
        name="lNumber"
        placeholder="L Number"
        value={formData.lNumber}
        onChange={handleChange}
      />
      <input
        type="text"
        name="department"
        placeholder="Department"
        value={formData.department}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Lamar University Email"
        value={formData.email}
        onChange={handleChange}
      />

      <button onClick={handleSubmit}>Send Verification Code</button>
    </div>
  )
}

export default VerifyIdentity