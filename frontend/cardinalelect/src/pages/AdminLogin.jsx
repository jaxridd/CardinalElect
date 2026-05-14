import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

function AdminLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!formData.username || !formData.password) {
      setError('Please enter your username and password')
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await api.post('/api/auth/login', {
        username: formData.username,
        password: formData.password,
      })
      localStorage.setItem('adminToken', data.token)
      navigate('/admin/create-election')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col gap-4 w-full max-w-md">
        <h1 className="text-2xl font-bold text-red-700">Admin Login</h1>
        <p className="text-gray-500 text-sm">Sign in to manage elections</p>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          className="border rounded-lg p-3 text-sm"
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          className="border rounded-lg p-3 text-sm"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <button
          onClick={() => navigate('/')}
          className="text-sm text-gray-400 hover:text-gray-600 text-center"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}

export default AdminLogin
