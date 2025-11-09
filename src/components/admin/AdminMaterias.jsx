import { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import api from "../../axiosConfig";
import { toast } from "sonner";
import { BookOpen, Plus, Edit, Trash2, X, Search, GraduationCap } from "lucide-react";

export default function AdminMaterias() {
    const [materias, setMaterias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("crear"); // "crear" o "editar"
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
    const [formData, setFormData] = useState({ nombre: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        cargarMaterias();
    }, []);

    const cargarMaterias = async () => {
        try {
            setLoading(true);
            const response = await api.get("/admin/materias");
            setMaterias(response.data.materias);
        } catch (error) {
            console.error("Error al cargar materias:", error);
            toast.error("Error al cargar las materias");
        } finally {
            setLoading(false);
        }
    };

    const abrirModalCrear = () => {
        setModalMode("crear");
        setFormData({ nombre: "" });
        setMateriaSeleccionada(null);
        setModalOpen(true);
    };

    const abrirModalEditar = (materia) => {
        setModalMode("editar");
        setFormData({ nombre: materia.nombre });
        setMateriaSeleccionada(materia);
        setModalOpen(true);
    };

    const cerrarModal = () => {
        setModalOpen(false);
        setFormData({ nombre: "" });
        setMateriaSeleccionada(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.nombre.trim()) {
            toast.error("El nombre de la materia es requerido");
            return;
        }

        setSubmitting(true);

        try {
            if (modalMode === "crear") {
                await api.post("/admin/materias", formData);
                toast.success("Materia creada exitosamente");
            } else {
                await api.put(`/admin/materias/${materiaSeleccionada.id}`, formData);
                toast.success("Materia actualizada exitosamente");
            }
            
            cargarMaterias();
            cerrarModal();
        } catch (error) {
            console.error("Error:", error);
            const mensaje = error.response?.data?.error || "Error al guardar la materia";
            toast.error(mensaje);
        } finally {
            setSubmitting(false);
        }
    };

    const eliminarMateria = async (materia) => {
        if (!confirm(`¿Estás seguro de eliminar la materia "${materia.nombre}"?`)) {
            return;
        }

        try {
            await api.delete(`/admin/materias/${materia.id}`);
            toast.success("Materia eliminada exitosamente");
            cargarMaterias();
        } catch (error) {
            console.error("Error al eliminar:", error);
            const mensaje = error.response?.data?.error || "Error al eliminar la materia";
            toast.error(mensaje);
        }
    };

    // Filtrar materias
    const materiasFiltradas = materias.filter(materia =>
        materia.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminHeader>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                            <BookOpen className="h-8 w-8 text-blue-600" />
                            Gestión de Materias
                        </h1>
                        <p className="text-gray-600">
                            Administra todas las materias del sistema CTPM
                        </p>
                    </div>

                    {/* Barra de acciones */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* Búsqueda */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar materia..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Botón crear y contador */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                                    <GraduationCap className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm font-semibold text-blue-900">
                                        {materiasFiltradas.length} materias
                                    </span>
                                </div>
                                <button
                                    onClick={abrirModalCrear}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                                >
                                    <Plus className="h-5 w-5" />
                                    Nueva Materia
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Lista de materias */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : materiasFiltradas.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                {searchTerm ? "No se encontraron materias" : "No hay materias registradas"}
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {searchTerm 
                                    ? "Intenta con otros términos de búsqueda"
                                    : "Comienza agregando tu primera materia"
                                }
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={abrirModalCrear}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                                >
                                    <Plus className="h-5 w-5" />
                                    Crear Primera Materia
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {materiasFiltradas.map((materia) => (
                                <div
                                    key={materia.id}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-5 border-l-4 border-blue-500"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                                                <BookOpen className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <h3 className="font-bold text-gray-900 truncate">
                                                {materia.nombre}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <span className="text-xs text-gray-500">ID: {materia.id}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => abrirModalEditar(materia)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => eliminarMateria(materia)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Crear/Editar */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                        {/* Header del modal */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    {modalMode === "crear" ? (
                                        <Plus className="h-6 w-6 text-blue-600" />
                                    ) : (
                                        <Edit className="h-6 w-6 text-blue-600" />
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {modalMode === "crear" ? "Nueva Materia" : "Editar Materia"}
                                </h2>
                            </div>
                            <button
                                onClick={cerrarModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nombre de la Materia *
                                </label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ nombre: e.target.value })}
                                    placeholder="Ej: Matemáticas"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    autoFocus
                                />
                            </div>

                            {/* Botones */}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={cerrarModal}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                                    disabled={submitting}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? "Guardando..." : modalMode === "crear" ? "Crear" : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminHeader>
    );
}
