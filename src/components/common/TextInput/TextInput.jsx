import styles from "./TextInput.module.css";

export default function TextInput({ label, error, className = "", ...props }) {
  return (
    <div className={styles.group}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        className={`${styles.input} ${error ? styles.inputError : ""} ${className}`}
        {...props}
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
