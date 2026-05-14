import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminUploadCandidates() {
  const navigate = useNavigate();
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("positionIds");
    if (stored) {
      const parsed = JSON.parse(stored);
      setPositions(parsed);
      setCandidates([{ name: "", description: "", photo_url: "", positionId: parsed[0]?.id }]);
    }
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...candidates];
    updated[index][field] = value;
    setCandidates(updated);
  };

  const addCandidate = () => {
    setCandidates([
      ...candidates,
      { name: "", description: "", photo_url: "", positionId: positions[0]?.id },
    ]);
  };

  const handleSubmit = async () => {
    if (candidates.some((c) => !c.name || !c.description)) {
      setError("Please fill in all candidate details");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("adminToken");
      const electionId = localStorage.getItem("electionId");

      for (const candidate of candidates) {
        const res = await fetch(
          `http://localhost:8000/api/elections/${electionId}/positions/${candidate.positionId}/candidates`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: candidate.name,
              description: candidate.description,
              photo_url: candidate.photo_url || "",
            }),
          }
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Failed to upload candidate");
        }
      }

      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col items-center gap-4 w-full max-w-md">
          <h1 className="text-2xl font-bold text-red-700">Election Created!</h1>
          <p className="text-gray-500 text-center">Candidates uploaded successfully. Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col gap-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-red-700">Upload Candidates</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {candidates.map((candidate, index) => (
          <div key={index} className="flex flex-col gap-3 border rounded-lg p-4">
            <p className="font-semibold text-gray-700">Candidate {index + 1}</p>
            <input
              className="border rounded-lg p-3 text-sm"
              type="text"
              placeholder="Candidate Name"
              value={candidate.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
            />
            <textarea
              className="border rounded-lg p-3 text-sm"
              placeholder="Candidate Description"
              value={candidate.description}
              onChange={(e) => handleChange(index, "description", e.target.value)}
            />
            <input
              className="border rounded-lg p-3 text-sm"
              type="text"
              placeholder="Photo URL (optional)"
              value={candidate.photo_url}
              onChange={(e) => handleChange(index, "photo_url", e.target.value)}
            />
            <select
              className="border rounded-lg p-3 text-sm"
              value={candidate.positionId}
              onChange={(e) => handleChange(index, "positionId", parseInt(e.target.value))}
            >
              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.title}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          onClick={addCandidate}
          className="text-red-700 text-sm font-semibold hover:underline text-left"
        >
          + Add Candidate
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Submit Candidates"}
        </button>
      </div>
    </div>
  );
}

export default AdminUploadCandidates;
