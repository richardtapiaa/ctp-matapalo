import { useEffect, useState } from "react";
import Header from "./Header";
import api from "../../axiosConfig";
import { toast } from "sonner";
import { Megaphone, Calendar, BookOpen, File, Image as ImageIcon, FileText, X, ChevronRight, ExternalLink } from "lucide-react";

export default function Comunicados() {
    const [comunicados, setComunicados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [comunicadoSeleccionado, setComunicadoSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        cargarComunicados();
    }, []);

    const cargarComunicados = async () => {
        try {
            setLoading(true);
            const response = await api.get('/inicio/comunicados');
            setComunicados(response.data.comunicados);
        } catch (error) {
            toast.error("Error al cargar los comunicados");
        } finally {
            setLoading(false);
        }
    };

    const formatearFechaPublicacion = (fecha) => {
        if (!fecha) return 'Fecha desconocida';
        
        try {
            const date = new Date(fecha);
            
            if (isNaN(date.getTime())) {
                return 'Fecha desconocida';
            }
            
            return date.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }) + ' a las ' + date.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return 'Fecha desconocida';
        }
    };

    const descargarArchivo = (path, nombreOriginal) => {
        const url = `https://sistemainformacion.pythonanywhere.com/docente/uploads/${path}`;
        // Abrir en nueva pestaña sin forzar descarga
        window.open(url, '_blank');
    };

    const getFileIcon = (fileName) => {
        if (!fileName) return <File className="h-4 w-4" />;
        const ext = fileName.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) {
            return <ImageIcon className="h-4 w-4" />;
        } else if (['pdf'].includes(ext)) {
            return <FileText className="h-4 w-4" />;
        }
        return <File className="h-4 w-4" />;
    };

    const getFileTypeLabel = (fileName) => {
        if (!fileName) return 'Archivo';
        const ext = fileName.split('.').pop().toLowerCase();
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
        return labels[ext] || ext.toUpperCase();
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

    if (loading) {
        return (
            <div>
                <Header />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Comunicados</h1>
                    <p className="text-gray-600 text-lg mb-8">
                        Consulta los comunicados y anuncios importantes
                    </p>

                    {comunicados.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <Megaphone className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No hay comunicados publicados</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {comunicados.map((comunicado) => (
                                <div
                                    key={comunicado.id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    {/* Vista previa compacta */}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                {/* Título */}
                                                <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                                    {comunicado.titulo}
                                                </h2>
                                                
                                                {/* Contenido preview */}
                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                    {comunicado.contenido}
                                                </p>

                                                {/* Footer info */}
                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <span>
                                                        {formatearFechaPublicacion(comunicado.fecha_creacion)}
                                                    </span>
                                                    <span>
                                                        Enviado por: {comunicado.docente_nombre}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Botón para abrir */}
                                            <button
                                                onClick={() => abrirModal(comunicado)}
                                                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all shrink-0"
                                            >
                                                ABRIR ADJUNTO
                                                <ChevronRight className="h-5 w-5" />
                                            </button>
                                        </div>

                                        {/* Línea separadora azul */}
                                        <div className="h-1 bg-cyan-500 mt-4 rounded-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    
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
                                                                    className="w-full rounded-lg"
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
                                                                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-cyan-100 transition-colors">
                                                                            {getFileIcon(nombreArchivo)}
                                                                        </div>
                                                                        <div className="text-left min-w-0">
                                                                            <p className="text-sm font-semibold text-gray-700 truncate">
                                                                                {nombreArchivo}
                                                                            </p>
                                                                            <p className="text-xs text-gray-500">
                                                                                {getFileTypeLabel(nombreArchivo)} - Haz clic para ver
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 shrink-0">
                                                                        <ExternalLink className="h-5 w-5 text-cyan-600" />
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
                                    <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between text-sm text-gray-600">
                                        <div>
                                            <span className="font-medium">Enviado por: {comunicadoSeleccionado.docente_nombre}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>{formatearFechaPublicacion(comunicadoSeleccionado.fecha_creacion)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer del modal con botón cerrar */}
                                <div className="bg-white px-6 py-4 border-t border-gray-200 flex justify-end">
                                    <button
                                        onClick={cerrarModal}
                                        className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
