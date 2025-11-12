import { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "./Header";
import HeroInicio from "./Hero";

export default function HomeApp() {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-out-cubic'
        });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <Header />
            <HeroInicio />
            
            {/* Sección de Métricas */}
            <section className="container mx-auto px-6 py-24 -mt-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    
                    {/* Tarjeta Ausencias */}
                    <Link 
                        to="/ausencias"
                        className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
                        data-aos="fade-right"
                        data-aos-delay="100"
                    >
                        {/* Gradiente de fondo animado */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Efecto de brillo */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 opacity-20"></div>
                        
                        <div className="relative p-10 text-center">
                            {/* Icono con efecto mejorado */}
                            <div className="relative w-24 h-24 mx-auto mb-6">
                                {/* Círculo de fondo animado */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl transform group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-2xl"></div>
                                {/* Círculo secundario */}
                                <div className="absolute inset-0 bg-gradient-to-tl from-blue-500 to-blue-700 rounded-2xl transform -rotate-6 group-hover:rotate-0 transition-all duration-500 opacity-80"></div>
                                {/* Icono */}
                                <div className="absolute inset-0 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                                    <svg className="w-12 h-12 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Título */}
                            <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent mb-3 group-hover:from-blue-600 group-hover:to-blue-800 transition-all duration-500">
                                Ausencias
                            </h3>
                            
                            {/* Descripción */}
                            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                Revisa las ausencias de los docentes
                            </p>
                            
                            {/* Línea decorativa */}
                            <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-6 rounded-full group-hover:w-24 transition-all duration-500"></div>
                            
                            {/* Botón con efecto */}
                            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl group-hover:from-blue-600 group-hover:to-blue-700 transform group-hover:scale-105 transition-all duration-300 shadow-md group-hover:shadow-xl">
                                Ver ausencias
                                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Tarjeta Comunicados */}
                    <Link 
                        to="/comunicados"
                        className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
                        data-aos="fade-left"
                        data-aos-delay="200"
                    >
                        {/* Gradiente de fondo animado */}
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Efecto de brillo */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 opacity-20"></div>
                        
                        <div className="relative p-10 text-center">
                            {/* Icono con efecto mejorado */}
                            <div className="relative w-24 h-24 mx-auto mb-6">
                                {/* Círculo de fondo animado */}
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl transform group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-2xl"></div>
                                {/* Círculo secundario */}
                                <div className="absolute inset-0 bg-gradient-to-tl from-yellow-500 to-yellow-700 rounded-2xl transform -rotate-6 group-hover:rotate-0 transition-all duration-500 opacity-80"></div>
                                {/* Icono */}
                                <div className="absolute inset-0 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                                    <svg className="w-12 h-12 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Título */}
                            <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent mb-3 group-hover:from-yellow-600 group-hover:to-yellow-800 transition-all duration-500">
                                Comunicados
                            </h3>
                            
                            {/* Descripción */}
                            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                Mantente informado con los últimos avisos
                            </p>
                            
                            {/* Línea decorativa */}
                            <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mb-6 rounded-full group-hover:w-24 transition-all duration-500"></div>
                            
                            {/* Botón con efecto */}
                            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-xl group-hover:from-yellow-600 group-hover:to-yellow-700 transform group-hover:scale-105 transition-all duration-300 shadow-md group-hover:shadow-xl">
                                Ver comunicados
                                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                </div>
            </section>
        </div>
    );
}

