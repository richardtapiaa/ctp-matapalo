import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
    Megaphone, FileText, Calendar, Inbox, Download, File, 
    Image as ImageIcon, X, ExternalLink, Edit, Trash2, Save, Upload 
} from "lucide-react";
import AdminHeader from "./AdminHeader";
import { api } from "../../axiosConfig";

export default function AdminVerMisComunicados() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [comunicados, setComunicados] = useState([]);
    const [comunicadoSeleccionado, setComunicadoSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    
    // Estados para edición
    const [formData, setFormData] = useState({
        titulo: "",
        contenido: ""
    });
    const [archivos, setArchivos] = useState([]);
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        cargarComunicados();
    }, []);

    const cargarComunicados = async () => {
        setLoading(true);
        try {
            // Obtener el usuario del localStorage
            const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
            
            if (!usuario.id) {
                toast.error("Usuario no autenticado");
                navigate("/login");
                return;
            }

            const response = await api.get(`/admin/mis-comunicados?usuario_id=${usuario.id}`);

            if (response.status === 200) {
                setComunicados(response.data);
            }

        } catch (err) {
            if (err.response?.status === 403) {
                toast.error("No tienes permisos para ver los comunicados");
            } else if (err.response?.status === 401) {
                toast.error("Sesión expirada. Inicia sesión nuevamente");
                navigate("/login");
            } else {
                toast.error("Error al cargar los comunicados");
            }
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatearFecha = (fechaStr) => {
        const fecha = new Date(fechaStr);
        const opciones = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return fecha.toLocaleDateString('es-ES', opciones);
    };

    const descargarArchivo = (path, nombreOriginal) => {
        const url = `https://sistemainformacion.pythonanywhere.com/uploads/${path}`;
        window.open(url, '_blank');
    };

    const getFileIcon = (fileName) => {
        if (!fileName) return <File className="h-4 w-4" />;
        const ext = fileName.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) {
            return <ImageIcon className="h-4 w-4" />;
        }
        return <File className="h-4 w-4" />;
    };

    const getFileTypeLabel = (extension) => {
        const labels = {
            pdf: 'PDF',
            doc: 'Word',
            docx: 'Word',
            txt: 'Texto',
            jpg: 'Imagen',
            jpeg: 'Imagen',
            png: 'Imagen',
            gif: 'Imagen',
            webp: 'Imagen',
            bmp: 'Imagen',
            svg: 'Imagen'
        };
        return labels[extension?.toLowerCase()] || extension?.toUpperCase();
    };

    const esImagen = (fileName) => {
        if (!fileName) return false;
        const ext = fileName.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext);
    };

    const abrirModal = (comunicado) => {
        setComunicadoSeleccionado(comunicado);
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setMostrarModal(false);
        setComunicadoSeleccionado(null);
    };

    // Funciones para EDITAR
    const abrirModalEditar = (comunicado) => {
        setComunicadoSeleccionado(comunicado);
        setFormData({
            titulo: comunicado.titulo,
            contenido: comunicado.contenido
        });
        setArchivos([]);
        setPreviews(comunicado.archivos || []);
        setModalEditar(true);
    };

    const cerrarModalEditar = () => {
        setModalEditar(false);
        setComunicadoSeleccionado(null);
        setFormData({ titulo: "", contenido: "" });
        setArchivos([]);
        setPreviews([]);
    };

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

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews(prev => [...prev, {
                        name: file.name,
                        type: 'image',
                        url: reader.result,
                        isNew: true
                    }]);
                };
                reader.readAsDataURL(file);
            } else {
                nuevosPreviews.push({
                    name: file.name,
                    type: 'file',
                    url: null,
                    isNew: true
                });
            }
        });

        setArchivos(prev => [...prev, ...nuevosArchivos]);
        
        if (nuevosPreviews.length > 0) {
            setPreviews(prev => [...prev, ...nuevosPreviews]);
        }
    };

    const removeFile = (index) => {
        setArchivos(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleEditar = async (e) => {
        e.preventDefault();

        if (!formData.titulo.trim() || !formData.contenido.trim()) {
            toast.error("Título y contenido son obligatorios");
            return;
        }

        setLoading(true);

        try {
            const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
            
            if (!usuario.id) {
                toast.error("Usuario no autenticado");
                navigate("/login");
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append("titulo", formData.titulo);
            formDataToSend.append("contenido", formData.contenido);
            formDataToSend.append("usuario_id", usuario.id);

            archivos.forEach((archivo) => {
                formDataToSend.append("archivos", archivo);
            });

            const response = await api.put(`/admin/comunicados/${comunicadoSeleccionado.id}`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                toast.success("Comunicado actualizado exitosamente");
                cerrarModalEditar();
                cargarComunicados();
            }
        } catch (error) {
            console.error("Error al actualizar comunicado:", error);
            toast.error(error.response?.data?.error || "Error al actualizar el comunicado");
        } finally {
            setLoading(false);
        }
    };

    // Funciones para ELIMINAR
    const abrirModalEliminar = (comunicado) => {
        setComunicadoSeleccionado(comunicado);
        setModalEliminar(true);
    };

    const cerrarModalEliminar = () => {
        setModalEliminar(false);
        setComunicadoSeleccionado(null);
    };

    const handleEliminar = async () => {
        setLoading(true);

        try {
            const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
            
            if (!usuario.id) {
                toast.error("Usuario no autenticado");
                navigate("/login");
                return;
            }

            const response = await api.delete(`/admin/comunicados/${comunicadoSeleccionado.id}`, {
                data: { usuario_id: usuario.id }
            });

            if (response.status === 200) {
                toast.success("Comunicado eliminado exitosamente");
                cerrarModalEliminar();
                cargarComunicados();
            }
        } catch (error) {
            console.error("Error al eliminar comunicado:", error);
            toast.error(error.response?.data?.error || "Error al eliminar el comunicado");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminHeader>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Mis Comunicados</h1>
                                <div className="h-1 w-24 bg-blue-500 mt-3 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Contenido */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                            <p className="text-gray-600 mt-4">Cargando comunicados...</p>
                        </div>
                    ) : comunicados.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <Inbox className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                No hay comunicados publicados
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Aún no has creado ningún comunicado.
                            </p>

                        </div>
                    ) : (
                        <div className="space-y-4">
                            {comunicados.map((comunicado) => (
                                <div
                                    key={comunicado.id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    {/* Vista compacta */}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                {/* Título */}
                                                <h2 className="text-xl font-bold text-gray-900 mb-2">
                                                    {comunicado.titulo}
                                                </h2>
                                                
                                                {/* Contenido preview */}
                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                    {comunicado.contenido}
                                                </p>

                                                {/* Archivos adjuntos si los hay */}
                                                {comunicado.archivos && comunicado.archivos.length > 0 && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                                        <Download className="h-4 w-4" />
                                                        <span>{comunicado.archivos.length} archivo{comunicado.archivos.length > 1 ? 's' : ''} adjunto{comunicado.archivos.length > 1 ? 's' : ''}</span>
                                                    </div>
                                                )}

                                                {/* Footer info */}
                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{formatearFecha(comunicado.fecha_creacion)}</span>
                                                    </div>
                                                    <span className="text-gray-400">ID: #{comunicado.id}</span>
                                                </div>
                                            </div>

                                            {/* Botón Ver */}
                                            <button
                                                onClick={() => abrirModal(comunicado)}
                                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all shrink-0"
                                            >
                                                Ver
                                            </button>
                                        </div>

                                        {/* Línea separadora azul */}
                                        <div className="h-1 bg-blue-500 mt-4 rounded-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Estadísticas */}
                    {!loading && comunicados.length > 0 && (
                        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Estadísticas</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-blue-600">
                                        {comunicados.length}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Total de comunicados
                                    </p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-green-600">
                                        {comunicados.filter(c => c.archivos && c.archivos.length > 0).length}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Con archivos adjuntos
                                    </p>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-purple-600">
                                        {comunicados.reduce((acc, c) => acc + (c.archivos?.length || 0), 0)}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Total de archivos
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal con detalles completos */}
                {mostrarModal && comunicadoSeleccionado && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
                        onClick={cerrarModal}
                    >
                        <div 
                            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-slideUp"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header del modal */}
                            <div className="bg-white px-6 py-6 border-b border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-3xl font-bold text-gray-900">
                                        {comunicadoSeleccionado.titulo}
                                    </h3>
                                    <button
                                        onClick={cerrarModal}
                                        className="text-gray-500 hover:text-gray-700 p-2 rounded-lg transition-colors"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Contenido del modal */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] bg-gray-50">
                                {/* Contenido completo */}
                                <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
                                    <div className="prose max-w-none">
                                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                            {comunicadoSeleccionado.contenido}
                                        </p>
                                    </div>
                                </div>

                                {/* Archivos adjuntos */}
                                {comunicadoSeleccionado.archivos && comunicadoSeleccionado.archivos.length > 0 && (
                                    <div className="space-y-4">
                                        {comunicadoSeleccionado.archivos.map((archivo, index) => {
                                            const nombreArchivo = archivo.nombre_original || archivo.nombre || 'Archivo sin nombre';
                                            const urlArchivo = `https://sistemainformacion.pythonanywhere.com/docente/uploads/${archivo.path}`;
                                            const esImg = esImagen(nombreArchivo);
                                            
                                            return (
                                                <div key={index}>
                                                    {esImg ? (
                                                        /* Mostrar imagen con diseño limpio */
                                                        <div className="bg-white rounded-lg shadow-sm p-6">
                                                            <img 
                                                                src={urlArchivo} 
                                                                alt={nombreArchivo}
                                                                className="w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                                                onClick={() => descargarArchivo(archivo.path, nombreArchivo)}
                                                            />
                                                        </div>
                                                    ) : (
                                                        /* Mostrar botón para documentos */
                                                        <div className="bg-white rounded-lg shadow-sm">
                                                            <button
                                                                onClick={() => descargarArchivo(archivo.path, nombreArchivo)}
                                                                className="w-full flex items-center justify-between gap-3 p-4 hover:bg-gray-50 transition-all group"
                                                            >
                                                                <div className="flex items-center gap-3 min-w-0">
                                                                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                                                                        {getFileIcon(nombreArchivo)}
                                                                    </div>
                                                                    <div className="text-left min-w-0">
                                                                        <p className="text-sm font-semibold text-gray-700 truncate">
                                                                            {nombreArchivo}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            {getFileTypeLabel(archivo.extension)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2 shrink-0">
                                                                    <ExternalLink className="h-5 w-5 text-blue-600" />
                                                                </div>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Footer con información del docente y fecha */}
                                <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between text-sm text-gray-600 mt-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatearFecha(comunicadoSeleccionado.fecha_creacion)}</span>
                                    </div>
                                    <span className="text-gray-400">ID: #{comunicadoSeleccionado.id}</span>
                                </div>
                            </div>

                            {/* Footer del modal con botones de acción */}
                            <div className="bg-white px-6 py-4 border-t border-gray-200 flex justify-between gap-3">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            cerrarModal();
                                            abrirModalEditar(comunicadoSeleccionado);
                                        }}
                                        className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md flex items-center gap-2"
                                    >
                                        <Edit className="h-5 w-5" />
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => {
                                            cerrarModal();
                                            abrirModalEliminar(comunicadoSeleccionado);
                                        }}
                                        className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md flex items-center gap-2"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                        Eliminar
                                    </button>
                                </div>
                                <button
                                    onClick={cerrarModal}
                                    className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal EDITAR */}
                {modalEditar && comunicadoSeleccionado && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
                        onClick={cerrarModalEditar}
                    >
                        <div 
                            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-slideUp"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Edit className="h-8 w-8" />
                                        <div>
                                            <h3 className="text-2xl font-bold">Editar Comunicado</h3>
                                            <p className="text-green-100 text-sm">ID: #{comunicadoSeleccionado.id}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={cerrarModalEditar}
                                        className="text-white hover:bg-green-600 p-2 rounded-lg transition-colors"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Contenido */}
                            <form onSubmit={handleEditar} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                                <div className="space-y-5">
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                            placeholder="Escribe el título..."
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
                                            rows="8"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                                            placeholder="Escribe el contenido del comunicado..."
                                            required
                                        ></textarea>
                                    </div>

                                    {/* Archivos adjuntos actuales */}
                                    {comunicadoSeleccionado.archivos && comunicadoSeleccionado.archivos.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Archivos actuales
                                            </label>
                                            <div className="space-y-2">
                                                {comunicadoSeleccionado.archivos.map((archivo, index) => (
                                                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                                        {getFileIcon(archivo.nombre_original)}
                                                        <span className="text-sm text-gray-700 flex-1">
                                                            {archivo.nombre_original}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Nota: Los archivos existentes se mantendrán. Los nuevos archivos se añadirán.
                                            </p>
                                        </div>
                                    )}

                                    {/* Subir nuevos archivos */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Agregar más archivos (opcional)
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer">
                                                <Upload className="h-5 w-5 text-green-600" />
                                                <span className="text-sm font-medium text-gray-700">
                                                    Seleccionar archivos
                                                </span>
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    accept="image/*,.pdf,.doc,.docx,.txt"
                                                />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Máximo 10 archivos, 20MB cada uno. Formatos: Imágenes, PDF, Word, TXT.
                                        </p>
                                    </div>

                                    {/* Preview de nuevos archivos */}
                                    {previews.filter(p => p.isNew).length > 0 && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Nuevos archivos a subir
                                            </label>
                                            <div className="space-y-2">
                                                {previews.filter(p => p.isNew).map((preview, index) => (
                                                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                                        {preview.type === 'image' ? (
                                                            <img src={preview.url} alt={preview.name} className="h-12 w-12 rounded object-cover" />
                                                        ) : (
                                                            <File className="h-5 w-5 text-green-600" />
                                                        )}
                                                        <span className="text-sm text-gray-700 flex-1">{preview.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(index)}
                                                            className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </form>

                            {/* Footer */}
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={cerrarModalEditar}
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleEditar}
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-5 w-5" />
                                            Guardar Cambios
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal ELIMINAR */}
                {modalEliminar && comunicadoSeleccionado && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
                        onClick={cerrarModalEliminar}
                    >
                        <div 
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-6 text-white rounded-t-2xl">
                                <div className="flex items-center gap-3">
                                    <Trash2 className="h-8 w-8" />
                                    <div>
                                        <h3 className="text-2xl font-bold">Eliminar Comunicado</h3>
                                        <p className="text-red-100 text-sm">Esta acción no se puede deshacer</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contenido */}
                            <div className="p-6">
                                <p className="text-gray-700 mb-4">
                                    ¿Estás seguro de que deseas eliminar el siguiente comunicado?
                                </p>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <p className="font-semibold text-gray-900 mb-1">
                                        {comunicadoSeleccionado.titulo}
                                    </p>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {comunicadoSeleccionado.contenido}
                                    </p>
                                    {comunicadoSeleccionado.archivos && comunicadoSeleccionado.archivos.length > 0 && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            {comunicadoSeleccionado.archivos.length} archivo(s) adjunto(s)
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex gap-3">
                                <button
                                    onClick={cerrarModalEliminar}
                                    disabled={loading}
                                    className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleEliminar}
                                    disabled={loading}
                                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Eliminando...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-5 w-5" />
                                            Eliminar
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminHeader>
    );
}