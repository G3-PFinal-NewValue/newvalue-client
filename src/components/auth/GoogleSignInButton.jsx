import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { googleLoginRequest } from '../../services/authService';
import styles from './GoogleSignInButton.module.css';

function GoogleSignInButton({ mode = 'signin' }) {
  const buttonRef = useRef(null);
  const hiddenButtonRef = useRef(null); // 馃憟 Bot贸n oculto de Google
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = initializeGoogleButton;
    document.body.appendChild(script);

    function initializeGoogleButton() {
      if (!window.google || !hiddenButtonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      // Renderizar el bot贸n de Google (oculto)
      window.google.accounts.id.renderButton(hiddenButtonRef.current, {
        theme: 'outline',
        size: 'large',
        text: mode === 'signup' ? 'signup_with' : 'signin_with',
        shape: 'rectangular',
      });
    }

    async function handleCredentialResponse(response) {
      try {
        console.log('Credencial de Google recibida, procesando...');
        setError(null);
        
        const user = await googleLoginRequest(response.credential);
        
        console.log('Usuario recibido del backend:', user);

        if (!user) {
          throw new Error('No se recibi贸 informaci贸n del usuario');
        }

        if (!user.role || user.role === 'pending') {
          console.log('Usuario con rol pending, redirigiendo a elegir-rol');
          localStorage.setItem("cm_auth", JSON.stringify({ token: user.token, user }));
          login(user);
          navigate('/elegir-rol');
        } else {
          console.log('Usuario con rol asignado:', user.role);
          login(user);
          navigate('/');
        }
      } catch (err) {
        console.error('Fallo en login con Google:', err);
        setError(err?.message || 'Error al iniciar sesi贸n con Google');
      }
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [login, navigate, mode]);

  // Funci贸n para hacer clic en el bot贸n oculto de Google
  const handleCustomClick = () => {
    if (hiddenButtonRef.current) {
      const googleButton = hiddenButtonRef.current.querySelector('div[role="button"]');
      if (googleButton) {
        googleButton.click();
      }
    }
  };

  const buttonText = mode === 'signup' ? 'Registrarse con Google' : 'Iniciar sesión con Google';

  return (
    <div className={styles.wrapper}>
      {/* Bot贸n personalizado visible */}
      <button
        type="button"
        onClick={handleCustomClick}
        className={styles.customButton}
        ref={buttonRef}
      >
        <svg className={styles.googleIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span className={styles.buttonText}>{buttonText}</span>
      </button>

      {/* Bot贸n oculto de Google (real) */}
      <div ref={hiddenButtonRef} className={styles.hiddenButton}></div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
    </div>
  );
}

export default GoogleSignInButton;