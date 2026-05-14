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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async () => {
    if (!election.name || !election.startDate || !election.endDate) {
      setError("Please fill in all election details");
      return;
    }
    if (positions.some((p) => p === "")) {
      setError("Please fill in all position names");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("adminToken");

      // Step 1: Create the election
      const electionRes = await fetch("http://localhost:8000/api/elections/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: election.name,
          description: "",
          start_time: new Date(election.startDate).toISOString(),
          end_time: new Date(election.endDate).toISOString(),
        }),
      });

      if (!electionRes.ok) {
        const err = await electionRes.json();
        throw new Error(err.detail || "Failed to create election");
      }

      const electionData = await electionRes.json();
      const electionId = electionData.election_id;
      localStorage.setItem("electionId", electionId);

      // Step 2: Create each position
      const positionIds = [];
      for (const title of positions) {
        const posRes = await fetch(
          `http://localhost:8000/api/elections/${electionId}/positions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, description: "" }),
          }
        );

        if (!posRes.ok) {
          const err = await posRes.json();
          throw new Error(err.detail || "Failed to create position");
        }

        const posData = await posRes.json();
        positionIds.push({ id: posData.position_id, title });
      }

      localStorage.setItem("positionIds", JSON.stringify(positionIds));
      navigate("/admin/upload-candidates");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col gap-4 w-full max-w-md">
        <h1 className="text-2xl font-bold text-red-700">Create Election</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
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
          disabled={loading}
          className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Election"}
        </button>
      </div>
    </div>
  );
}

export default AdminCreateElection;
