import axios from "axios";

// Variable para contar las peticiones pendientes
let requestsPending = 0;

// Función para mostrar/ocultar el loader
const toggleLoader = (show) => {
  const event = new CustomEvent('toggleLoader', { detail: { show } });
  window.dispatchEvent(event);
};

const baseURL = "https://sistemainformacion.pythonanywhere.com";

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para mostrar el loader antes de la petición
api.interceptors.request.use((config) => {
  requestsPending++;
  if (requestsPending === 1) {
    toggleLoader(true);
  }
  
  // Si los datos son FormData, eliminar el Content-Type para que el navegador lo establezca con el boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
}, (error) => {
  requestsPending--;
  if (requestsPending === 0) {
    toggleLoader(false);
  }
  return Promise.reject(error);
});

// Interceptor para ocultar el loader después de la respuesta
api.interceptors.response.use(
  (response) => {
    requestsPending--;
    if (requestsPending === 0) {
      toggleLoader(false);
    }
    return response;
  },
  (error) => {
    requestsPending--;
    if (requestsPending === 0) {
      toggleLoader(false);
    }
    return Promise.reject(error);
  }
);

export default api;
