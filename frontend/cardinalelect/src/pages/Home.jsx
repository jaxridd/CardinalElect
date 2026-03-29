import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div>
      <h1>CardinalElect</h1>
      <p>Lamar University Online Voting System</p>
      <button onClick={() => navigate('/verify')}>Student Login</button>
      <button onClick={() => navigate('/admin/create-election')}>Admin Login</button>
    </div>
  )
}

export default Home