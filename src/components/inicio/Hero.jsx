import { Link } from "react-router-dom";

export default function HeroInicio() {
    return (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
            {/* Imagen de fondo */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/imagenes/cole.jpg" 
                    alt="CTPM Background" 
                    className="w-full h-full object-cover"
                />
                {/* Overlay con gradiente de colores del logo */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-blue-800/80 to-blue-900/85"></div>
            </div>

            {/* Contenido */}
            <div className="relative z-10 container mx-auto px-6 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Logo grande */}
                    <div className="flex justify-center mb-8">
                        <img 
                            src="/imagenes/ctpmlogo.png" 
                            alt="CTPM Logo" 
                            className="h-32 w-32 object-contain drop-shadow-2xl animate-fade-in"
                        />
                    </div>

                    {/* Título principal */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
                        Bienvenido al Sistema de Ausencias
                        <span className="block text-yellow-400 mt-2">CTPM</span>
                    </h1>

                    {/* Subtítulo */}
                    <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Gestiona y reporta ausencias de manera eficiente. 
                        Tu plataforma educativa digital.
                    </p>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                   
                    </div>

                    {/* Características destacadas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                        
                    </div>
                </div>
            </div>

            {/* Decoración ondulada inferior */}
            <div className="absolute bottom-0 left-0 right-0 z-10">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
                </svg>
            </div>
        </section>
    );
}
