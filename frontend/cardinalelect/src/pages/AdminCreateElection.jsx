import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminCreateElection() {
  const navigate = useNavigate();
  const [election, setElection] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [positions, setPositions] = useState([""]);

  const handleElectionChange = (e) => {
    setElection({ ...election, [e.target.name]: e.target.value });
  };

  const handlePositionChange = (index, value) => {
    const updated = [...positions];
    updated[index] = value;
    setPositions(updated);
  };

  const addPosition = () => {
    setPositions([...positions, ""]);
  };

  const handleSubmit = () => {
    if (!election.name || !election.startDate || !election.endDate) {
      alert("Please fill in all election details");
      return;
    }
    if (positions.some((p) => p === "")) {
      alert("Please fill in all position names");
      return;
    }
    navigate("/admin/upload-candidates");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col gap-4 w-full max-w-md">
        <h1 className="text-2xl font-bold text-red-700">Create Election</h1>
        <input
          className="border rounded-lg p-3 text-sm"
          type="text"
          name="name"
          placeholder="Election Name"
          value={election.name}
          onChange={handleElectionChange}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">Start Date</label>
          <input
            className="border rounded-lg p-3 text-sm"
            type="datetime-local"
            name="startDate"
            value={election.startDate}
            onChange={handleElectionChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">End Date</label>
          <input
            className="border rounded-lg p-3 text-sm"
            type="datetime-local"
            name="endDate"
            value={election.endDate}
            onChange={handleElectionChange}
          />
        </div>
        <h2 className="text-lg font-semibold text-gray-700">Positions</h2>
        {positions.map((position, index) => (
          <input
            key={index}
            className="border rounded-lg p-3 text-sm"
            type="text"
            placeholder={`Position ${index + 1}`}
            value={position}
            onChange={(e) => handlePositionChange(index, e.target.value)}
          />
        ))}
        <button
          onClick={addPosition}
          className="text-red-700 text-sm font-semibold hover:underline text-left"
        >
          + Add Position
        </button>
        <button
          onClick={handleSubmit}
          className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition"
        >
          Create Election
        </button>
      </div>
    </div>
  );
}

export default AdminCreateElection;
