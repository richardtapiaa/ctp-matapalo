import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../axiosConfig";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "",
    remember: false
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, status } = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      
      if (status === 200) {
        toast.success("¡Inicio de sesión exitoso!");
        
        // Guardar datos del usuario en localStorage
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        
        if (formData.remember) {
          localStorage.setItem("rememberEmail", formData.email);
        }
        
        // Redirigir según el rol del usuario
        setTimeout(() => {
          if (data.usuario.rol === "ADMIN") {
            navigate("/admin");
          } else if (data.usuario.rol === "DOCENTE") {
            navigate("/docente");
          }
        }, 1500);
      }
      
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Credenciales inválidas. Verifica tu email y contraseña.");
      } else {
        toast.error("Error al iniciar sesión. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* Imagen de fondo */}
      <div className="hidden md:flex flex-1 relative">
        <img 
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80" 
          alt="Library background" 
          className="w-full h-full object-cover absolute top-0 left-0"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-blue-600/40 to-blue-500/30"></div>
      </div>

      {/* Formulario */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-xl p-10 shadow-lg">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img 
              src="/imagenes/ctpmlogo.png" 
              alt="CTPM Logo" 
              className="w-16 h-16 object-contain drop-shadow-md"
            />
          </div>
          <p className="text-sm text-gray-600 text-center mb-6">
            Inicia sesión para acceder a tu cuenta
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>


            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3.5 bg-blue-600 text-white font-semibold text-base rounded-lg shadow-sm transition ${
                loading 
                  ? 'opacity-60 cursor-not-allowed' 
                  : 'hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <a 
                href="/registro" 
                className="text-blue-600 font-semibold hover:text-blue-700 transition"
              >
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
