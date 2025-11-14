import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[var(--card)] text-[var(--muted)] py-8 mt-10">
      <div className="container text-center">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="text-[var(--accent)]">LUISSIMI</span> — Thương hiệu
          túi da cao cấp Việt Nam
        </p>
      </div>
    </footer>
  );
}
