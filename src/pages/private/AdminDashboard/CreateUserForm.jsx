import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminCreateUser } from '../../../services/adminService';
import Button from '../../../components/Button';
//import styles from './CreateUserForm.module.css'; // Puedes crear un CSS o usar el existente

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
        roleName: 'patient', // default
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Maneja cambios en inputs
    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // Maneja envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await adminCreateUser(formData);
            alert('Usuario creado correctamente');
            navigate('/admin/dashboard'); // Volvemos al dashboard
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Error creando usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2>Crear Nuevo Usuario</h2>
            {error && <p className={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="first_name" placeholder="Nombre" value={formData.first_name} onChange={handleChange} required />
                <input type="text" name="last_name" placeholder="Apellido" value={formData.last_name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} required />
                <input type="text" name="postal_code" placeholder="Código Postal" value={formData.postal_code} onChange={handleChange} required />
                <input type="text" name="province" placeholder="Provincia" value={formData.province} onChange={handleChange} required />
                <input type="text" name="full_address" placeholder="Dirección completa" value={formData.full_address} onChange={handleChange} required />
                <input type="text" name="city" placeholder="Ciudad" value={formData.city} onChange={handleChange} required />
                <input type="text" name="country" placeholder="País" value={formData.country} onChange={handleChange} required />
                <input type="text" name="dni_nie_cif" placeholder="DNI/NIE/CIF" value={formData.dni_nie_cif} onChange={handleChange} required />

                <select name="roleName" value={formData.roleName} onChange={handleChange}>
                    <option value="admin">Admin</option>
                    <option value="psychologist">Psicólogo</option>
                    <option value="patient">Paciente</option>
                </select>

                <Button type="submit" disabled={loading}>
                    {loading ? 'Creando...' : 'Crear Usuario'}
                </Button>
            </form>
        </div>
    );
}
