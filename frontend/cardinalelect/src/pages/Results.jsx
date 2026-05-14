import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Results() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const electionId = localStorage.getItem("electionId");

  useEffect(() => {
    if (!electionId) {
      navigate("/");
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/admin/results/${electionId}`
        );
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Failed to load results");
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [electionId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col items-center gap-3 w-full max-w-md">
          <h1 className="text-2xl font-bold text-red-700">Results Unavailable</h1>
          <p className="text-gray-500 text-center">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl flex flex-col gap-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-red-700">Final Results</h1>
          <p className="text-lg font-semibold text-gray-700">{data.election.title}</p>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-500 w-fit mt-1">
            Election Closed
          </span>
        </div>

        {/* Results by Position */}
        {data.positions.map((position) => {
          const maxVotes = Math.max(...position.candidates.map((c) => c.vote_count), 1);
          const winner = position.candidates[0];

          return (
            <div key={position.position_id} className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-gray-700">{position.position_title}</h2>

              {/* Winner banner */}
              {winner.vote_count > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-red-700 font-semibold text-sm">🏆 Winner: {winner.candidate_name}</span>
                  <span className="text-gray-400 text-xs">({winner.vote_count} votes)</span>
                </div>
              )}

              {/* All candidates */}
              {position.candidates.map((candidate, index) => (
                <div key={candidate.candidate_id} className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm">
                    <span className={`font-medium ${index === 0 && candidate.vote_count > 0 ? "text-red-700" : "text-gray-700"}`}>
                      {candidate.candidate_name}
                    </span>
                    <span className="text-gray-500">{candidate.vote_count} votes</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        index === 0 && candidate.vote_count > 0 ? "bg-red-700" : "bg-gray-400"
                      }`}
                      style={{ width: `${(candidate.vote_count / maxVotes) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-400 hover:text-gray-600 text-center"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Results;
