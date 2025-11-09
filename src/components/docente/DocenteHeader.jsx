import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Home, CalendarPlus, Megaphone, CalendarClock, LogOut, User, ChevronDown, Calendar } from "lucide-react";

function Sidebar({ onNavigate, userName, userPhoto }) {
  const navigate = useNavigate();
  const [ausenciasOpen, setAusenciasOpen] = useState(false);
  const [comunicadosOpen, setComunicadosOpen] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <nav className="h-full w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">
      {/* Logo y título */}
      <div className="px-5 py-6 border-b border-gray-700">
        <Link to="/docente" className="block group">
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="/imagenes/ctpmlogo.png" 
              alt="CTPM Logo" 
              className="h-10 w-10 object-contain drop-shadow-lg transition-transform group-hover:scale-110"
            />
            <div>
              <span className="text-xl font-bold tracking-wide">CTPM</span>
              <span className="block text-xs text-yellow-400 font-semibold uppercase tracking-wider">
                Panel Docente
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Información del usuario */}
      <div className="px-5 py-4 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center gap-3">
          {userPhoto ? (
            <img 
              src={`https://sistemainformacion.pythonanywhere.com/uploads/${userPhoto}`}
              alt="Foto de perfil"
              className="w-10 h-10 rounded-full object-cover border-2 border-yellow-500"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-900" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{userName}</p>
            <p className="text-xs text-gray-400">Docente</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <ul className="flex-1 p-3 space-y-1 overflow-y-auto">
        {/* Inicio */}
        <li>
          <NavLink
            to="/docente"
            onClick={onNavigate}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-yellow-500 text-gray-900 font-semibold shadow-lg"
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
              }`
            }
          >
            <Home className="h-5 w-5 shrink-0" />
            <span className="truncate">Inicio</span>
          </NavLink>
        </li>

        {/* Dropdown Ausencias */}
        <li>
          <button
            onClick={() => setAusenciasOpen(!ausenciasOpen)}
            className="w-full flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 shrink-0" />
              <span className="truncate">Ausencias</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${ausenciasOpen ? 'rotate-180' : ''}`} />
          </button>
          {ausenciasOpen && (
            <ul className="mt-1 ml-4 space-y-1">
              <li>
                <NavLink
                  to="/docente/crear-ausencia"
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-2 transition-all duration-200 text-sm ${
                      isActive
                        ? "bg-yellow-500 text-gray-900 font-semibold shadow-lg"
                        : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                    }`
                  }
                >
                  <CalendarPlus className="h-4 w-4 shrink-0" />
                  <span className="truncate">Crear ausencia</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/docente/mis-ausencias"
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-2 transition-all duration-200 text-sm ${
                      isActive
                        ? "bg-yellow-500 text-gray-900 font-semibold shadow-lg"
                        : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                    }`
                  }
                >
                  <CalendarClock className="h-4 w-4 shrink-0" />
                  <span className="truncate">Mis ausencias</span>
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Dropdown Comunicados */}
        <li>
          <button
            onClick={() => setComunicadosOpen(!comunicadosOpen)}
            className="w-full flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <Megaphone className="h-5 w-5 shrink-0" />
              <span className="truncate">Comunicados</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${comunicadosOpen ? 'rotate-180' : ''}`} />
          </button>
          {comunicadosOpen && (
            <ul className="mt-1 ml-4 space-y-1">
              <li>
                <NavLink
                  to="/docente/crear-comunicado"
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-2 transition-all duration-200 text-sm ${
                      isActive
                        ? "bg-yellow-500 text-gray-900 font-semibold shadow-lg"
                        : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                    }`
                  }
                >
                  <Megaphone className="h-4 w-4 shrink-0" />
                  <span className="truncate">Crear comunicado</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/docente/mis-comunicados"
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-2 transition-all duration-200 text-sm ${
                      isActive
                        ? "bg-yellow-500 text-gray-900 font-semibold shadow-lg"
                        : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                    }`
                  }
                >
                  <Megaphone className="h-4 w-4 shrink-0" />
                  <span className="truncate">Mis comunicados</span>
                </NavLink>
              </li>
            </ul>
          )}
        </li>
      </ul>

      {/* Botón cerrar sesión */}
      <div className="p-3 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-gray-300 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Cerrar sesión</span>
        </button>
        <div className="mt-3 text-[11px] text-gray-500 text-center">
          © CTPM {new Date().getFullYear()}
        </div>
      </div>
    </nav>
  );
}

export default function DocenteHeader({ children }) {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("Docente");
  const [userPhoto, setUserPhoto] = useState(null);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    if (usuario.nombre) {
      setUserName(usuario.nombre);
    }
    if (usuario.foto_perfil) {
      setUserPhoto(usuario.foto_perfil);
    }
  }, []);

  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar (solo móvil) */}
      <header className="md:hidden sticky top-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
        <div className="h-16 flex items-center justify-between px-4">
          <button
            aria-label="Abrir menú"
            onClick={() => setOpen(true)}
            className="p-2.5 rounded-lg bg-yellow-500 hover:bg-yellow-600 transition-all duration-200 active:scale-95 shadow-md"
          >
            <Menu className="h-5 w-5 text-gray-900" />
          </button>
          <div className="flex items-center gap-2">
            <img 
              src="/imagenes/ctpmlogo.png" 
              alt="CTPM" 
              className="h-8 w-8 object-contain drop-shadow-md"
            />
            <span className="font-bold text-white text-lg tracking-wide">CTPM</span>
          </div>
          {userPhoto ? (
            <img 
              src={`https://sistemainformacion.pythonanywhere.com/uploads/${userPhoto}`}
              alt="Foto de perfil"
              className="w-9 h-9 rounded-full object-cover border-2 border-yellow-500 shadow-md"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center shadow-md">
              <User className="h-4 w-4 text-gray-900" />
            </div>
          )}
        </div>
      </header>

      {/* Sidebar fija (md y arriba) */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 shadow-2xl">
        <Sidebar onNavigate={() => {}} userName={userName} userPhoto={userPhoto} />
      </aside>

      {/* Drawer móvil con animación */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Overlay con animación de fade */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setOpen(false)}
          />
          
          {/* Sidebar con animación de slide desde la izquierda */}
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm shadow-2xl animate-slideInLeft">
            <Sidebar onNavigate={() => setOpen(false)} userName={userName} userPhoto={userPhoto} />
          </div>
        </div>
      )}

      {/* Contenido */}
      <main className="md:pl-72 min-h-screen">
        {children}
      </main>
    </div>
  );
}
