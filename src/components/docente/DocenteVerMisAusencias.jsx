import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Calendar, FileText, MessageSquare, Plus, ArrowLeft, Inbox } from "lucide-react";
import DocenteHeader from "./DocenteHeader";
import { api } from "../../axiosConfig";

export default function DocenteVerMisAusencias() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [ausencias, setAusencias] = useState([]);

    useEffect(() => {
        cargarAusencias();
    }, []);

    const cargarAusencias = async () => {
        setLoading(true);
        try {
            // Obtener el usuario del localStorage
            const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
            
            if (!usuario.id) {
                toast.error("Usuario no autenticado");
                navigate("/login");
                return;
            }

            const response = await api.get("/docente/mis-ausencias", {
                params: { usuario_id: usuario.id }
            });

            if (response.status === 200) {
                setAusencias(response.data);
            }

        } catch (err) {
            if (err.response?.status === 403) {
                toast.error("No tienes permisos para ver las ausencias");
            } else if (err.response?.status === 401) {
                toast.error("Sesión expirada. Inicia sesión nuevamente");
                navigate("/login");
            } else {
                toast.error("Error al cargar las ausencias");
            }
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatearFecha = (fecha) => {
        const date = new Date(fecha + 'T00:00:00');
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('es-ES', opciones);
    };

    const formatearFechaCreacion = (fecha) => {
        if (!fecha) return 'Fecha desconocida';
        
        try {
            const date = new Date(fecha);
            if (isNaN(date.getTime())) return 'Fecha desconocida';
            
            return date.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (error) {
            return 'Fecha desconocida';
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
                                <h1 className="text-3xl font-bold text-gray-900">Ausencias por usted:</h1>
                                <div className="h-1 w-24 bg-yellow-500 mt-3 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Contenido */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                            <p className="text-gray-600 mt-4">Cargando ausencias...</p>
                        </div>
                    ) : ausencias.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <Inbox className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                No hay ausencias registradas
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Aún no has registrado ninguna ausencia.
                            </p>
                            <button
                                onClick={() => navigate("/docente/crear-ausencia")}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg shadow-md transition-all active:scale-95"
                            >
                                <Plus className="h-5 w-5" />
                                Registrar Primera Ausencia
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {ausencias.map((ausencia) => (
                                <div
                                    key={ausencia.id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    {/* Contenido */}
                                    <div className="p-6 pb-4">
                                        <div className="mb-4">
                                            <h3 className="text-sm text-gray-500">
                                                Detalles de tu ausencia
                                            </h3>

                                        </div>

                                        {/* Información de la ausencia */}
                                        <div className="space-y-3 border-t border-gray-300 pt-4">
                                            <div className="flex items-start gap-2">
                                                <FileText className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-700">Motivo:</p>
                                                    <p className="text-sm text-gray-600 break-words">{ausencia.motivo}</p>
                                                </div>
                                            </div>

                                            {ausencia.observaciones && (
                                                <div className="flex items-start gap-2">
                                                    <MessageSquare className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-700">Observaciones:</p>
                                                        <p className="text-sm text-gray-600 break-words">{ausencia.observaciones}</p>
                                                    </div>
                                                </div>
                                            )}

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

                                    {/* Footer con fecha de creación */}
                                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-300">
                                        <p className="text-xs text-gray-500">
                                            Registrada: {formatearFechaCreacion(ausencia.fecha_creacion)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Estadísticas */}
                    {!loading && ausencias.length > 0 && (
                        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Estadísticas</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-yellow-600">
                                        {ausencias.length}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Total de ausencias
                                    </p>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-blue-600">
                                        {new Date().getFullYear()}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Año actual
                                    </p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-green-600">
                                        {ausencias.filter(a => a.observaciones).length}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Con observaciones
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DocenteHeader>
    );
}
