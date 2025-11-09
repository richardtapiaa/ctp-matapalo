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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-fadeIn">
                {/* Avión de papel animado */}
                <div className="relative mb-6">
                    <div className="animate-plane">
                        <Send className="h-16 w-16 text-yellow-500" />
                    </div>
                </div>
                
                {/* Texto */}
                <p className="text-xl font-semibold text-gray-900 mb-2">
                    Espera un momento...
                </p>
                
                {/* Puntos animados */}
                <div className="flex gap-1 mt-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        </div>
    );
}
