import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import VerifyIdentity from "./pages/VerifyIdentity";
import VerifyCode from "./pages/VerifyCode";
import Candidates from "./pages/Candidates";
import AdminCreateElection from "./pages/AdminCreateElection";
import AdminUploadCandidates from "./pages/AdminUploadCandidates";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Results from "./pages/Results";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<VerifyIdentity />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route
          path="/admin/create-election"
          element={<AdminCreateElection />}
        />
        <Route
          path="/admin/upload-candidates"
          element={<AdminUploadCandidates />}
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
