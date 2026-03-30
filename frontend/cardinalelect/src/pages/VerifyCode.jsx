import { useState } from "react";
import { useNavigate } from "react-router-dom";

function VerifyCode() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const handleSubmit = () => {
    if (!code) {
      alert("Please enter your verification code");
      return;
    }
    navigate("/candidates");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col gap-4 w-full max-w-md">
        <h1 className="text-2xl font-bold text-red-700">
          Enter Verification Code
        </h1>
        <p className="text-gray-500 text-sm">
          A verification code has been sent to your Lamar University email
        </p>
        <input
          className="border rounded-lg p-3 text-sm"
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition"
        >
          Verify
        </button>
      </div>
    </div>
  );
}

export default VerifyCode;
