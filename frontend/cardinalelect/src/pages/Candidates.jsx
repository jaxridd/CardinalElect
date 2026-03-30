import { useState } from "react";

const mockElection = {
  name: "Spring 2026 Student Government Election",
  positions: [
    {
      id: 1,
      title: "President",
      candidates: [
        {
          id: 1,
          name: "Jane Smith",
          description: "I will fight for better campus resources.",
        },
        {
          id: 2,
          name: "John Doe",
          description: "My goal is to improve student life at Lamar.",
        },
      ],
    },
    {
      id: 2,
      title: "Vice President",
      candidates: [
        {
          id: 3,
          name: "Maria Garcia",
          description: "Dedicated to making your voice heard.",
        },
        {
          id: 4,
          name: "Chris Lee",
          description: "Committed to student success and wellbeing.",
        },
      ],
    },
  ],
};

function Candidates() {
  const [votes, setVotes] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleVote = (positionId, candidateId) => {
    setVotes({ ...votes, [positionId]: candidateId });
  };

  const handleSubmit = () => {
    if (Object.keys(votes).length < mockElection.positions.length) {
      alert("Please vote for all positions before submitting");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col items-center gap-4 w-full max-w-md">
          <h1 className="text-2xl font-bold text-red-700">
            Thank you for voting!
          </h1>
          <p className="text-gray-500">Your votes have been recorded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col gap-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-red-700">{mockElection.name}</h1>
        {mockElection.positions.map((position) => (
          <div key={position.id} className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-gray-700">
              {position.title}
            </h2>
            {position.candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {candidate.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {candidate.description}
                  </p>
                </div>
                <button
                  onClick={() => handleVote(position.id, candidate.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${votes[position.id] === candidate.id ? "bg-green-600 text-white" : "bg-red-700 text-white hover:bg-red-800"}`}
                >
                  {votes[position.id] === candidate.id ? "✓ Selected" : "Vote"}
                </button>
              </div>
            ))}
          </div>
        ))}
        <button
          onClick={handleSubmit}
          className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition"
        >
          Submit Votes
        </button>
      </div>
    </div>
  );
}

export default Candidates;
