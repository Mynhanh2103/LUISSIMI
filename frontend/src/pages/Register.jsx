import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/admin/auth/register", {
        username,
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto bg-[var(--card)] p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Tạo tài khoản</h2>
        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full p-2 rounded bg-[rgba(255,255,255,0.03)]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Họ và tên"
          />
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
            Tạo tài khoản
          </button>
        </form>
      </div>
    </div>
  );
}
