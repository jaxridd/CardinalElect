import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminCreateElection() {
  const navigate = useNavigate()
  const [election, setElection] = useState({
    name: '',
    startDate: '',
    endDate: ''
  })
  const [positions, setPositions] = useState([''])

  const handleElectionChange = (e) => {
    setElection({ ...election, [e.target.name]: e.target.value })
  }

  const handlePositionChange = (index, value) => {
    const updated = [...positions]
    updated[index] = value
    setPositions(updated)
  }

  const addPosition = () => {
    setPositions([...positions, ''])
  }

  const handleSubmit = () => {
    if (!election.name || !election.startDate || !election.endDate) {
      alert('Please fill in all election details')
      return
    }
    if (positions.some(p => p === '')) {
      alert('Please fill in all position names')
      return
    }
    // TODO: replace with real API call to backend
    navigate('/admin/upload-candidates')
  }

  return (
    <div>
      <h1>Create Election</h1>

      <input
        type="text"
        name="name"
        placeholder="Election Name"
        value={election.name}
        onChange={handleElectionChange}
      />
      <input
        type="datetime-local"
        name="startDate"
        value={election.startDate}
        onChange={handleElectionChange}
      />
      <input
        type="datetime-local"
        name="endDate"
        value={election.endDate}
        onChange={handleElectionChange}
      />

      <h2>Positions</h2>
      {positions.map((position, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder={`Position ${index + 1}`}
            value={position}
            onChange={(e) => handlePositionChange(index, e.target.value)}
          />
        </div>
      ))}
      <button onClick={addPosition}>+ Add Position</button>

      <br />
      <button onClick={handleSubmit}>Create Election</button>
    </div>
  )
}

export default AdminCreateElection
