import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function HeroInicio() {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    // Array de imágenes para el carrusel
    const images = [
        "/imagenes/foto1.jpg", 
        "/imagenes/foto2.jpg", 
        "/imagenes/foto3.jpg",
        "/imagenes/foto4.jpg"  
    ];

    // Cambio automático de slides cada 5 segundos
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 4000);

        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
            {/* Carrusel de imágenes de fondo */}
            <div className="absolute inset-0 z-0">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <img 
                            src={image} 
                            alt={`CTPM Background ${index + 1}`} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
                {/* Overlay con gradiente de colores del logo */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-blue-800/50 to-blue-900/60 z-10"></div>
                
                {/* Indicadores del carrusel */}
                <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentSlide 
                                    ? 'bg-yellow-400 w-8' 
                                    : 'bg-white/50 hover:bg-white/75'
                            }`}
                            aria-label={`Ir a imagen ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Contenido */}
            <div className="relative z-20 container mx-auto px-6 py-20">
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
                        Bienvenido al Sistema de Informacion del
                        <span className="block text-yellow-400 mt-2">CTPM</span>
                    </h1>

                    {/* Subtítulo */}
                  
                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                   
                    </div>

                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                        
                    </div>
                </div>
            </div>

            {/* Decoración ondulada inferior */}
            <div className="absolute bottom-0 left-0 right-0 z-30">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
                </svg>
            </div>
        </section>
    );
}
