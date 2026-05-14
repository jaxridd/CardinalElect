import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const electionId = localStorage.getItem("electionId");
  const token = localStorage.getItem("adminToken");

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/dashboard/${electionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to load dashboard");
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [electionId, token]);

  useEffect(() => {
    if (!electionId || !token) {
      navigate("/admin/login");
      return;
    }
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 10000);
    return () => clearInterval(interval);
  }, [electionId, token, fetchDashboard, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl flex flex-col gap-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-red-700">Admin Dashboard</h1>
          <p className="text-lg font-semibold text-gray-700">{data.election.title}</p>
          <div className="flex gap-2 mt-1">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                data.is_open
                  ? "bg-green-100 text-green-700"
                  : data.is_closed
                  ? "bg-gray-100 text-gray-500"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {data.is_open ? "Election Open" : data.is_closed ? "Election Closed" : "Not Started"}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Auto-refreshes every 10 seconds</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
            <p className="text-3xl font-bold text-red-700">{data.total_votes_cast}</p>
            <p className="text-sm text-gray-500 mt-1">Total Votes Cast</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
            <p className="text-3xl font-bold text-red-700">{data.verified_voters}</p>
            <p className="text-sm text-gray-500 mt-1">Verified Voters</p>
          </div>
        </div>

        {/* Results by Position */}
        {data.positions.map((position) => {
          const maxVotes = Math.max(...position.candidates.map((c) => c.vote_count), 1);
          return (
            <div key={position.position_id} className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-gray-700">{position.position_title}</h2>
              {position.candidates.map((candidate) => (
                <div key={candidate.candidate_id} className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{candidate.candidate_name}</span>
                    <span className="text-gray-500">{candidate.vote_count} votes</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className="bg-red-700 h-3 rounded-full transition-all duration-500"
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

export default AdminDashboard;
