import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../api";

function Candidates() {
  const location = useLocation();
  const token = location.state?.token || "";
  const [election, setElection] = useState(null);
  const [votes, setVotes] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get('/api/elections/1')
      .then(data => {
        const parsed = {
          ...data,
          positions: data.positions.map(p => ({
            ...p,
            candidates: typeof p.candidates === 'string' 
              ? JSON.parse(p.candidates) 
              : p.candidates
          }))
        }
        setElection(parsed)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleVote = (positionId, candidateId) => {
    setVotes({ ...votes, [positionId]: candidateId });
  };

  const handleSubmit = async () => {
    if (Object.keys(votes).length < election.positions.length) {
      setError("Please vote for all positions before submitting");
      return;
    }
    setError("");
    try {
      for (const [positionId, candidateId] of Object.entries(votes)) {
        await fetch("http://localhost:8000/api/votes/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            election_id: 1,
            position_id: parseInt(positionId),
            candidate_id: candidateId,
          }),
        });
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading election...</p>
      </div>
    );

  if (submitted)
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col gap-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-red-700">{election?.title}</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {election?.positions?.map((position) => (
          <div key={position.position_id} className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-gray-700">
              {position.title}
            </h2>
            {position.candidates?.map((candidate) => (
              <div
                key={candidate.candidate_id}
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
                  onClick={() =>
                    handleVote(position.position_id, candidate.candidate_id)
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${votes[position.position_id] === candidate.candidate_id ? "bg-green-600 text-white" : "bg-red-700 text-white hover:bg-red-800"}`}
                >
                  {votes[position.position_id] === candidate.candidate_id
                    ? "✓ Selected"
                    : "Vote"}
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
