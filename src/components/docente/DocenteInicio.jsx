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
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-blue-800/50 to-blue-900/60"></div>
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

                        

                    </div>
                </div>
            </section>
        </DocenteHeader>
    );
}
