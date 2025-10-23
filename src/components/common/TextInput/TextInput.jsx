import styles from "./TextInput.module.css";

export default function TextInput({ label, error, className = "", ...props }) {
  return (
    <div className={styles.group}>
      {label && <label className={styles.label}>{label}</label>}
      
      <div className={`${styles.control} ${error ? styles.errorBorder : ""}`}>
        <input
          className={`${styles.input} ${className}`}
          {...props}
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}