import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const mockPositions = ['President', 'Vice President']

function AdminUploadCandidates() {
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([
    { name: '', description: '', position: mockPositions[0] }
  ])

  const handleChange = (index, field, value) => {
    const updated = [...candidates]
    updated[index][field] = value
    setCandidates(updated)
  }

  const addCandidate = () => {
    setCandidates([...candidates, { name: '', description: '', position: mockPositions[0] }])
  }

  const handleSubmit = () => {
    if (candidates.some(c => !c.name || !c.description)) {
      alert('Please fill in all candidate details')
      return
    }
    // TODO: replace with real API call to backend
    alert('Candidates uploaded successfully!')
    navigate('/')
  }

  return (
    <div>
      <h1>Upload Candidates</h1>

      {candidates.map((candidate, index) => (
        <div key={index}>
          <h3>Candidate {index + 1}</h3>
          <input
            type="text"
            placeholder="Candidate Name"
            value={candidate.name}
            onChange={(e) => handleChange(index, 'name', e.target.value)}
          />
          <textarea
            placeholder="Candidate Description"
            value={candidate.description}
            onChange={(e) => handleChange(index, 'description', e.target.value)}
          />
          <select
            value={candidate.position}
            onChange={(e) => handleChange(index, 'position', e.target.value)}
          >
            {mockPositions.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
        </div>
      ))}

      <button onClick={addCandidate}>+ Add Candidate</button>
      <br />
      <button onClick={handleSubmit}>Submit Candidates</button>
    </div>
  )
}

export default AdminUploadCandidates