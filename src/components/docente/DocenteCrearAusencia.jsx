import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Calendar, FileText, MessageSquare, Save, ArrowLeft, Plus, X } from "lucide-react";
import DocenteHeader from "./DocenteHeader";
import { api } from "../../axiosConfig";

export default function DocenteCrearAusencia() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        motivo: "",
        observaciones: ""
    });
    const [fechas, setFechas] = useState([""]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
    const [fechaPrincipal, setFechaPrincipal] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFechaPrincipalChange = (value) => {
        setFechaPrincipal(value);
        // Actualizar la primera fecha del array
        const nuevasFechas = [...fechas];
        nuevasFechas[0] = value;
        setFechas(nuevasFechas);
    };

    const handleFechaChange = (index, value) => {
        const nuevasFechas = [...fechas];
        nuevasFechas[index] = value;
        setFechas(nuevasFechas);
    };

    const agregarFecha = () => {
        setFechas([...fechas, ""]);
    };

    const eliminarFecha = (index) => {
        if (fechas.length > 1) {
            const nuevasFechas = fechas.filter((_, i) => i !== index);
            setFechas(nuevasFechas);
        }
    };

    const abrirModal = () => {
        if (!fechaPrincipal) {
            toast.error("Por favor selecciona primero una fecha");
            return;
        }
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setMostrarModal(false);
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        const date = new Date(fecha + 'T00:00:00');
        return date.toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
    };

    const abrirModalConfirmacion = (e) => {
        e.preventDefault();
        
        // Validaciones
        if (!formData.motivo.trim()) {
            toast.error("El motivo es requerido");
            return;
        }
        
        // Validar que hay al menos una fecha
        const fechasValidas = fechas.filter(f => f.trim() !== "");
        if (fechasValidas.length === 0) {
            toast.error("Debes agregar al menos una fecha");
            return;
        }

        setMostrarModalConfirmacion(true);
    };

    const cerrarModalConfirmacion = () => {
        setMostrarModalConfirmacion(false);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        // Cerrar modal de confirmación
        setMostrarModalConfirmacion(false);
        
        // Validaciones
        if (!formData.motivo.trim()) {
            toast.error("El motivo es requerido");
            return;
        }
        
        // Validar que hay al menos una fecha
        const fechasValidas = fechas.filter(f => f.trim() !== "");
        if (fechasValidas.length === 0) {
            toast.error("Debes agregar al menos una fecha");
            return;
        }

        setLoading(true);

        try {
            // Obtener el usuario del localStorage
            const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
            
            if (!usuario.id) {
                toast.error("Usuario no autenticado");
                navigate("/login");
                return;
            }

            // Enviar una sola ausencia con múltiples fechas
            const response = await api.post("/docente/ausencias", {
                usuario_id: usuario.id,
                motivo: formData.motivo,
                fechas: fechasValidas,  // Enviar array de fechas
                observaciones: formData.observaciones
            });

            if (response.status === 201) {
                const numFechas = fechasValidas.length;
                toast.success(`¡Ausencia registrada exitosamente con ${numFechas} fecha${numFechas > 1 ? 's' : ''}!`);
                
                // Limpiar formulario
                setFormData({
                    motivo: "",
                    observaciones: ""
                });
                setFechas([""]);
                setFechaPrincipal("");

                // Redirigir después de 1.5 segundos
                setTimeout(() => {
                    navigate("/docente/mis-ausencias");
                }, 1500);
            }

        } catch (err) {
            if (err.response?.status === 403) {
                toast.error("No tienes permisos para registrar ausencias");
            } else if (err.response?.status === 401) {
                toast.error("Sesión expirada. Inicia sesión nuevamente");
                navigate("/login");
            } else {
                toast.error("Error al registrar la ausencia. Inténtalo de nuevo");
            }
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DocenteHeader>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Registrar Ausencia</h1>
                        <div className="h-1 w-24 bg-yellow-500 mt-3 rounded-full"></div>
                    </div>

                    {/* Formulario */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <form onSubmit={abrirModalConfirmacion} className="space-y-6">
                            {/* Motivo */}
                            <div>
                                <label htmlFor="motivo" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <FileText className="h-4 w-4" />
                                    Motivo de la ausencia *
                                </label>
                                <input
                                    type="text"
                                    id="motivo"
                                    name="motivo"
                                    value={formData.motivo}
                                    onChange={handleChange}
                                    
                                    required
                                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                />
                            </div>

                            {/* Fecha */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Calendar className="h-4 w-4" />
                                    Fecha de la ausencia *
                                </label>
                                <input
                                    type="date"
                                    value={fechaPrincipal}
                                    onChange={(e) => handleFechaPrincipalChange(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                />
                                
                                {fechaPrincipal && (
                                    <button
                                        type="button"
                                        onClick={abrirModal}
                                        className="mt-3 flex items-center gap-2 px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-all transform hover:scale-105"
                                    >
                                        <Plus className="h-4 w-4" />
                                        ¿Deseas agregar más fechas?
                                    </button>
                                )}

                                {fechas.length > 1 && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-sm font-semibold text-gray-700 mb-2">
                                            Fechas adicionales seleccionadas:
                                        </p>
                                        <ul className="space-y-1">
                                            {fechas.slice(1).map((fecha, index) => (
                                                <li key={index} className="text-sm text-gray-600">
                                                    • {fecha ? new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', { 
                                                        weekday: 'long', 
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                    }) : 'Sin fecha'}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Observaciones */}
                            <div>
                                <label htmlFor="observaciones" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <MessageSquare className="h-4 w-4" />
                                    Observaciones (opcional)
                                </label>
                                <textarea
                                    id="observaciones"
                                    name="observaciones"
                                    value={formData.observaciones}
                                    onChange={handleChange}
                                    
                                    rows="4"
                                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition resize-none"
                                />
                            </div>

                            {/* Botones */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 bg-yellow-500 text-gray-900 font-semibold text-base rounded-lg shadow-md transition-all ${
                                        loading 
                                            ? 'opacity-60 cursor-not-allowed' 
                                            : 'hover:bg-yellow-600 hover:shadow-lg active:scale-95'
                                    }`}
                                >
                                    <Save className="h-5 w-5" />
                                    {loading ? "Guardando..." : "Registrar Ausencia"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/docente")}
                                    disabled={loading}
                                    className="flex-1 py-3.5 bg-gray-200 text-gray-700 font-semibold text-base rounded-lg hover:bg-gray-300 transition-all active:scale-95"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Información adicional */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Nota:</strong> Los campos marcados con * son obligatorios. 
                            Puedes agregar múltiples fechas para la misma ausencia.                         
                        </p>
                    </div>
                </div>

                {/* Modal para agregar más fechas */}
                {mostrarModal && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
                        onClick={cerrarModal}
                    >
                        <div 
                            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden animate-slideUp"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header del modal */}
                            <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Calendar className="h-6 w-6 text-white" />
                                    Agregar más fechas
                                </h3>
                                <button
                                    onClick={cerrarModal}
                                    className="text-white hover:bg-gray-700 p-2 rounded-lg transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Contenido del modal */}
                            <div className="p-6 overflow-y-auto max-h-96">
                                <p className="text-gray-600 mb-4">
                                    Selecciona las fechas adicionales para tu ausencia:
                                </p>
                                <div className="space-y-3">
                                    {fechas.slice(1).map((fecha, index) => (
                                        <div key={index} className="flex items-center gap-2 animate-fadeIn">
                                            <input
                                                type="date"
                                                value={fecha}
                                                onChange={(e) => handleFechaChange(index + 1, e.target.value)}
                                                className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => eliminarFecha(index + 1)}
                                                className="p-3 text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="Eliminar fecha"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={agregarFecha}
                                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-800 bg-gray-100 border-2 border-gray-200 rounded-lg hover:bg-gray-200 transition-all transform hover:scale-105"
                                >
                                    <Plus className="h-5 w-5" />
                                    Agregar otra fecha
                                </button>
                            </div>

                            {/* Footer del modal */}
                            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                                <button
                                    onClick={cerrarModal}
                                    className="px-6 py-2.5 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all transform hover:scale-105 shadow-md"
                                >
                                    Listo
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de confirmación */}
                {mostrarModalConfirmacion && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
                        onClick={cerrarModalConfirmacion}
                    >
                        <div 
                            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-slideUp"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header del modal */}
                            <div className="bg-white px-6 py-5 flex items-center justify-between border-b-2 border-gray-300">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Confirmar Ausencia
                                </h3>
                                <button
                                    onClick={cerrarModalConfirmacion}
                                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Contenido del modal - Card de preview */}
                            <div className="p-6">
                                <p className="text-gray-600 mb-4">
                                    Revisa los detalles de tu ausencia:
                                </p>

                                {/* Card de la ausencia */}
                                <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-gray-300">
                                    {/* Contenido */}
                                    <div className="p-5 sm:p-7 pb-4 sm:pb-5">
                                        <div className="mb-4 sm:mb-5">
                                            <h3 className="text-xs sm:text-sm text-gray-500">
                                                Detalles de tu ausencia
                                            </h3>
                                            <p className="font-bold text-gray-900 text-base sm:text-lg">
                                                {JSON.parse(localStorage.getItem("usuario") || "{}").nombre || "Docente"}
                                            </p>
                                        </div>

                                        {/* Información de la ausencia */}
                                        <div className="space-y-4 border-t-2 border-gray-300 pt-4 sm:pt-5">
                                            <div className="flex items-start gap-2">
                                                <FileText className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-700">Motivo:</p>
                                                    <p className="text-sm text-gray-600 break-words">{formData.motivo}</p>
                                                </div>
                                            </div>

                                            {formData.observaciones && (
                                                <div className="flex items-start gap-2">
                                                    <MessageSquare className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-700">Observaciones:</p>
                                                        <p className="text-sm text-gray-600 break-words">{formData.observaciones}</p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-start gap-2">
                                                <Calendar className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-gray-700">
                                                        {fechas.filter(f => f.trim() !== "").length > 1 ? 'Días:' : 'Día:'}
                                                    </p>
                                                    {fechas.filter(f => f.trim() !== "").length > 1 ? (
                                                        <ul className="text-sm text-gray-600 space-y-1">
                                                            {fechas.filter(f => f.trim() !== "").map((fecha, index) => (
                                                                <li key={index} className="flex items-start">
                                                                    <span className="mr-1">•</span>
                                                                    <span>{formatearFecha(fecha)}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-sm text-gray-600">
                                                            {formatearFecha(fechas.find(f => f.trim() !== ""))}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="bg-gray-50 px-5 sm:px-7 py-4 border-t-2 border-gray-300">
                                        <p className="text-xs text-gray-500">
                                            Esta ausencia será registrada inmediatamente al confirmar.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer del modal con botones */}
                            <div className="bg-white px-6 py-4 flex gap-3 border-t-2 border-gray-300">
                                <button
                                    onClick={cerrarModalConfirmacion}
                                    className="flex-1 px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className={`flex-1 px-6 py-2.5 bg-cyan-500 text-white font-semibold rounded-lg transition-all shadow-md ${
                                        loading 
                                            ? 'opacity-60 cursor-not-allowed' 
                                            : 'hover:bg-cyan-600 transform hover:scale-105'
                                    }`}
                                >
                                    {loading ? "Guardando..." : "Confirmar"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DocenteHeader>
    );
}
