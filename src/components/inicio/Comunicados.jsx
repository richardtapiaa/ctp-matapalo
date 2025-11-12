import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import api from "../../axiosConfig";
import { toast } from "sonner";
import { Megaphone, Calendar, BookOpen, File, Image as ImageIcon, FileText, X, ChevronRight, ExternalLink } from "lucide-react";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Comunicados() {
    const [comunicados, setComunicados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [comunicadoSeleccionado, setComunicadoSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: false,
            offset: 50,
            easing: 'ease-out-cubic',
            delay: 100
        });
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
            // Siempre mostrar en hora de Costa Rica
            const fechaStr = fecha.replace(' ', 'T'); const date = new Date(fechaStr);
            if (isNaN(date.getTime())) {
                return 'Fecha desconocida';
            }
            // Opciones para Costa Rica, hora 12h y minúsculas para am/pm
            const opcionesFecha = {
                
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            };
            const opcionesHora = {
                
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            };
            const fechaFormateada = date.toLocaleDateString('es-CR', opcionesFecha);
            let horaFormateada = date.toLocaleTimeString('es-CR', opcionesHora);
            // Convertir AM/PM a minúsculas y con punto
            horaFormateada = horaFormateada.replace('a. m.', 'a.m.').replace('p. m.', 'p.m.').replace('AM', 'a.m.').replace('PM', 'p.m.').replace('a. m.', 'a.m.').replace('p. m.', 'p.m.');
            return `${fechaFormateada}, ${horaFormateada}`;
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
            <div className="min-h-screen bg-gray-50 py-8 md:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Título centrado */}
                    <div className="text-center mb-8 md:mb-12" data-aos="fade-down" data-aos-duration="600">
                        <div className="inline-block">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 px-4 relative">
                                Comunicados
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-full"></div>
                            </h1>
                        </div>
                        <p className="text-gray-600 text-base sm:text-lg md:text-xl px-4 mt-4" data-aos="fade-up" data-aos-delay="200">
                            Consulta los comunicados y anuncios importantes
                        </p>
                    </div>

                    {comunicados.length === 0 ? (
                        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8 sm:p-12 text-center">
                            <Megaphone className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-base sm:text-lg">No hay comunicados publicados</p>
                        </div>
                    ) : (
                        <div className="space-y-8 sm:space-y-10 lg:space-y-12 max-w-4xl mx-auto">
                            {comunicados.map((comunicado) => (
                                <div
                                    key={comunicado.id}
                                    data-aos="fade-up"
                                    data-aos-offset="200"
                                    data-aos-easing="ease-in-sine"
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Vista previa compacta */}
                                    <div className="p-5 sm:p-6 lg:p-8">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex-1 min-w-0">
                                                {/* Título */}
                                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 break-words line-clamp-2">
                                                    {comunicado.titulo}
                                                </h2>
                                                {/* Contenido preview */}
                                                <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-4 break-words line-clamp-3">
                                                    {comunicado.contenido}
                                                </p>
                                                {/* Footer info */}
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 gap-2 border-t-2 border-gray-300 pt-3">
                                                    <span className="break-words font-medium">
                                                        Enviado por: {comunicado.docente_nombre}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 shrink-0" />
                                                        <span className="break-words">
                                                            {formatearFechaPublicacion(comunicado.fecha_creacion)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Botón para abrir */}
                                            <button
                                                onClick={() => abrirModal(comunicado)}
                                                className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all hover:scale-105 w-full sm:w-auto shadow-md"
                                            >
                                                <span>ABRIR ADJUNTO</span>
                                                <ChevronRight className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* CTA: Volver al inicio */}
                    <div className="mt-8 sm:mt-12 flex justify-center">
                        <Link 
                            to="/" 
                            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg shadow-md transition-all hover:scale-105 text-sm sm:text-base"
                        >
                            Volver al inicio
                        </Link>
                    </div>

                    {mostrarModal && comunicadoSeleccionado && (
                        <div 
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4 animate-fadeIn"
                            onClick={cerrarModal}
                        >
                            <div 
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[95vh] overflow-hidden animate-slideUp flex flex-col"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header del modal */}
                                <div className="bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 border-b-2 border-gray-300">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words flex-1">
                                            {comunicadoSeleccionado.titulo}
                                        </h3>
                                        <button
                                            onClick={cerrarModal}
                                            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg transition-colors shrink-0 hover:bg-gray-100"
                                        >
                                            <X className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* Contenido del modal */}
                                <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto flex-1 bg-gray-50">
                                    {/* Contenido completo */}
                                    <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 shadow-sm mb-4 sm:mb-6">
                                        <div className="prose max-w-none">
                                            <p className="text-sm sm:text-base lg:text-lg text-gray-800 whitespace-pre-wrap leading-relaxed break-words">
                                                {comunicadoSeleccionado.contenido}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Archivos adjuntos */}
                                    {comunicadoSeleccionado.archivos && comunicadoSeleccionado.archivos.length > 0 && (
                                        <div className="space-y-3 sm:space-y-4">
                                            {comunicadoSeleccionado.archivos.map((archivo, index) => {
                                                const nombreArchivo = archivo.nombre_original || archivo.nombre || 'Archivo sin nombre';
                                                const urlArchivo = `https://sistemainformacion.pythonanywhere.com/docente/uploads/${archivo.path}`;
                                                const esImg = esImagen(nombreArchivo);
                                                return (
                                                    <div key={index}>
                                                        {esImg ? (
                                                            /* Mostrar imagen con diseño limpio */
                                                            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
                                                                <img 
                                                                    src={urlArchivo} 
                                                                    alt={nombreArchivo}
                                                                    className="w-full max-h-48 sm:max-h-64 lg:max-h-96 object-contain rounded-lg mx-auto"
                                                                />
                                                            </div>
                                                        ) : (
                                                            /* Mostrar botón para documentos */
                                                            <div className="bg-white rounded-lg shadow-sm">
                                                                <button
                                                                    onClick={() => descargarArchivo(archivo.path, nombreArchivo)}
                                                                    className="w-full flex items-center justify-between gap-3 p-3 sm:p-4 lg:p-5 hover:bg-gray-50 transition-all group rounded-lg"
                                                                >
                                                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                                                        <div className="p-2 sm:p-3 bg-gray-100 rounded-lg group-hover:bg-cyan-100 transition-colors shrink-0">
                                                                            {getFileIcon(nombreArchivo)}
                                                                        </div>
                                                                        <div className="text-left min-w-0 flex-1">
                                                                            <p className="text-xs sm:text-sm lg:text-base font-semibold text-gray-700 truncate">
                                                                                {nombreArchivo}
                                                                            </p>
                                                                            <p className="text-xs sm:text-sm text-gray-500">
                                                                                {getFileTypeLabel(nombreArchivo)} - Haz clic para ver
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <ExternalLink className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-600 shrink-0" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Footer con información del docente y fecha */}
                                    <div className="bg-white rounded-lg p-3 sm:p-4 lg:p-5 shadow-sm mt-4 sm:mt-6">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-gray-600 gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium break-words">Enviado por: {comunicadoSeleccionado.docente_nombre}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 shrink-0" />
                                                <span className="break-words">{formatearFechaPublicacion(comunicadoSeleccionado.fecha_creacion)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer del modal con botón cerrar */}
                                <div className="bg-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-t-2 border-gray-300">
                                    <button
                                        onClick={cerrarModal}
                                        className="px-4 sm:px-6 py-2.5 sm:py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md w-full text-sm sm:text-base"
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


