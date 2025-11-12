# 🧠 Coramind Frontend

Una plataforma web moderna para servicios de salud mental que conecta pacientes con psicólogos profesionales.

## 📋 Descripción

Coramind Frontend es la interfaz de usuario de una aplicación web integral para servicios de salud mental. Proporciona una experiencia intuitiva tanto para pacientes como para profesionales de la psicología, incluyendo funcionalidades de gestión de citas, videollamadas, blog educativo y más.

## ✨ Características Principales

### 👥 Para Pacientes

- **Registro y autenticación** - Sistema completo de registro y login
- **Búsqueda de psicólogos** - Encuentra profesionales por especialidad y disponibilidad
- **Gestión de citas** - Reserva, modifica y cancela citas fácilmente
- **Videollamadas** - Sesiones virtuales integradas con CometChat
- **Perfil personal** - Gestiona tu información y historial
- **Blog educativo** - Accede a contenido sobre salud mental

### 🩺 Para Psicólogos

- **Dashboard profesional** - Panel de control con estadísticas y métricas
- **Gestión de disponibilidad** - Configura horarios y días disponibles
- **Gestión de pacientes** - Administra tu lista de pacientes
- **Creación de contenido** - Publica artículos en el blog
- **Videollamadas profesionales** - Herramientas de comunicación avanzadas

### 👨‍💼 Para Administradores

- **Panel de administración** - Control total de la plataforma
- **Gestión de usuarios** - Administra pacientes y profesionales
- **Exportación de datos** - Genera reportes en Excel
- **Gestión de contenido** - Modera artículos y contenido

## 🛠️ Tecnologías Utilizadas

### Frontend Stack

- **React 19** - Biblioteca principal de UI
- **Vite** - Herramienta de construcción y desarrollo
- **CSS personalizado** - Estilos propios y componentes estilizados
- **React Router DOM** - Navegación y rutas

### Librerías y Herramientas

- **CometChat** - Videollamadas y chat en tiempo real
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas
- **Axios** - Cliente HTTP
- **React Big Calendar** - Calendario interactivo
- **SweetAlert2** - Alertas y notificaciones
- **React Icons** - Iconografía
- **XLSX** - Exportación de datos
- **Date-fns/Moment** - Manipulación de fechas

### Desarrollo

- **ESLint** - Linting de código
- **PostCSS** - Procesamiento CSS
- **CSS Modules** - Estilos modulares y componentes

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm
- Acceso a la API backend de Coramind

### Pasos de Instalación

1. **Clona el repositorio**

   ```bash
   git clone <url-del-repositorio>
   cd Coramind-Front
   ```

2. **Instala las dependencias**

   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   Crea un archivo `.env` en la raíz del proyecto:

   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_COMETCHAT_APP_ID=tu_app_id
   VITE_COMETCHAT_REGION=tu_region
   VITE_COMETCHAT_AUTH_KEY=tu_auth_key
   ```

4. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa de la build de producción
- `npm run lint` - Ejecuta el linter de código

## 🏗️ Estructura del Proyecto

```
src/
├── assets/              # Recursos estáticos
├── components/          # Componentes reutilizables
│   ├── auth/           # Componentes de autenticación
│   ├── common/         # Componentes comunes
│   ├── icons/          # Componentes de iconos
│   └── layout/         # Componentes de layout
├── context/            # Contextos de React
├── pages/              # Páginas de la aplicación
│   ├── private/        # Páginas privadas (requieren auth)
│   └── public/         # Páginas públicas
├── routes/             # Configuración de rutas
├── services/           # Servicios de API
├── styles/             # Estilos globales
├── tests/              # Tests
└── App.jsx            # Componente principal
```

## 🔐 Autenticación y Autorización

La aplicación utiliza un sistema de autenticación basado en JWT con diferentes roles:

- **Paciente** - Acceso a funcionalidades de usuario final
- **Psicólogo** - Acceso a herramientas profesionales
- **Administrador** - Acceso completo a la plataforma

## 🎨 Temas y Estilos

- **CSS personalizado** con estilos modulares por componente
- **Diseño responsive** compatible con móviles y desktop
- **Tema moderno** con colores profesionales para el sector salud
- **Componentes accesibles** siguiendo estándares WCAG
- **Estilos específicos** para CometChat UI integrado

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén configurados)
npm test
```

## 🐳 Docker

La aplicación incluye configuración para Docker:

```bash
# Construir imagen
docker build -t coramind-front .

# Ejecutar contenedor
docker run -p 3000:3000 coramind-front
```

## 📱 Funcionalidades por Página

### Páginas Públicas

- **HomePage** - Landing page con información del servicio
- **LoginPage** - Inicio de sesión
- **RegisterPage** - Registro de pacientes
- **RegisterProfessionalPage** - Registro de psicólogos
- **PsychologistListPage** - Lista de profesionales disponibles
- **Blog** - Artículos sobre salud mental
- **ContactPage** - Información de contacto

### Páginas Privadas

- **PatientProfile** - Perfil del paciente
- **PsychologistProfile** - Perfil del psicólogo
- **AdminDashboard** - Panel de administración
- **VideoCallPage** - Página de videollamadas
- **PatientAppointmentsPage** - Gestión de citas del paciente

## 🔧 Configuración de CometChat

Para habilitar las videollamadas, configura CometChat:

1. Crea una cuenta en [CometChat](https://www.cometchat.com/)
2. Obtén tus credenciales (App ID, Region, Auth Key)
3. Configúralas en el archivo `.env`

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo de Desarrollo

Desarrollado con ❤️ por el equipo de NewValue en Factoría F5.

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, contacta al equipo de desarrollo.

---

**¿Necesitas ayuda?** Revisa la documentación del backend en el directorio `newvalue-server` para entender mejor la integración de APIs.
