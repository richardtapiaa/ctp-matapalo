import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import { api } from "../../axiosConfig";
import { toast } from "sonner";
import { 
    Users, Mail, User, Search, Plus, Edit, Trash2, X, Save, 
    UserCircle, Lock, Shield, BookOpen, Upload, Eye, EyeOff 
} from "lucide-react";

export default function AdminUsuarios() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [previewFoto, setPreviewFoto] = useState(null);
    const [vistaActual, setVistaActual] = useState("DOCENTE"); // Nueva: controla qué vista mostrar
    
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        password: "",
        rol: "DOCENTE",
        materia_id: "",
        foto_perfil: null
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const [usuariosRes, materiasRes] = await Promise.all([
                api.get("/admin/usuarios"),
                api.get("/admin/materias")
            ]);
            setUsuarios(usuariosRes.data.usuarios);
            setMaterias(materiasRes.data.materias);
        } catch (error) {
            console.error("Error al cargar datos:", error);
            toast.error("Error al cargar los datos");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tamaño (máx 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("La imagen no debe superar 5MB");
                return;
            }

            // Validar tipo
            if (!file.type.startsWith('image/')) {
                toast.error("Solo se permiten imágenes");
                return;
            }

            setFormData(prev => ({
                ...prev,
                foto_perfil: file
            }));

            // Crear preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewFoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const abrirModalCrear = () => {
        setModoEdicion(false);
        setUsuarioSeleccionado(null);
        setFormData({
            nombre: "",
            email: "",
            password: "",
            rol: vistaActual, // Preselecciona el rol según la vista actual
            materia_id: "",
            foto_perfil: null
        });
        setPreviewFoto(null);
        setModalAbierto(true);
    };

    const abrirModalEditar = (usuario) => {
        setModoEdicion(true);
        setUsuarioSeleccionado(usuario);
        setFormData({
            nombre: usuario.nombre,
            email: usuario.email,
            password: "",
            rol: usuario.rol,
            materia_id: usuario.materia_id || "",
            foto_perfil: null
        });
        setPreviewFoto(usuario.foto_perfil ? `https://sistemainformacion.pythonanywhere.com/uploads/${usuario.foto_perfil}` : null);
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setUsuarioSeleccionado(null);
        setModoEdicion(false);
        setPreviewFoto(null);
        setMostrarPassword(false);
    };

    const abrirModalEliminar = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setModalEliminar(true);
    };

    const cerrarModalEliminar = () => {
        setModalEliminar(false);
        setUsuarioSeleccionado(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!formData.nombre.trim()) {
            toast.error("El nombre es requerido");
            return;
        }

        if (!formData.email.trim()) {
            toast.error("El email es requerido");
            return;
        }

        if (!modoEdicion && !formData.password.trim()) {
            toast.error("La contraseña es requerida");
            return;
        }

        try {
            setLoading(true);
            const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
            
            const formDataToSend = new FormData();
            formDataToSend.append("usuario_id", usuario.id);
            formDataToSend.append("nombre", formData.nombre);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("rol", formData.rol);
            
            if (formData.password) {
                formDataToSend.append("password", formData.password);
            }
            
            if (formData.materia_id) {
                formDataToSend.append("materia_id", formData.materia_id);
            }
            
            if (formData.foto_perfil) {
                formDataToSend.append("foto_perfil", formData.foto_perfil);
            }

            let response;
            if (modoEdicion) {
                response = await api.put(`/admin/usuarios/${usuarioSeleccionado.id}`, formDataToSend);
                toast.success("Usuario actualizado exitosamente");
            } else {
                response = await api.post("/admin/usuarios", formDataToSend);
                toast.success("Usuario creado exitosamente");
            }

            await cargarDatos();
            cerrarModal();

        } catch (err) {
            if (err.response?.data?.error) {
                toast.error(err.response.data.error);
            } else {
                toast.error("Error al guardar el usuario");
            }
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const eliminarUsuario = async () => {
        try {
            setLoading(true);
            const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
            
            await api.delete(`/admin/usuarios/${usuarioSeleccionado.id}`, {
                data: { usuario_id: usuario.id }
            });

            toast.success("Usuario eliminado exitosamente");
            await cargarDatos();
            cerrarModalEliminar();

        } catch (err) {
            if (err.response?.data?.error) {
                toast.error(err.response.data.error);
            } else {
                toast.error("Error al eliminar el usuario");
            }
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar usuarios por rol y búsqueda
    const usuariosFiltrados = usuarios.filter(usuario => {
        // Filtrar por vista actual (DOCENTE o ADMIN)
        const coincideRol = usuario.rol === vistaActual;
        
        // Filtrar por término de búsqueda
        const coincideBusqueda = searchTerm === "" || 
            usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        return coincideRol && coincideBusqueda;
    });

    // Contar usuarios por rol
    const totalDocentes = usuarios.filter(u => u.rol === 'DOCENTE').length;
    const totalAdmins = usuarios.filter(u => u.rol === 'ADMIN').length;

    const getRolColor = (rol) => {
        return rol === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700';
    };

    const getRolIcon = (rol) => {
        return rol === 'ADMIN' ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />;
    };

    return (
        <AdminHeader>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                            <Users className="h-10 w-10 text-blue-600" />
                            Gestión de Usuarios
                        </h1>
                        <p className="text-gray-600">
                            Administra todos los usuarios del sistema CTPM
                        </p>
                    </div>

                    {/* Métricas de Docentes y Administradores */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Métrica Docentes */}
                        <button
                            onClick={() => setVistaActual("DOCENTE")}
                            className={`bg-white rounded-xl shadow-md p-6 text-left transition-all hover:shadow-lg ${
                                vistaActual === "DOCENTE" ? "ring-2 ring-blue-500" : ""
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="h-5 w-5 text-blue-600" />
                                        <h3 className="text-lg font-semibold text-gray-700">Docentes</h3>
                                    </div>
                                    <p className="text-3xl font-bold text-blue-600">{totalDocentes}</p>
                                    <p className="text-sm text-gray-500 mt-1">Total de docentes registrados</p>
                                </div>
                                {vistaActual === "DOCENTE" && (
                                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                                )}
                            </div>
                        </button>

                        {/* Métrica Administradores */}
                        <button
                            onClick={() => setVistaActual("ADMIN")}
                            className={`bg-white rounded-xl shadow-md p-6 text-left transition-all hover:shadow-lg ${
                                vistaActual === "ADMIN" ? "ring-2 ring-red-500" : ""
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield className="h-5 w-5 text-red-600" />
                                        <h3 className="text-lg font-semibold text-gray-700">Administradores</h3>
                                    </div>
                                    <p className="text-3xl font-bold text-red-600">{totalAdmins}</p>
                                    <p className="text-sm text-gray-500 mt-1">Total de administradores</p>
                                </div>
                                {vistaActual === "ADMIN" && (
                                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                                )}
                            </div>
                        </button>
                    </div>

                    {/* Barra de búsqueda y botón crear */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* Búsqueda */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={`Buscar ${vistaActual === 'DOCENTE' ? 'docentes' : 'administradores'}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Estadísticas */}
                                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg ${
                                    vistaActual === "DOCENTE" ? "bg-blue-50" : "bg-red-50"
                                }`}>
                                    {vistaActual === "DOCENTE" ? (
                                        <User className="h-5 w-5 text-blue-600" />
                                    ) : (
                                        <Shield className="h-5 w-5 text-red-600" />
                                    )}
                                    <span className={`text-sm font-semibold ${
                                        vistaActual === "DOCENTE" ? "text-blue-900" : "text-red-900"
                                    }`}>
                                        {vistaActual === "DOCENTE" ? "Docentes" : "Administradores"}: {usuariosFiltrados.length}
                                    </span>
                                </div>

                                {/* Botón crear */}
                                <button
                                    onClick={abrirModalCrear}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                                >
                                    <Plus className="h-5 w-5" />
                                    <span className="font-semibold">Nuevo Usuario</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Lista de usuarios */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : usuariosFiltrados.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            {vistaActual === "DOCENTE" ? (
                                <User className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                            ) : (
                                <Shield className="h-16 w-16 text-red-300 mx-auto mb-4" />
                            )}
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                {searchTerm 
                                    ? `No se encontraron ${vistaActual === 'DOCENTE' ? 'docentes' : 'administradores'}`
                                    : `No hay ${vistaActual === 'DOCENTE' ? 'docentes' : 'administradores'} registrados`
                                }
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {searchTerm 
                                    ? "Intenta con otros términos de búsqueda"
                                    : `Crea el primer ${vistaActual === 'DOCENTE' ? 'docente' : 'administrador'} del sistema`
                                }
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={abrirModalCrear}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md"
                                >
                                    <Plus className="h-5 w-5" />
                                    Crear Usuario
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {usuariosFiltrados.map((usuario) => (
                                <div
                                    key={usuario.id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden border-2 border-transparent hover:border-blue-300"
                                >
                                    <div className="p-6">
                                        {/* Foto de perfil y nombre */}
                                        <div className="flex items-center gap-4 mb-4">
                                            {usuario.foto_perfil ? (
                                                <img
                                                    src={`https://sistemainformacion.pythonanywhere.com/uploads/${usuario.foto_perfil}`}
                                                    alt={usuario.nombre}
                                                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-blue-500">
                                                    <User className="h-8 w-8 text-blue-600" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-gray-900 truncate">
                                                    {usuario.nombre}
                                                </h3>
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getRolColor(usuario.rol)}`}>
                                                    {getRolIcon(usuario.rol)}
                                                    {usuario.rol}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                                            <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                                            <span className="text-sm truncate">{usuario.email}</span>
                                        </div>

                                        {/* Materia */}
                                        {usuario.materia_nombre && (
                                            <div className="flex items-center gap-2 text-gray-600 mb-4">
                                                <BookOpen className="h-4 w-4 text-gray-400 shrink-0" />
                                                <span className="text-sm truncate">{usuario.materia_nombre}</span>
                                            </div>
                                        )}

                                        {/* Botones de acción */}
                                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                                            <button
                                                onClick={() => abrirModalEditar(usuario)}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                <Edit className="h-4 w-4" />
                                                <span className="text-sm font-semibold">Editar</span>
                                            </button>
                                            <button
                                                onClick={() => abrirModalEliminar(usuario)}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="text-sm font-semibold">Eliminar</span>
                                            </button>
                                        </div>

                                        {/* ID */}
                                        <div className="mt-3 text-center">
                                            <span className="text-xs text-gray-400">ID: {usuario.id}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal Crear/Editar Usuario */}
                {modalAbierto && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
                        onClick={cerrarModal}
                    >
                        <div 
                            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                        {modoEdicion ? <Edit className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                                        {modoEdicion ? "Editar Usuario" : "Crear Nuevo Usuario"}
                                    </h3>
                                    <button
                                        onClick={cerrarModal}
                                        className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Contenido */}
                            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                                <div className="space-y-5">
                                    {/* Foto de perfil */}
                                    <div className="flex flex-col items-center pb-5 border-b border-gray-200">
                                        <div className="relative mb-3">
                                            {previewFoto ? (
                                                <img
                                                    src={previewFoto}
                                                    alt="Preview"
                                                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-4 border-blue-500">
                                                    <UserCircle className="h-12 w-12 text-blue-600" />
                                                </div>
                                            )}
                                        </div>
                                        <label className="cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                                                <Upload className="h-4 w-4" />
                                                Subir foto de perfil
                                            </span>
                                        </label>
                                        <p className="text-xs text-gray-500 mt-2">Máximo 5MB</p>
                                    </div>

                                    {/* Nombre */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                            <UserCircle className="h-4 w-4" />
                                            Nombre completo *
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            placeholder="Ej: Juan Pérez García"
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                            <Mail className="h-4 w-4" />
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Ej: juan@ctpm.edu"
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Contraseña */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                            <Lock className="h-4 w-4" />
                                            Contraseña {modoEdicion && "(dejar vacío para no cambiar)"}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={mostrarPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder={modoEdicion ? "Nueva contraseña (opcional)" : "Contraseña"}
                                                required={!modoEdicion}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setMostrarPassword(!mostrarPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {mostrarPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Rol */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                            <Shield className="h-4 w-4" />
                                            Rol *
                                        </label>
                                        <select
                                            name="rol"
                                            value={formData.rol}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="DOCENTE">Docente</option>
                                            <option value="ADMIN">Administrador</option>
                                        </select>
                                    </div>

                                    {/* Materia */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                            <BookOpen className="h-4 w-4" />
                                            Materia (opcional)
                                        </label>
                                        <select
                                            name="materia_id"
                                            value={formData.materia_id}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Sin materia asignada</option>
                                            {materias.map((materia) => (
                                                <option key={materia.id} value={materia.id}>
                                                    {materia.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Botones */}
                                <div className="flex gap-3 mt-6 pt-5 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-lg transition-all ${
                                            loading 
                                                ? 'opacity-60 cursor-not-allowed' 
                                                : 'hover:bg-blue-700 hover:shadow-lg active:scale-95'
                                        }`}
                                    >
                                        <Save className="h-5 w-5" />
                                        {loading ? "Guardando..." : (modoEdicion ? "Actualizar" : "Crear Usuario")}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={cerrarModal}
                                        disabled={loading}
                                        className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all active:scale-95"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal Eliminar Usuario */}
                {modalEliminar && usuarioSeleccionado && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
                        onClick={cerrarModalEliminar}
                    >
                        <div 
                            className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-slideUp"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto mb-4">
                                    <Trash2 className="h-8 w-8 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                                    ¿Eliminar usuario?
                                </h3>
                                <p className="text-gray-600 text-center mb-6">
                                    Estás a punto de eliminar a <span className="font-semibold">{usuarioSeleccionado.nombre}</span>. Esta acción no se puede deshacer.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={eliminarUsuario}
                                        disabled={loading}
                                        className={`flex-1 py-3 bg-red-600 text-white font-semibold rounded-lg transition-all ${
                                            loading 
                                                ? 'opacity-60 cursor-not-allowed' 
                                                : 'hover:bg-red-700 active:scale-95'
                                        }`}
                                    >
                                        {loading ? "Eliminando..." : "Sí, eliminar"}
                                    </button>
                                    <button
                                        onClick={cerrarModalEliminar}
                                        disabled={loading}
                                        className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all active:scale-95"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminHeader>
    );
}
