import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Megaphone, FileText, Calendar, Plus, ArrowLeft, Inbox, Download, File, Image as ImageIcon, X, ExternalLink, Edit, Trash2 } from "lucide-react";
import DocenteHeader from "./DocenteHeader";
import { api } from "../../axiosConfig";

export default function DocenteVerMisComunicados() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [comunicados, setComunicados] = useState([]);
    const [comunicadoSeleccionado, setComunicadoSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
    const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
    const [formEditar, setFormEditar] = useState({ titulo: '', contenido: '' });
    const [archivosActuales, setArchivosActuales] = useState([]);
    const [archivosNuevos, setArchivosNuevos] = useState([]);
    const [archivosAEliminar, setArchivosAEliminar] = useState([]);
    const [loadingAccion, setLoadingAccion] = useState(false);

    useEffect(() => {
        cargarComunicados();
    }, []);

    const cargarComunicados = async () => {
        setLoading(true);
        try {
            // Obtener el usuario del localStorage
            const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
            const response = await api.get("/docente/mis-comunicados", {
                params: { usuario_id: usuario.id }
            });

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
        const url = `https://sistemainformacion.pythonanywhere.com/docente/uploads/${path}`;
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

    const abrirModalEditar = (comunicado) => {
        setComunicadoSeleccionado(comunicado);
        setFormEditar({
            titulo: comunicado.titulo,
            contenido: comunicado.contenido
        });
        setArchivosActuales(comunicado.archivos || []);
        setArchivosNuevos([]);
        setArchivosAEliminar([]);
        setMostrarModal(false);
        setMostrarModalEditar(true);
    };

    const cerrarModalEditar = () => {
        setMostrarModalEditar(false);
        setFormEditar({ titulo: '', contenido: '' });
        setArchivosActuales([]);
        setArchivosNuevos([]);
        setArchivosAEliminar([]);
    };

    const abrirModalEliminar = (comunicado) => {
        setComunicadoSeleccionado(comunicado);
        setMostrarModal(false);
        setMostrarModalEliminar(true);
    };

    const cerrarModalEliminar = () => {
        setMostrarModalEliminar(false);
        setComunicadoSeleccionado(null);
    };

    const handleEditarChange = (e) => {
        const { name, value } = e.target;
        setFormEditar(prev => ({ ...prev, [name]: value }));
    };

    const handleAgregarArchivos = (e) => {
        const files = Array.from(e.target.files);
        setArchivosNuevos(prev => [...prev, ...files]);
    };

    const handleEliminarArchivoActual = (index) => {
        setArchivosAEliminar(prev => [...prev, index]);
    };

    const handleEliminarArchivoNuevo = (index) => {
        setArchivosNuevos(prev => prev.filter((_, i) => i !== index));
    };

    const handleActualizarComunicado = async () => {
        if (!formEditar.titulo.trim() || !formEditar.contenido.trim()) {
            toast.error("Título y contenido son requeridos");
            return;
        }

        setLoadingAccion(true);
        try {
            const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
            
            const formData = new FormData();
            formData.append('usuario_id', usuario.id);
            formData.append('titulo', formEditar.titulo);
            formData.append('contenido', formEditar.contenido);
            
            // Agregar índices de archivos a eliminar
            if (archivosAEliminar.length > 0) {
                formData.append('archivos_eliminar', archivosAEliminar.join(','));
            }
            
            // Agregar nuevos archivos
            archivosNuevos.forEach((file) => {
                formData.append('archivos', file);
            });
            
            const response = await api.put(
                `/docente/comunicados/${comunicadoSeleccionado.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.status === 200) {
                toast.success("Comunicado actualizado exitosamente");
                cerrarModalEditar();
                cargarComunicados();
            }
        } catch (error) {
            toast.error("Error al actualizar el comunicado");
            console.error(error);
        } finally {
            setLoadingAccion(false);
        }
    };

    const handleEliminarComunicado = async () => {
        setLoadingAccion(true);
        try {
            const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
            
            const response = await api.delete(
                `/docente/comunicados/${comunicadoSeleccionado.id}`,
                {
                    params: { usuario_id: usuario.id }
                }
            );

            if (response.status === 200) {
                toast.success("Comunicado eliminado exitosamente");
                cerrarModalEliminar();
                cargarComunicados();
            }
        } catch (error) {
            toast.error("Error al eliminar el comunicado");
            console.error(error);
        } finally {
            setLoadingAccion(false);
        }
    };

    return (
        <DocenteHeader>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Mis Comunicados</h1>
                                <div className="h-1 w-24 bg-yellow-500 mt-3 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Contenido */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
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
                                                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-all shrink-0"
                                            >
                                                Ver
                                            </button>
                                        </div>

                                        {/* Línea separadora amarilla */}
                                        <div className="h-1 bg-yellow-500 mt-4 rounded-full"></div>
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
                                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-yellow-600">
                                        {comunicados.length}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Total de comunicados
                                    </p>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-blue-600">
                                        {comunicados.filter(c => c.archivos && c.archivos.length > 0).length}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Con archivos adjuntos
                                    </p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-green-600">
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
                                                                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-yellow-100 transition-colors">
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
                                                                    <ExternalLink className="h-5 w-5 text-yellow-600" />
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

                            {/* Footer del modal con botón cerrar */}
                            <div className="bg-white px-6 py-4 border-t border-gray-200 flex gap-3">
                                <button
                                    onClick={() => abrirModalEditar(comunicadoSeleccionado)}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md"
                                >
                                    <Edit className="h-5 w-5" />
                                    Editar
                                </button>
                                <button
                                    onClick={() => abrirModalEliminar(comunicadoSeleccionado)}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md"
                                >
                                    <Trash2 className="h-5 w-5" />
                                    Eliminar
                                </button>
                                <button
                                    onClick={cerrarModal}
                                    className="flex-1 px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Editar */}
                {mostrarModalEditar && comunicadoSeleccionado && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
                        onClick={cerrarModalEditar}
                    >
                        <div 
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slideUp"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-white px-6 py-5 border-b-2 border-gray-300">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-gray-900">Editar Comunicado</h3>
                                    <button
                                        onClick={cerrarModalEditar}
                                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Contenido */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                                <div className="space-y-4">
                                    {/* Título */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Título *
                                        </label>
                                        <input
                                            type="text"
                                            name="titulo"
                                            value={formEditar.titulo}
                                            onChange={handleEditarChange}
                                            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Título del comunicado"
                                        />
                                    </div>

                                    {/* Contenido */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Contenido *
                                        </label>
                                        <textarea
                                            name="contenido"
                                            value={formEditar.contenido}
                                            onChange={handleEditarChange}
                                            rows="8"
                                            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Contenido del comunicado"
                                        />
                                    </div>

                                    {/* Archivos Actuales */}
                                    {archivosActuales.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Archivos Actuales
                                            </label>
                                            <div className="space-y-2">
                                                {archivosActuales.map((archivo, index) => {
                                                    if (archivosAEliminar.includes(index)) return null;
                                                    return (
                                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                {getFileIcon(archivo.nombre_original)}
                                                                <span className="text-sm text-gray-700 truncate">
                                                                    {archivo.nombre_original || 'Archivo'}
                                                                </span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleEliminarArchivoActual(index)}
                                                                className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Nuevos Archivos */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Agregar Nuevos Archivos
                                        </label>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleAgregarArchivos}
                                            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {archivosNuevos.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                {archivosNuevos.map((file, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                                            <File className="h-4 w-4 text-blue-600" />
                                                            <span className="text-sm text-gray-700 truncate">
                                                                {file.name}
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEliminarArchivoNuevo(index)}
                                                            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Nota sobre archivos */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm text-blue-800">
                                            <strong>Nota:</strong> Puedes eliminar archivos existentes y agregar nuevos. Los cambios se guardarán al confirmar.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="bg-white px-6 py-4 border-t-2 border-gray-300 flex gap-3">
                                <button
                                    onClick={cerrarModalEditar}
                                    className="flex-1 px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                                    disabled={loadingAccion}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleActualizarComunicado}
                                    disabled={loadingAccion}
                                    className={`flex-1 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg transition-all shadow-md ${
                                        loadingAccion 
                                            ? 'opacity-60 cursor-not-allowed' 
                                            : 'hover:bg-blue-700 transform hover:scale-105'
                                    }`}
                                >
                                    {loadingAccion ? "Guardando..." : "Guardar Cambios"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Confirmación de Eliminación */}
                {mostrarModalEliminar && comunicadoSeleccionado && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
                        onClick={cerrarModalEliminar}
                    >
                        <div 
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-white px-6 py-5 border-b-2 border-gray-300">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-gray-900">Confirmar Eliminación</h3>
                                    <button
                                        onClick={cerrarModalEliminar}
                                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Contenido */}
                            <div className="p-6">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="bg-red-100 rounded-full p-4">
                                        <Trash2 className="h-12 w-12 text-red-600" />
                                    </div>
                                </div>
                                <p className="text-center text-gray-700 mb-2">
                                    ¿Estás seguro de que deseas eliminar este comunicado?
                                </p>
                                <p className="text-center text-sm text-gray-500 mb-4">
                                    <strong>"{comunicadoSeleccionado.titulo}"</strong>
                                </p>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-sm text-red-800">
                                        <strong>Advertencia:</strong> Esta acción no se puede deshacer. El comunicado y todos sus archivos adjuntos serán eliminados permanentemente.
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="bg-white px-6 py-4 border-t-2 border-gray-300 flex gap-3">
                                <button
                                    onClick={cerrarModalEliminar}
                                    className="flex-1 px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                                    disabled={loadingAccion}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleEliminarComunicado}
                                    disabled={loadingAccion}
                                    className={`flex-1 px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg transition-all shadow-md ${
                                        loadingAccion 
                                            ? 'opacity-60 cursor-not-allowed' 
                                            : 'hover:bg-red-700 transform hover:scale-105'
                                    }`}
                                >
                                    {loadingAccion ? "Eliminando..." : "Eliminar"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DocenteHeader>
    );
}
