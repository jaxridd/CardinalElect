import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col items-center gap-6 w-full max-w-md">
        <h1 className="text-4xl font-bold text-red-700">CardinalElect</h1>
        <p className="text-gray-500 text-center">
          Lamar University Online Voting System
        </p>
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => navigate("/verify")}
            className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition"
          >
            Student Login
          </button>
          <button
            onClick={() => navigate("/admin/login")}
            className="w-full border border-red-700 text-red-700 py-3 rounded-lg font-semibold hover:bg-red-50 transition"
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
