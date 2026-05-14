import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../api";

function VerifyCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!code) {
      setError("Please enter your verification code");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await api.post(
        `/api/elections/${localStorage.getItem("electionId")}/verify/confirm`,
        {
          email,
          code,
        },
      );
      navigate("/candidates", { state: { token: data.token } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col gap-4 w-full max-w-md">
        <h1 className="text-2xl font-bold text-red-700">
          Enter Verification Code
        </h1>
        <p className="text-gray-500 text-sm">
          A verification code has been sent to{" "}
          <span className="font-medium">{email}</span>
        </p>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          className="border rounded-lg p-3 text-sm"
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}

export default VerifyCode;
