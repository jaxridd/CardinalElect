import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

function VerifyIdentity() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    lNumber: "",
    department: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.lNumber ||
      !formData.department ||
      !formData.email
    ) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post(
        `/api/elections/${localStorage.getItem("electionId")}/verify/request`,
        {
          full_name: formData.name,
          l_number: formData.lNumber,
          department: formData.department,
          email: formData.email,
        },
      );
      navigate("/verify-code", { state: { email: formData.email } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col gap-4 w-full max-w-md">
        <h1 className="text-2xl font-bold text-red-700">Voter Verification</h1>
        <p className="text-gray-500 text-sm">
          Enter your information to receive a verification code
        </p>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          className="border rounded-lg p-3 text-sm"
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          className="border rounded-lg p-3 text-sm"
          type="text"
          name="lNumber"
          placeholder="L Number"
          value={formData.lNumber}
          onChange={handleChange}
        />
        <input
          className="border rounded-lg p-3 text-sm"
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
        />
        <input
          className="border rounded-lg p-3 text-sm"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Verification Code"}
        </button>
      </div>
    </div>
  );
}

export default VerifyIdentity;
