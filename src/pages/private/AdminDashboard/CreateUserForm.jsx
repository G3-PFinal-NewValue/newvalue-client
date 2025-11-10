import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminCreateUser } from '../../../services/adminService';
import Button from '../../../components/button';
import styles from './CreateUserForm.module.css';

export default function CreateUserForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        postal_code: '',
        province: '',
        full_address: '',
        city: '',
        country: '',
        dni_nie_cif: '',
        roleName: 'patient',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await adminCreateUser(formData);
            setSuccess('✅ Usuario creado correctamente.');
            setTimeout(() => navigate('/admin/dashboard'), 1500);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || '❌ Error creando usuario.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Crear Nuevo Usuario</h2>

            {error && <p className={styles.errorMessage}>{error}</p>}
            {success && <p className={styles.successMessage}>{success}</p>}

            <form onSubmit={handleSubmit} className={styles.formGrid}>
                <div className={styles.formField}>
                    <label className={styles.label}>Nombre</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Nombre"
                        required
                    />
                </div>

                <div className={styles.formField}>
                    <label className={styles.label}>Apellido</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Apellido"
                        required
                    />
                </div>

                <div className={styles.formField}>
                    <label className={styles.label}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="ejemplo@email.com"
                        required
                    />
                </div>

                <div className={styles.formField}>
                    <label className={styles.label}>Teléfono</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Teléfono"
                        required
                    />
                </div>

                <div className={styles.formField}>
                    <label className={styles.label}>Código Postal</label>
                    <input
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Código Postal"
                        required
                    />
                </div>

                <div className={styles.formField}>
                    <label className={styles.label}>Provincia</label>
                    <input
                        type="text"
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Provincia"
                        required
                    />
                </div>

                <div className={styles.formField}>
                    <label className={styles.label}>Dirección Completa</label>
                    <input
                        type="text"
                        name="full_address"
                        value={formData.full_address}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Calle, número, piso..."
                        required
                    />
                </div>

                <div className={styles.formField}>
                    <label className={styles.label}>Ciudad</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Ciudad"
                        required
                    />
                </div>

                <div className={styles.formField}>
                    <label className={styles.label}>País</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="País"
                        required
                    />
                </div>

                <div className={styles.formField}>
                    <label className={styles.label}>DNI / NIE / CIF</label>
                    <input
                        type="text"
                        name="dni_nie_cif"
                        value={formData.dni_nie_cif}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Documento de identidad"
                        required
                    />
                </div>

                <div className={styles.formField}>
                    <label className={styles.label}>Rol</label>
                    <select
                        name="roleName"
                        value={formData.roleName}
                        onChange={handleChange}
                        className={styles.select}
                    >
                        <option value="admin">Administrador</option>
                        <option value="psychologist">Psicólogo</option>
                        <option value="patient">Paciente</option>
                    </select>
                </div>

                <div className={styles.buttonContainer}>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Creando...' : 'Crear Usuario'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
