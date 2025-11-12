import { useState, useEffect } from "react";
import { Send } from "lucide-react";

export default function LoaderAnimacion() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleToggleLoader = (event) => {
            setIsVisible(event.detail.show);
        };

        window.addEventListener('toggleLoader', handleToggleLoader);

        return () => {
            window.removeEventListener('toggleLoader', handleToggleLoader);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 flex items-center justify-center z-[9999] backdrop-blur-md animate-fadeIn">
            <div className="relative">
                {/* Círculos de fondo animados */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-32 h-32 border-4 border-gray-400/30 rounded-full animate-ping"></div>
                    <div className="absolute w-40 h-40 border-4 border-gray-600/20 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                </div>

                {/* Card principal con gradiente */}
                <div className="relative bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-2xl p-10 flex flex-col items-center animate-slideUp border border-gray-200/50">

                    {/* Avión de papel con trayectoria mejorada */}
                    <div className="relative mb-8 h-20 w-full flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* Estela del avión */}
                            <div className="absolute h-1 w-32 bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-50 animate-pulse"></div>
                        </div>
                        <div className="animate-plane relative z-10">
                            <div className="relative">
                                {/* Sombra del avión */}
                                <div className="absolute inset-0 blur-xl bg-gray-500/40 rounded-full"></div>
                                {/* Avión */}
                                <Send className="relative h-20 w-20 text-gray-900 drop-shadow-2xl" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Texto con gradiente */}
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-700 via-gray-900 to-gray-700 bg-clip-text text-transparent mb-2 animate-pulse">
                        Procesando...
                    </h3>
                    
                    <p className="text-sm text-gray-500 font-medium mb-6">
                        Espera un momento por favor
                    </p>
                    
                    {/* Barra de progreso animada */}
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-4">
                        <div className="h-full bg-gradient-to-r from-gray-700 via-gray-900 to-gray-700 rounded-full animate-[loading_1.5s_ease-in-out_infinite]"></div>
                    </div>

                    {/* Puntos animados mejorados */}
                    <div className="flex gap-2">
                        <div className="w-3 h-3 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0s', animationDuration: '1s' }}></div>
                        <div className="w-3 h-3 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s', animationDuration: '1s' }}></div>
                        <div className="w-3 h-3 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.4s', animationDuration: '1s' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
