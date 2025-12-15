"use client";

export function RoleBadge({ role }: { role: "ADMIN" | "CONTRIBUTOR" }) {
  return (
    <span
      className="text-xs px-2 py-1 rounded-full border"
      style={{
        borderColor: "rgba(255,255,255,.14)",
        background: role === "ADMIN" ? "rgba(59,130,246,.18)" : "rgba(255,255,255,.06)"
      }}
    >
      {role === "ADMIN" ? "Admin" : "Contributor"}
    </span>
  );
}
