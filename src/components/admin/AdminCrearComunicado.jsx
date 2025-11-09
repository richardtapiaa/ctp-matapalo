import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Megaphone, FileText, Upload, Save, ArrowLeft, X, File, Image as ImageIcon, Eye, Calendar } from "lucide-react";
import AdminHeader from "./AdminHeader";
import { api } from "../../axiosConfig";

export default function AdminCrearComunicado() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        titulo: "",
        contenido: ""
    });
    const [archivos, setArchivos] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length === 0) return;

        const maxSize = 20 * 1024 * 1024; // 20MB
        const totalArchivos = archivos.length + files.length;

        if (totalArchivos > 10) {
            toast.error("Máximo 10 archivos permitidos");
            return;
        }

        const nuevosArchivos = [];
        const nuevosPreviews = [];

        files.forEach(file => {
            if (file.size > maxSize) {
                toast.error(`${file.name} es muy grande. Máximo 20MB`);
                return;
            }

            nuevosArchivos.push(file);

            // Crear preview para imágenes
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews(prev => [...prev, {
                        name: file.name,
                        type: 'image',
                        url: reader.result
                    }]);
                };
                reader.readAsDataURL(file);
            } else {
                // Para archivos que no son imágenes, agregar inmediatamente
                nuevosPreviews.push({
                    name: file.name,
                    type: 'file',
                    url: null
                });
            }
        });

        setArchivos(prev => [...prev, ...nuevosArchivos]);
        
        // Agregar previews de archivos no-imagen inmediatamente
        if (nuevosPreviews.length > 0) {
            setPreviews(prev => [...prev, ...nuevosPreviews]);
        }
    };

    const removeArchivo = (index) => {
        setArchivos(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const abrirModalConfirmacion = (e) => {
        e.preventDefault();
        
        // Validaciones
        if (!formData.titulo.trim()) {
            toast.error("El título es requerido");
            return;
        }
        
        if (!formData.contenido.trim()) {
            toast.error("El contenido es requerido");
            return;
        }

        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
    };

    const confirmarPublicacion = async () => {
        setModalAbierto(false);
        await handleSubmit();
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
            
            if (!usuario.id) {
                toast.error("Usuario no autenticado");
                navigate("/login");
                return;
            }

            let response;

            // Si hay archivos, enviar como FormData
            if (archivos.length > 0) {
                const formDataToSend = new FormData();
                formDataToSend.append("usuario_id", usuario.id);
                formDataToSend.append("titulo", formData.titulo);
                formDataToSend.append("contenido", formData.contenido);
                
                // Agregar todos los archivos
                archivos.forEach(archivo => {
                    formDataToSend.append("archivos", archivo);
                });

                response = await api.post("/admin/comunicados", formDataToSend);
            } else {
                // Si no hay archivos, enviar como JSON normal
                response = await api.post("/admin/comunicados", {
                    usuario_id: usuario.id,
                    titulo: formData.titulo,
                    contenido: formData.contenido
                });
            }

            if (response.status === 201) {
                toast.success("¡Comunicado creado exitosamente!");
                
                // Limpiar formulario
                setFormData({
                    titulo: "",
                    contenido: ""
                });
                setArchivos([]);
                setPreviews([]);

                // Redirigir después de 1.5 segundos
                setTimeout(() => {
                    navigate("/admin/mis-comunicados");
                }, 1500);
            }

        } catch (err) {
            if (err.response?.status === 403) {
                toast.error("No tienes permisos para crear comunicados");
            } else if (err.response?.status === 401) {
                toast.error("Sesión expirada. Inicia sesión nuevamente");
                navigate("/login");
            } else if (err.response?.data?.error) {
                toast.error(err.response.data.error);
            } else {
                toast.error("Error al crear el comunicado. Inténtalo de nuevo");
            }
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const getFileIcon = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) {
            return <ImageIcon className="h-5 w-5 text-blue-500" />;
        }
        return <File className="h-5 w-5 text-gray-500" />;
    };

    const formatearFecha = () => {
        const fecha = new Date();
        const opciones = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return fecha.toLocaleDateString('es-ES', opciones);
    };

    return (
        <AdminHeader>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                            <Megaphone className="h-8 w-8 text-blue-600" />
                            Crear Comunicado
                        </h1>
                        <div className="h-1 w-24 bg-blue-500 mt-3 rounded-full"></div>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={abrirModalConfirmacion} className="bg-white rounded-xl shadow-md p-6 space-y-6">
                        {/* Título */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Título del Comunicado *
                            </label>
                            <input
                                type="text"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                               
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Contenido */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Contenido *
                            </label>
                            <textarea
                                name="contenido"
                                value={formData.contenido}
                                onChange={handleChange}
                               
                                rows={8}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                required
                            />
                        </div>

                        {/* Archivos */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Archivos Adjuntos (Opcional)
                            </label>
                            <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                                <input
                                    type="file"
                                    id="archivos"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*,.pdf,.doc,.docx,.txt,.rtf,.odt"
                                />
                                <label
                                    htmlFor="archivos"
                                    className="flex flex-col items-center cursor-pointer"
                                >
                                    <Upload className="h-12 w-12 text-blue-400 mb-3" />
                                    <span className="text-sm font-semibold text-gray-700 mb-1">
                                        Click para seleccionar archivos
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Máx. 1 archivos, 20MB cada uno
                                    </span>
                                </label>
                            </div>

                            {/* Previews */}
                            {previews.length > 0 && (
                                <div className="mt-4 space-y-3">
                                    <p className="text-sm font-semibold text-gray-700">
                                        Archivos seleccionados ({previews.length}):
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {previews.map((preview, index) => (
                                            <div
                                                key={index}
                                                className="relative group border border-gray-200 rounded-lg p-2 hover:border-blue-400 transition-colors"
                                            >
                                                {preview.type === 'image' ? (
                                                    <>
                                                        <img
                                                            src={preview.url}
                                                            alt={preview.name}
                                                            className="w-full h-32 object-cover rounded"
                                                        />
                                                        <p className="text-xs text-gray-600 mt-1 truncate">
                                                            {preview.name}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <div className="flex items-center gap-2 p-2">
                                                        <File className="h-8 w-8 text-blue-500 shrink-0" />
                                                        <p className="text-xs text-gray-600 truncate flex-1">
                                                            {preview.name}
                                                        </p>
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeArchivo(index)}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/admin")}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Eye className="h-5 w-5" />
                                {loading ? "Publicando..." : "Registrar Comunicado"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Modal de Confirmación */}
                {modalAbierto && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
                        onClick={cerrarModal}
                    >
                        <div 
                            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header del Modal */}
                            <div className="bg-white px-6 py-6 border-b border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-3xl font-bold text-gray-900">
                                        {formData.titulo}
                                    </h3>
                                    <button
                                        onClick={cerrarModal}
                                        className="text-gray-500 hover:text-gray-700 p-2 rounded-lg transition-colors"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Contenido del Modal */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] bg-gray-50">
                                {/* Contenido completo */}
                                <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
                                    <div className="prose max-w-none">
                                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                            {formData.contenido}
                                        </p>
                                    </div>
                                </div>

                                {/* Archivos Adjuntos */}
                                {previews.length > 0 && (
                                    <div className="space-y-4">
                                        {previews.map((preview, index) => {
                                            const esImg = preview.type === 'image';
                                            
                                            return (
                                                <div key={index}>
                                                    {esImg ? (
                                                        /* Mostrar imagen con diseño limpio */
                                                        <div className="bg-white rounded-lg shadow-sm p-6">
                                                            <img 
                                                                src={preview.url} 
                                                                alt={preview.name}
                                                                className="w-full rounded-lg"
                                                            />
                                                        </div>
                                                    ) : (
                                                        /* Mostrar botón para documentos */
                                                        <div className="bg-white rounded-lg shadow-sm">
                                                            <div className="w-full flex items-center justify-between gap-3 p-4">
                                                                <div className="flex items-center gap-3 min-w-0">
                                                                    <div className="p-2 bg-gray-100 rounded-lg">
                                                                        {getFileIcon(preview.name)}
                                                                    </div>
                                                                    <div className="text-left min-w-0">
                                                                        <p className="text-sm font-semibold text-gray-700 truncate">
                                                                            {preview.name}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            {preview.name.split('.').pop().toUpperCase()}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Información adicional */}
                                <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatearFecha()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                                        <Megaphone className="h-4 w-4" />
                                        <span>
                                            <span className="font-semibold">Publicado por:</span>{" "}
                                            {JSON.parse(localStorage.getItem("usuario") || "{}").nombre || "Administrador"}
                                        </span>
                                    </div>
                                </div>

                                {/* Botones de Acción */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <button
                                        onClick={confirmarPublicacion}
                                        disabled={loading}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3.5 bg-blue-600 text-white font-semibold text-base rounded-lg shadow-md transition-all ${
                                            loading
                                                ? 'opacity-60 cursor-not-allowed'
                                                : 'hover:bg-blue-700 hover:shadow-lg active:scale-95'
                                        }`}
                                    >
                                        <Save className="h-5 w-5" />
                                        {loading ? "Publicando..." : "Confirmar y Publicar"}
                                    </button>
                                    <button
                                        onClick={cerrarModal}
                                        disabled={loading}
                                        className="flex-1 py-3.5 bg-gray-200 text-gray-700 font-semibold text-base rounded-lg hover:bg-gray-300 transition-all active:scale-95"
                                    >
                                        Volver a editar
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
