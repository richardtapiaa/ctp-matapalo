import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Home, Users, BookOpen, Megaphone, LogOut, ChevronDown } from "lucide-react";

const navItems = [
  { to: "/admin", label: "Inicio", icon: Home },
  { to: "/admin/usuarios", label: "Usuarios", icon: Users },
  { to: "/admin/materias", label: "Materias", icon: BookOpen },
];

export default function AdminHeader({ children }) {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("Administrador");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    if (usuario.nombre) {
      setUserName(usuario.nombre);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo y título */}
            <Link to="/admin" className="flex items-center gap-3 group">
              <img 
                src="/imagenes/ctpmlogo.png" 
                alt="CTPM Logo" 
                className="h-10 w-10 object-contain drop-shadow-lg transition-transform group-hover:scale-110"
              />
              <div>
                <span className="text-xl font-bold text-white tracking-wide">CTPM</span>
                <span className="block text-xs text-yellow-400 font-semibold uppercase tracking-wider">
                  Panel Admin
                </span>
              </div>
            </Link>

            {/* Links de navegación (desktop) */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-yellow-500 text-blue-950 font-semibold"
                        : "text-white hover:bg-blue-800"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{label}</span>
                </NavLink>
              ))}
              
              {/* Dropdown Comunicados */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-blue-800 transition-all duration-200"
                >
                  <Megaphone className="h-4 w-4" />
                  <span className="text-sm">Comunicados</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownOpen && (
                  <>
                    {/* Overlay para cerrar el dropdown al hacer click fuera */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setDropdownOpen(false)}
                    />
                    {/* Menú dropdown */}
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                      <NavLink
                        to="/admin/crear-comunicado"
                        onClick={() => setDropdownOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2 transition-colors ${
                            isActive
                              ? "bg-blue-50 text-blue-950 font-semibold"
                              : "text-gray-700 hover:bg-gray-50"
                          }`
                        }
                      >
                        <Megaphone className="h-4 w-4" />
                        <span className="text-sm">Crear Comunicado</span>
                      </NavLink>
                      <NavLink
                        to="/admin/mis-comunicados"
                        onClick={() => setDropdownOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2 transition-colors ${
                            isActive
                              ? "bg-blue-50 text-blue-950 font-semibold"
                              : "text-gray-700 hover:bg-gray-50"
                          }`
                        }
                      >
                        <Megaphone className="h-4 w-4" />
                        <span className="text-sm"> Mis Comunicados</span>
                      </NavLink>
                    </div>
                  </>
                )}
              </div>
              
              {/* Botón cerrar sesión */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 ml-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Cerrar sesión</span>
              </button>
            </div>

            {/* Botón menú móvil */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-md bg-blue-900 hover:bg-blue-800 transition-colors"
            >
              {open ? (
                <X className="h-5 w-5 text-white" />
              ) : (
                <Menu className="h-5 w-5 text-white" />
              )}
            </button>
          </div>

          {/* Menú móvil desplegable */}
          {open && (
            <div className="md:hidden border-t border-blue-800 py-3">
              <div className="flex flex-col gap-1">
                {navItems.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/admin"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-yellow-500 text-blue-950 font-semibold"
                          : "text-white hover:bg-blue-800"
                      }`
                    }
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </NavLink>
                ))}
                
                {/* Sección Comunicados en móvil */}
                <div className="px-4 py-2 text-yellow-400 text-xs font-semibold uppercase tracking-wider">
                  Comunicados
                </div>
                <NavLink
                  to="/admin/crear-comunicado"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-yellow-500 text-blue-950 font-semibold"
                        : "text-white hover:bg-blue-800"
                    }`
                  }
                >
                  <Megaphone className="h-5 w-5" />
                  <span>Crear Comunicado</span>
                </NavLink>
                <NavLink
                  to="/admin/mis-comunicados"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-yellow-500 text-blue-950 font-semibold"
                        : "text-white hover:bg-blue-800"
                    }`
                  }
                >
                  <Megaphone className="h-5 w-5" />
                  <span>Ver Mis Comunicados</span>
                </NavLink>
                
                {/* Botón cerrar sesión móvil */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 mt-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Contenido */}
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
}
