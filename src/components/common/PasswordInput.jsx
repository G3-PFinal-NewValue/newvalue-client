import { useState } from "react";

export default function PasswordInput({ label, error, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className={`border rounded-md flex items-center
        ${error ? "border-red-500" : "border-gray-300"}`}>
        <input
          type={show ? "text" : "password"}
          className="px-3 py-2 flex-1 outline-none"
          {...props}
        />
        <button type="button" className="text-xs px-3 py-2" onClick={() => setShow(s=>!s)}>
          {show ? "Hide" : "Show"}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
