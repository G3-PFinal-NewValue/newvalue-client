import { useState } from 'react'; 
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios'; 
import TextInput from '../../../components/common/TextInput/TextInput';
import styles from './ContactPage.module.css';
import { FaWhatsapp } from 'react-icons/fa';

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  email: z.string().email('Introduce un correo válido'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xkgqdybo";

const WHATSAPP_NUMBER = "34654130653"; // <--- CAMBIA ESTE NÚMERO
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle', 'sending', 'success', 'error'
  const [submitMessage, setSubmitMessage] = useState('');

  const onSubmit = async (data) => {
    setSubmitStatus('sending'); 
    setSubmitMessage(''); 

    try {
      const response = await axios.post(FORMSPREE_ENDPOINT, data, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 201) {
        setSubmitStatus('success');
        setSubmitMessage('¡Mensaje enviado con éxito! Gracias por contactarnos.');
        reset();
      } else {
       
        throw new Error(`Respuesta inesperada: ${response.status}`);
      }
    } catch (error) {
      console.error("Error al enviar el formulario a Formspree:", error);
      setSubmitStatus('error');
      setSubmitMessage('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.');
      
    }
  };

  const isSubmitting = submitStatus === 'sending';

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.pageTitle}>Contacto</h1>
        <div className={styles.introText}>

          <p>¿Tienes alguna pregunta, sugerencia o necesitas ayuda? Ponte en contacto con nosotros a través del formulario o directamente por WhatsApp.</p> {/* */}
          
          <a
            href={WHATSAPP_LINK}
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.whatsappButton} 
          >
            <FaWhatsapp size={20} /> 
            Contactar por WhatsApp
          </a>
               </div>

       
        <form onSubmit={handleSubmit(onSubmit)} className={styles.contactForm}>
          <h2 className={styles.formTitle}>Envíanos un mensaje</h2>

         
          <TextInput label="Tu nombre" placeholder="Nombre completo" error={errors.name?.message} {...register('name')} />
          <TextInput label="Tu correo electrónico" type="email" placeholder="tu@correo.com" error={errors.email?.message} {...register('email')} />

          
          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>Mensaje</label>
            <textarea id="message" rows={5} placeholder="Escribe aquí tu consulta..." className={`${styles.textarea} ${errors.message ? styles.errorBorder : ''}`} {...register('message')} />
            {errors.message && <p className={styles.errorText}>{errors.message.message}</p>}
          </div>

          
          {submitMessage && (
            <div
              className={`${styles.submitMessage} ${
                submitStatus === 'success' ? styles.successMessage : ''
              } ${
                submitStatus === 'error' ? styles.errorMessageFeedback : '' // Usar clase diferente si el estilo de error de campo es distinto
              }`}
            >
              {submitMessage}
            </div>
          )}

          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
          </button>
        </form>
      </div>
    </div>
  );
}