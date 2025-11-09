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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    
                    {/* Tarjeta Ausencias */}
                    <Link 
                        to="/ausencias"
                        className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
                        data-aos="fade-right"
                        data-aos-delay="100"
                    >
                        <div className="p-8 text-center">
                            {/* Icono */}
                            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            
                            {/* Título */}
                            <h3 className="text-3xl font-bold text-gray-900 mb-3">
                                Ausencias
                            </h3>
                            
                            {/* Descripción */}
                            <p className="text-gray-600 text-lg mb-6">
                                Revisa las ausencias de los docente
                            </p>
                            
                           
                            <div className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                                Ver ausencias
                                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Tarjeta Comunicados */}
                    <Link 
                        to="/comunicados"
                        className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
                        data-aos="fade-left"
                        data-aos-delay="200"
                    >
                        <div className="p-8 text-center">
                            {/* Icono */}
                            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                </svg>
                            </div>
                            
                            {/* Título */}
                            <h3 className="text-3xl font-bold text-gray-900 mb-3">
                                Comunicados
                            </h3>
                            
                            {/* Descripción */}
                            <p className="text-gray-600 text-lg mb-6">
                                Mantente informado con los últimos avisos
                            </p>
                            
                            {/* Botón */}
                            <div className="inline-flex items-center text-yellow-600 font-semibold group-hover:text-yellow-700">
                                Ver comunicados
                                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

