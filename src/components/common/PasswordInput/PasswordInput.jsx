import { useState } from "react";
import styles from "./PasswordInput.module.css";

export default function PasswordInput({ label, error, className = "", ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.group}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={`${styles.control} ${error ? styles.errorBorder : ""} ${className}`}>
        <input type={show ? "text" : "password"} className={styles.input} {...props} />
        <button type="button" className={styles.toggle} onClick={() => setShow(s=>!s)}>
          {show ? "Hide" : "Show"}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
