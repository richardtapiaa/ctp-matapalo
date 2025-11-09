import { useEffect, useState } from "react";
import Header from "./Header";
import api from "../../axiosConfig";
import { toast } from "sonner";
import { Calendar, BookOpen, FileText } from "lucide-react";

export default function Ausencias() {
    const [ausencias, setAusencias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarAusencias();
    }, []);

    const cargarAusencias = async () => {
        try {
            setLoading(true);
            const response = await api.get('/inicio/ausencias');
            setAusencias(response.data.ausencias);
        } catch (error) {
            console.error("Error al cargar ausencias:", error);
            toast.error("Error al cargar las ausencias");
        } finally {
            setLoading(false);
        }
    };

    const formatearFecha = (fecha) => {
        const date = new Date(fecha + 'T00:00:00');
        return date.toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
    };

    const formatearFechas = (fechas) => {
        if (!fechas || fechas.length === 0) return 'Sin fecha';
        
        if (fechas.length === 1) {
            return formatearFecha(fechas[0]);
        }
        
        // Para múltiples fechas
        return fechas.map(fecha => formatearFecha(fecha)).join(', ');
    };

    const formatearFechaPublicacion = (fecha) => {
        if (!fecha) return 'Fecha desconocida';
        
        try {
            const date = new Date(fecha);
            
            // Verificar si es una fecha válida
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Ausencias de Docentes</h1>
                    <p className="text-gray-600 text-lg mb-8">
                        Consulta las ausencias programadas de los docentes
                    </p>

                    {ausencias.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No hay ausencias registradas</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {ausencias.map((ausencia) => (
                                <div
                                    key={ausencia.id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    {/* Header con foto y nombre */}
                                    <div className="p-6 pb-4">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                                                {ausencia.docente_foto ? (
                                                    <img
                                                        src={`https://sistemainformacion.pythonanywhere.com/uploads/${ausencia.docente_foto}`}
                                                        alt={ausencia.docente_nombre}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                                                        <span className="text-blue-600 font-bold text-lg">
                                                            {ausencia.docente_nombre?.charAt(0)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm text-gray-500">
                                                    Detalles de ausencias del docente
                                                </h3>
                                                <p className="font-bold text-gray-900 text-lg truncate">
                                                    {ausencia.docente_nombre}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Información de la ausencia */}
                                        <div className="space-y-3 border-t border-gray-300 pt-4">
                                            <div className="flex items-start gap-2">
                                                <BookOpen className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-700">Materia:</p>
                                                    <p className="text-sm text-gray-600">{ausencia.materia_nombre}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2">
                                                <FileText className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-700">Motivo:</p>
                                                    <p className="text-sm text-gray-600 break-words">{ausencia.motivo}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2">
                                                <Calendar className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-gray-700">
                                                        {ausencia.fechas && ausencia.fechas.length > 1 ? 'Días:' : 'Día:'}
                                                    </p>
                                                    {ausencia.fechas && ausencia.fechas.length > 1 ? (
                                                        <ul className="text-sm text-gray-600 space-y-1">
                                                            {ausencia.fechas.map((fecha, index) => (
                                                                <li key={index} className="flex items-start">
                                                                    <span className="mr-1">•</span>
                                                                    <span>{formatearFecha(fecha)}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-sm text-gray-600">
                                                            {formatearFecha(ausencia.fechas ? ausencia.fechas[0] : ausencia.fecha_ausencia)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer con fecha de publicación */}
                                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-300">
                                        <p className="text-xs text-gray-500">
                                            Publicado: {formatearFechaPublicacion(ausencia.fecha_creacion)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
