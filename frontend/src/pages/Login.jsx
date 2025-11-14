import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/auth/login`,
        { email, password }
      );
      const token = res.data.token;
      localStorage.setItem("token", token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi");
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto bg-[var(--card)] p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Đăng nhập</h2>
        {error && <div className="text-red-400 mb-2">{error}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full p-2 rounded bg-[rgba(255,255,255,0.03)]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="w-full p-2 rounded bg-[rgba(255,255,255,0.03)]"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
          />
          <button className="w-full py-2 bg-[var(--accent)] rounded">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}
