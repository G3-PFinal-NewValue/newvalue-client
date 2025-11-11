import axios from "axios";

const BASE_URL = "http://localhost:4000/article";
const BLOG_URL = `${BASE_URL}/blog`;

function handleAxiosError(error) {
  console.error('Error completo:', error); 
  
  if (error.response) {
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    
    if (error.response.status === 401 || error.response.status === 403) {
      // Limpiar token inválido
      localStorage.removeItem('token');
      throw new Error("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
    }

    const message = error.response.data?.message || "Ocurrió un error en el servidor";
    throw new Error(message);
  } else if (error.request) {
    throw new Error("No se pudo conectar con el servidor");
  } else {
    throw new Error(error.message || "Ocurrió un error desconocido");
  }
}

const getAuthHeaders = (token, isFormData = false) => {
  if (!token) {
    throw new Error("No hay token de autenticación disponible");
  }
  
  const headers = {
    Authorization: `Bearer ${token}`,
  };


  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

// Crear un artículo
export const createArticle = async (articleData, token) => {
  try {
    console.log('Creando artículo con token:', token ? 'Sí existe' : 'NO EXISTE'); 
    
    const isFormData = articleData instanceof FormData;
    console.log('📦 Tipo de datos:', isFormData ? 'FormData (con imagen)' : 'JSON');
    
    const { data } = await axios.post(BASE_URL, articleData, {
      headers: getAuthHeaders(token, isFormData),
    });
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Obtener todos los artículos
export const getArticles = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/blog`);
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
};

//  Obtener artículo por ID
export const getArticleById = async (id) => {
  try {
    const { data } = await axios.get(`${API_URL}/blog/${id}`);
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Editar (actualizar) artículo
export const updateArticle = async (id, articleData, token) => {
  try {
    console.log('Actualizando artículo con token:', token ? 'Sí existe' : 'NO EXISTE');
    
    const isFormData = articleData instanceof FormData;
    console.log('📦 Tipo de datos:', isFormData ? 'FormData (con imagen)' : 'JSON');

    const { data } = await axios.put(`${BASE_URL}/${id}`, articleData, {
      headers: getAuthHeaders(token, isFormData),
    });
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
};

//  Eliminar artículo
export const deleteArticle = async (id, token) => {
  try {
    console.log('🗑️ Intentando eliminar artículo:', id);
    console.log('🔑 Token recibido:', token ? 'SÍ existe' : '❌ NO existe');
    console.log('📍 URL completa:', `${API_URL}/${id}`);
    
    if (!token) {
      throw new Error("No se proporcionó token de autenticación");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    
    console.log('📤 Enviando DELETE con headers:', config.headers);

    const response = await axios.delete(`${BASE_URL}/${id}`, config);
    
    console.log('✅ Respuesta del servidor:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Error en deleteArticle:', error);
    console.error('📊 Error response:', error.response);
    handleAxiosError(error);
  }
};
