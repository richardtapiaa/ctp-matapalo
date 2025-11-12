import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import api from "../../axiosConfig";
import { toast } from "sonner";
import { Calendar, BookOpen, FileText } from "lucide-react";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Ausencias() {
    const [ausencias, setAusencias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
        cargarAusencias();
    }, []);

    const cargarAusencias = async () => {
        try {
            setLoading(true);
            const response = await api.get('/inicio/ausencias');
            
            const raw = response.data.ausencias || [];
            const sorted = raw.slice().sort((a, b) => {
                const ta = a.fecha_creacion ? Date.parse(a.fecha_creacion) : 0;
                const tb = b.fecha_creacion ? Date.parse(b.fecha_creacion) : 0;
                return tb - ta;
            });
            setAusencias(sorted);
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
        
        
        return fechas.map(fecha => formatearFecha(fecha)).join(', ');
    };

    const formatearFechaPublicacion = (fecha) => {
        if (!fecha) return 'Fecha desconocida';
        try {
           
            const fechaStr = fecha.replace(' ', 'T'); const date = new Date(fechaStr);
            if (isNaN(date.getTime())) {
                return 'Fecha desconocida';
            }
           
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
           
            horaFormateada = horaFormateada.replace('a. m.', 'a.m.').replace('p. m.', 'p.m.').replace('AM', 'a.m.').replace('PM', 'p.m.').replace('a. m.', 'a.m.').replace('p. m.', 'p.m.');
            return `${fechaFormateada}, ${horaFormateada}`;
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
            <div className="min-h-screen bg-gray-50 py-8 md:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Título centrado */}
                    <div className="text-center mb-8 md:mb-12">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 px-4">
                            Ausencias de Docentes
                        </h1>
                        <p className="text-gray-600 text-base sm:text-lg md:text-xl px-4">
                            Consulta las ausencias programadas de los docentes
                        </p>
                    </div>

                    {ausencias.length === 0 ? (
                        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8 sm:p-12 text-center">
                            <Calendar className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-base sm:text-lg">No hay ausencias registradas</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto">
                            {ausencias.map((ausencia) => (
                                <div
                                    key={ausencia.id}
                                    data-aos="fade-right"
                                    data-aos-offset="300"
                                    data-aos-easing="ease-in-sine"
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Header con foto y nombre */}
                                    <div className="p-5 sm:p-7 pb-4 sm:pb-5">
                                        <div className="flex items-center gap-3 mb-4 sm:mb-5">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                                                {ausencia.docente_foto ? (
                                                    <img
                                                        src={`https://sistemainformacion.pythonanywhere.com/uploads/${ausencia.docente_foto}`}
                                                        alt={ausencia.docente_nombre}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                                                        <span className="text-blue-600 font-bold text-base sm:text-lg">
                                                            {ausencia.docente_nombre?.charAt(0)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xs sm:text-sm text-gray-500">
                                                    Detalles de ausencias del docente
                                                </h3>
                                                <p className="font-bold text-gray-900 text-base sm:text-lg truncate">
                                                    {ausencia.docente_nombre}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Información de la ausencia */}
                                        <div className="space-y-4 border-t-2 border-gray-300 pt-4 sm:pt-5">
                                            <div className="flex items-start gap-2">
                                                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs sm:text-sm font-semibold text-gray-700">Materia:</p>
                                                    <p className="text-xs sm:text-sm text-gray-600 break-words">{ausencia.materia_nombre}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2">
                                                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs sm:text-sm font-semibold text-gray-700">Motivo:</p>
                                                    <p className="text-xs sm:text-sm text-gray-600 break-words">{ausencia.motivo}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2">
                                                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs sm:text-sm font-semibold text-gray-700">
                                                        {ausencia.fechas && ausencia.fechas.length > 1 ? 'Días:' : 'Día:'}
                                                    </p>
                                                    {ausencia.fechas && ausencia.fechas.length > 1 ? (
                                                        <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                                                            {ausencia.fechas.map((fecha, index) => (
                                                                <li key={index} className="flex items-start">
                                                                    <span className="mr-1">•</span>
                                                                    <span className="break-words">{formatearFecha(fecha)}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-xs sm:text-sm text-gray-600 break-words">
                                                            {formatearFecha(ausencia.fechas ? ausencia.fechas[0] : ausencia.fecha_ausencia)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer con fecha de publicación */}
                                    <div className="bg-gray-50 px-5 sm:px-7 py-4 border-t-2 border-gray-300">
                                        <p className="text-xs text-gray-500">
                                            Publicado: {formatearFechaPublicacion(ausencia.fecha_creacion)}
                                        </p>
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
                </div>
            </div>
        </div>
    );
}


