import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-center">
          {/* Logo y Nombre */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/imagenes/ctpmlogo.png" 
              alt="CTPM Logo" 
              className="h-12 w-12 object-contain drop-shadow-lg transition-transform group-hover:scale-110"
            />
            <div className="flex flex-col">
              <span className="text-white text-xl font-bold tracking-wide">
                CTPM
              </span>
              <span className="text-yellow-400 text-xs font-semibold uppercase tracking-wider">
                Sistema de Ausencias
              </span>
            </div>
          </Link>
        </div>
      </nav>
    </header>
  );
}
