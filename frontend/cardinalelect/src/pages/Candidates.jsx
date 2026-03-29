import { useState } from 'react'

const mockElection = {
  name: "Spring 2026 Student Government Election",
  positions: [
    {
      id: 1,
      title: "President",
      candidates: [
        { id: 1, name: "Jane Smith", description: "I will fight for better campus resources." },
        { id: 2, name: "John Doe", description: "My goal is to improve student life at Lamar." }
      ]
    },
    {
      id: 2,
      title: "Vice President",
      candidates: [
        { id: 3, name: "Maria Garcia", description: "Dedicated to making your voice heard." },
        { id: 4, name: "Chris Lee", description: "Committed to student success and wellbeing." }
      ]
    }
  ]
}

function Candidates() {
  const [votes, setVotes] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleVote = (positionId, candidateId) => {
    setVotes({ ...votes, [positionId]: candidateId })
  }

  const handleSubmit = () => {
    if (Object.keys(votes).length < mockElection.positions.length) {
      alert('Please vote for all positions before submitting')
      return
    }
    // TODO: replace with real API call to backend
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div>
        <h1>Thank you for voting!</h1>
        <p>Your votes have been recorded.</p>
      </div>
    )
  }

  return (
    <div>
      <h1>{mockElection.name}</h1>

      {mockElection.positions.map(position => (
        <div key={position.id}>
          <h2>{position.title}</h2>
          {position.candidates.map(candidate => (
            <div key={candidate.id}>
              <h3>{candidate.name}</h3>
              <p>{candidate.description}</p>
              <button onClick={() => handleVote(position.id, candidate.id)}>
                {votes[position.id] === candidate.id ? '✓ Selected' : 'Vote'}
              </button>
            </div>
          ))}
        </div>
      ))}

      <button onClick={handleSubmit}>Submit Votes</button>
    </div>
  )
}

export default Candidates