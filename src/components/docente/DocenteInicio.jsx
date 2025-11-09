import { useEffect, useState } from "react";
import DocenteHeader from "./DocenteHeader";

export default function DocenteInicio() {
    const [userName, setUserName] = useState("Docente");

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
        if (usuario.nombre) {
            setUserName(usuario.nombre);
        }
    }, []);

    return (
        <DocenteHeader>
            {/* Hero de bienvenida */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Imagen de fondo */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/imagenes/cole.jpg" 
                        alt="CTPM Background" 
                        className="w-full h-full object-cover"
                    />
                    {/* Overlay con gradiente de colores del logo */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/85 to-blue-900/90"></div>
                </div>

                {/* Contenido */}
                <div className="relative z-10 container mx-auto px-6 py-16">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Logo grande */}
                        <div className="flex justify-center mb-8">
                            <img 
                                src="/imagenes/ctpmlogo.png" 
                                alt="CTPM Logo" 
                                className="h-24 w-24 object-contain drop-shadow-2xl"
                            />
                        </div>

                        {/* Título de bienvenida */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
                            ¡Bienvenido de vuelta,
                            <span className="block text-yellow-400 mt-2">{userName}!</span>
                        </h1>

                        {/* Subtítulo */}
                        <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Aqui puedes gestionar tus ausencias y dejar un comunicado importante.
                        </p>

                        {/* Tarjetas de acceso rápido */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-200 group">
                                <div className="text-yellow-400 text-3xl mb-2 group-hover:scale-110 transition-transform">📋</div>
                                <h3 className="text-white font-bold text-base mb-1">Ausencias</h3>
                                <p className="text-gray-200 text-sm">
                                    Gestiona tus ausencias
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-200 group">
                                <div className="text-yellow-400 text-3xl mb-2 group-hover:scale-110 transition-transform">📢</div>
                                <h3 className="text-white font-bold text-base mb-1">Comunicados</h3>
                                <p className="text-gray-200 text-sm">
                                    Publica avisos importantes
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-200 group">
                                <div className="text-yellow-400 text-3xl mb-2 group-hover:scale-110 transition-transform">📊</div>
                                <h3 className="text-white font-bold text-base mb-1">Historial</h3>
                                <p className="text-gray-200 text-sm">
                                    Consulta tu registro
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </DocenteHeader>
    );
}
