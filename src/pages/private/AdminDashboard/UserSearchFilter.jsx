import { useState } from 'react';
import styles from './UserSearchFilter.module.css';

export default function UserSearchFilter({ onFilter }) {
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter({ search, role });
    };

    const handleClear = () => {
        setSearch('');
        setRole('');
        onFilter({ search: '', role: '' });
    };

    return (
        <form className={styles.filterBar} onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Buscar por nombre o email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
            />

            <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={styles.select}
            >
                <option value="">Todos los roles</option>
                <option value="admin">Administrador</option>
                <option value="psychologist">Psicólogo</option>
                <option value="patient">Paciente</option>
            </select>

            <button type="submit" className={styles.filterButton}>
                Buscar
            </button>
            <button
                type="button"
                className={styles.clearButton}
                onClick={handleClear}
            >
                Limpiar
            </button>
        </form>
    );
}
