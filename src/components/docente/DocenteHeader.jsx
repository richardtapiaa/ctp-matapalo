import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Home, CalendarPlus, Megaphone, CalendarClock, LogOut, User, ChevronDown, Calendar, FileText, Eye } from "lucide-react";

function Sidebar({ onNavigate, userName, userPhoto }) {
  const navigate = useNavigate();
  const [ausenciasOpen, setAusenciasOpen] = useState(false);
  const [comunicadosOpen, setComunicadosOpen] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <nav className="h-full w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col shadow-2xl">
      {/* Logo y título */}
      <div className="px-5 py-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-transparent">
        <Link to="/docente" className="block group">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <img 
                src="/imagenes/ctpmlogo.png" 
                alt="CTPM Logo" 
                className="h-12 w-12 object-contain drop-shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]"
              />
              <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
            </div>
          </div>
        </Link>
      </div>

      {/* Información del usuario */}
      <div className="px-5 py-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/30 to-transparent">
        <div className="flex items-center gap-3 group cursor-pointer hover:bg-gray-800/30 p-2 rounded-lg transition-all duration-200">
          <div className="relative">
            {userPhoto ? (
              <img 
                src={`https://sistemainformacion.pythonanywhere.com/uploads/${userPhoto}`}
                alt="Foto de perfil"
                className="w-12 h-12 rounded-full object-cover border-2 border-yellow-500 shadow-lg group-hover:border-yellow-400 transition-all duration-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg group-hover:from-yellow-500 group-hover:to-yellow-700 transition-all duration-200">
                <User className="h-6 w-6 text-gray-900" />
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full shadow-sm"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-white">{userName}</p>

          </div>
        </div>
      </div>

      {/* Navegación */}
      <ul className="flex-1 p-3 space-y-1.5 overflow-y-auto custom-scrollbar">
        {/* Inicio */}
        <li>
          <NavLink
            to="/docente"
            onClick={onNavigate}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-semibold shadow-lg shadow-yellow-500/50"
                  : "text-gray-300 hover:bg-gray-800/70 hover:text-white hover:translate-x-1"
              }`
            }
          >
            <Home className="h-5 w-5 shrink-0 relative z-10" />
            <span className="truncate relative z-10">Inicio</span>
            {/* Efecto de brillo al hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </NavLink>
        </li>

        {/* Dropdown Ausencias */}
        <li>
          <button
            onClick={() => setAusenciasOpen(!ausenciasOpen)}
            className="w-full flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-gray-800/70 hover:text-white transition-all duration-300 hover:translate-x-1 group"
          >
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <span className="truncate">Ausencias</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-all duration-300 ${ausenciasOpen ? 'rotate-180 text-yellow-400' : 'group-hover:translate-y-0.5'}`} />
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${ausenciasOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
            <ul className="mt-1 ml-4 space-y-1 border-l-2 border-gray-700 pl-2">
              <li>
                <NavLink
                  to="/docente/crear-ausencia"
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all duration-300 text-sm group ${
                      isActive
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-semibold shadow-md shadow-yellow-500/30"
                        : "text-gray-400 hover:bg-gray-800/70 hover:text-white hover:translate-x-1"
                    }`
                  }
                >
                  <CalendarPlus className="h-4 w-4 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <span className="truncate">Crear ausencia</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/docente/mis-ausencias"
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all duration-300 text-sm group ${
                      isActive
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-semibold shadow-md shadow-yellow-500/30"
                        : "text-gray-400 hover:bg-gray-800/70 hover:text-white hover:translate-x-1"
                    }`
                  }
                >
                  <Eye className="h-4 w-4 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <span className="truncate">Mis ausencias</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </li>

        {/* Dropdown Comunicados */}
        <li>
          <button
            onClick={() => setComunicadosOpen(!comunicadosOpen)}
            className="w-full flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-gray-800/70 hover:text-white transition-all duration-300 hover:translate-x-1 group"
          >
            <div className="flex items-center gap-3">
              <Megaphone className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <span className="truncate">Comunicados</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-all duration-300 ${comunicadosOpen ? 'rotate-180 text-yellow-400' : 'group-hover:translate-y-0.5'}`} />
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${comunicadosOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
            <ul className="mt-1 ml-4 space-y-1 border-l-2 border-gray-700 pl-2">
              <li>
                <NavLink
                  to="/docente/crear-comunicado"
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all duration-300 text-sm group ${
                      isActive
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-semibold shadow-md shadow-yellow-500/30"
                        : "text-gray-400 hover:bg-gray-800/70 hover:text-white hover:translate-x-1"
                    }`
                  }
                >
                  <FileText className="h-4 w-4 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <span className="truncate">Crear comunicado</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/docente/mis-comunicados"
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all duration-300 text-sm group ${
                      isActive
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-semibold shadow-md shadow-yellow-500/30"
                        : "text-gray-400 hover:bg-gray-800/70 hover:text-white hover:translate-x-1"
                    }`
                  }
                >
                  <Eye className="h-4 w-4 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <span className="truncate">Mis comunicados</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </li>
      </ul>

      {/* Botón cerrar sesión */}
      <div className="p-3 border-t border-gray-700/50 bg-gradient-to-r from-transparent to-gray-800/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/20 hover:text-red-300 hover:border hover:border-red-500/30 transition-all duration-300 group relative overflow-hidden"
        >
          <LogOut className="h-5 w-5 shrink-0 group-hover:rotate-6 transition-transform duration-300" />
          <span className="font-medium">Cerrar sesión</span>
          {/* Efecto de brillo al hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        </button>

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
      <header className="md:hidden sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl border-b border-gray-700/50">
        <div className="h-16 flex items-center justify-between px-4">
          <button
            aria-label="Abrir menú"
            onClick={() => setOpen(true)}
            className="p-2.5 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl shadow-yellow-500/30 group"
          >
            <Menu className="h-5 w-5 text-gray-900 group-hover:rotate-90 transition-transform duration-300" />
          </button>
          <div className="flex items-center gap-2.5">
            <img 
              src="/imagenes/ctpmlogo.png" 
              alt="CTPM" 
              className="h-10 w-10 object-contain drop-shadow-lg"
            />
          </div>
          <div className="relative">
            {userPhoto ? (
              <img 
                src={`https://sistemainformacion.pythonanywhere.com/uploads/${userPhoto}`}
                alt="Foto de perfil"
                className="w-10 h-10 rounded-full object-cover border-2 border-yellow-500 shadow-lg hover:border-yellow-400 transition-all duration-300 cursor-pointer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg cursor-pointer hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300">
                <User className="h-5 w-5 text-gray-900" />
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full shadow-sm"></div>
          </div>
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn cursor-pointer"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
          />
          
          {/* Sidebar con animación de slide desde la izquierda */}
          <div 
            className="absolute inset-y-0 left-0 w-[85%] max-w-sm shadow-2xl animate-slideInLeft"
            onClick={(e) => e.stopPropagation()}
          >
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
