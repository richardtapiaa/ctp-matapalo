import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../axiosConfig";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

export default function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    email: "", 
    nombre: "", 
    password: "",
    confirmPassword: "",
    materia_id: ""
  });
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    cargarMaterias();
  }, []);

  const cargarMaterias = async () => {
    try {
      const response = await api.get('/admin/materias');
      setMaterias(response.data.materias);
    } catch (error) {
      console.error("Error al cargar materias:", error);
      toast.error("Error al cargar las materias");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ 
      ...prev, 
      [e.target.name]: e.target.value 
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      toast.error("Solo se permiten imágenes");
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen es muy grande. Máximo 5MB");
      return;
    }

    setFotoPerfil(file);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setFotoPerfil(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    // Validar longitud de contraseña
    if (formData.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Validar que se seleccionó una materia
    if (!formData.materia_id) {
      toast.error("Por favor selecciona una materia");
      return;
    }

    setLoading(true);
    
    try {
      // Si hay foto, enviar como FormData
      if (fotoPerfil) {
        const formDataToSend = new FormData();
        formDataToSend.append("email", formData.email);
        formDataToSend.append("nombre", formData.nombre);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("materia_id", formData.materia_id);
        formDataToSend.append("foto_perfil", fotoPerfil);

        const response = await api.post("/auth/registro", formDataToSend);
        
        if (response.status === 201) {
          toast.success("¡Registro exitoso!");
          
          // Limpiar formulario
          setFormData({ 
            email: "", 
            nombre: "", 
            password: "",
            confirmPassword: "",
            materia_id: ""
          });
          setFotoPerfil(null);
          setPreviewUrl(null);
          
          // Redirigir al login después de 2 segundos
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } else {
        // Sin foto, enviar JSON normal
        const response = await api.post("/auth/registro", {
          email: formData.email,
          nombre: formData.nombre,
          password: formData.password,
          materia_id: formData.materia_id,
        });
        
        if (response.status === 201) {
          toast.success("¡Registro exitoso!");
          
          // Limpiar formulario
          setFormData({ 
            email: "", 
            nombre: "", 
            password: "",
            confirmPassword: "",
            materia_id: ""
          });
          
          // Redirigir al login después de 2 segundos
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      }
      
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error("El usuario ya existe. Intenta con otro email.");
      } else {
        toast.error("Error al registrar usuario. Inténtalo de nuevo.");
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

          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Sistema de Ausencias
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Crea tu cuenta para comenzar
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre Completo:
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

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
              <label htmlFor="materia_id" className="block text-sm font-semibold text-gray-700 mb-2">
                Materia:
              </label>
              <select
                id="materia_id"
                name="materia_id"
                value={formData.materia_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
              >
                <option value="">Selecciona una materia</option>
                {materias.map((materia) => (
                  <option key={materia.id} value={materia.id}>
                    {materia.nombre}
                  </option>
                ))}
              </select>
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
                minLength={6}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmar Contraseña:
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Campo de Foto de Perfil */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Foto de Perfil (Opcional)
              </label>
              
              {!previewUrl ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition cursor-pointer">
                  <input
                    type="file"
                    id="foto_perfil"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="foto_perfil" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Click para seleccionar una imagen
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF (máx. 5MB)
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-0 right-1/2 translate-x-16 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
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
              {loading ? "Registrando..." : "Crear Cuenta"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <a 
                href="/login" 
                className="text-blue-600 font-semibold hover:text-blue-700 transition"
              >
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}