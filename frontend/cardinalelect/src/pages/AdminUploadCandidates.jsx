import { useState } from "react";
import { useNavigate } from "react-router-dom";

const mockPositions = ["President", "Vice President"];

function AdminUploadCandidates() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([
    { name: "", description: "", position: mockPositions[0] },
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...candidates];
    updated[index][field] = value;
    setCandidates(updated);
  };

  const addCandidate = () => {
    setCandidates([
      ...candidates,
      { name: "", description: "", position: mockPositions[0] },
    ]);
  };

  const handleSubmit = () => {
    if (candidates.some((c) => !c.name || !c.description)) {
      alert("Please fill in all candidate details");
      return;
    }
    alert("Candidates uploaded successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col gap-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-red-700">Upload Candidates</h1>
        {candidates.map((candidate, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 border rounded-lg p-4"
          >
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
              onChange={(e) =>
                handleChange(index, "description", e.target.value)
              }
            />
            <select
              className="border rounded-lg p-3 text-sm"
              value={candidate.position}
              onChange={(e) => handleChange(index, "position", e.target.value)}
            >
              {mockPositions.map((position) => (
                <option key={position} value={position}>
                  {position}
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
          className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition"
        >
          Submit Candidates
        </button>
      </div>
    </div>
  );
}

export default AdminUploadCandidates;
