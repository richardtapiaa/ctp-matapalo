import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import api from "../../axiosConfig";
import { toast } from "sonner";
import { ArrowLeft, User, Mail, Calendar, FileText, Megaphone, CalendarClock, Download, File, Image as ImageIcon } from "lucide-react";

export default function AdminDocenteDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("ausencias"); // "ausencias" o "comunicados"
    const [docente, setDocente] = useState(null);
    const [ausencias, setAusencias] = useState([]);
    const [comunicados, setComunicados] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            
            // Cargar ausencias
            const ausenciasRes = await api.get(`/admin/docentes/${id}/ausencias`);
            setAusencias(ausenciasRes.data.ausencias);
            setDocente(ausenciasRes.data.docente);
            
            // Cargar comunicados
            const comunicadosRes = await api.get(`/admin/docentes/${id}/comunicados`);
            setComunicados(comunicadosRes.data.comunicados);
            
        } catch (error) {
            console.error("Error al cargar datos:", error);
            toast.error("Error al cargar la información del docente");
            navigate("/admin/usuarios");
        } finally {
            setLoading(false);
        }
    };

    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatearFechaHora = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const descargarArchivo = (path, nombre) => {
        const url = `https://sistemainformacion.pythonanywhere.com/uploads/${path}`;
        const link = document.createElement('a');
        link.href = url;
        link.download = nombre;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Descargando ${nombre}`);
    };

    if (loading) {
        return (
            <AdminHeader>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </AdminHeader>
        );
    }

    return (
        <AdminHeader>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Botón volver */}
                    <button
                        onClick={() => navigate("/admin/usuarios")}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Volver a usuarios
                    </button>

                    {/* Perfil del docente */}
                    <div className="bg-white rounded-xl shadow-md p-8 mb-6">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-500 mb-4 overflow-hidden">
                                {docente?.foto_perfil ? (
                                    <img
                                        src={`https://sistemainformacion.pythonanywhere.com/uploads/${docente.foto_perfil}`}
                                        alt={docente.nombre}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="h-12 w-12 text-blue-600" />
                                )}
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{docente?.nombre}</h1>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="h-4 w-4" />
                                <span className="text-sm">{docente?.email}</span>
                            </div>
                        </div>

                        {/* Estadísticas */}
                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <CalendarClock className="h-5 w-5 text-blue-600" />
                                    <p className="text-2xl font-bold text-gray-900">{ausencias.length}</p>
                                </div>
                                <p className="text-sm text-gray-600">Ausencias</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Megaphone className="h-5 w-5 text-blue-600" />
                                    <p className="text-2xl font-bold text-gray-900">{comunicados.length}</p>
                                </div>
                                <p className="text-sm text-gray-600">Comunicados</p>
                            </div>
                        </div>
                    </div>

                    {/* Ausencias */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <CalendarClock className="h-7 w-7 text-blue-600" />
                            Este Docete se ausento: 
                        </h2>
                        
                        {ausencias.length === 0 ? (
                            <div className="text-center py-12">
                                <CalendarClock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">Este docente no tiene ausencias registradas</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {ausencias.map((ausencia) => (
                                    <div
                                        key={ausencia.id}
                                        className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-blue-300 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
 
                                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{formatearFecha(ausencia.fecha_ausencia)}</span>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                                ID: {ausencia.id}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 mb-3">
                                            <span className="font-semibold">Motivo:</span> {ausencia.motivo}
                                        </p>
                                        {ausencia.observaciones && (
                                            <p className="text-gray-600 text-sm">
                                                <span className="font-semibold">Observaciones:</span> {ausencia.observaciones}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Comunicados */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <Megaphone className="h-7 w-7 text-blue-600" />
                            Comunicados publicados por el docente:
                        </h2>
                        
                        {comunicados.length === 0 ? (
                            <div className="text-center py-12">
                                <Megaphone className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">Este docente no tiene comunicados publicados</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {comunicados.map((comunicado) => (
                                    <div
                                        key={comunicado.id}
                                        className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors"
                                    >
                                        {/* Header */}
                                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                                            <h3 className="text-lg font-bold mb-2">{comunicado.titulo}</h3>
                                            <div className="flex items-center gap-2 text-blue-100 text-sm">
                                                <Calendar className="h-4 w-4" />
                                                <span>{formatearFechaHora(comunicado.fecha_creacion)}</span>
                                            </div>
                                        </div>

                                        {/* Contenido */}
                                        <div className="p-5">
                                            <p className="text-gray-700 mb-4 whitespace-pre-line">
                                                {comunicado.contenido}
                                            </p>

                                            {/* Archivos adjuntos */}
                                            {comunicado.archivos && comunicado.archivos.length > 0 && (
                                                <div className="border-t border-gray-200 pt-4">
                                                    <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-blue-600" />
                                                        Archivos adjuntos ({comunicado.archivos.length})
                                                    </p>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {comunicado.archivos.map((archivo, index) => (
                                                            <button
                                                                key={index}
                                                                onClick={() => descargarArchivo(archivo.path, archivo.nombre)}
                                                                className="flex items-center gap-3 p-3 bg-white hover:bg-blue-50 rounded-lg transition-colors text-left group border border-gray-200"
                                                            >
                                                                {archivo.tipo === 'imagen' ? (
                                                                    <ImageIcon className="h-5 w-5 text-blue-600 shrink-0" />
                                                                ) : (
                                                                    <File className="h-5 w-5 text-blue-600 shrink-0" />
                                                                )}
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                                        {archivo.nombre}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {archivo.tipo} • {(archivo.size / 1024).toFixed(2)} KB
                                                                    </p>
                                                                </div>
                                                                <Download className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors shrink-0" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <p className="text-xs text-gray-500">ID: {comunicado.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminHeader>
    );
}
