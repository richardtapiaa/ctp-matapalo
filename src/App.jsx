import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Loader global
import LoaderAnimacion from './components/loader/LoaderAnimacion.jsx'

// componentes de inicio
import HomeApp from './components/inicio/Home.jsx'
import Ausencias from './components/inicio/Ausencias.jsx'
import Comunicados from './components/inicio/Comunicados.jsx'

// componetes de auth
import Registro from './components/auth/Registro.jsx'
import Login from './components/auth/Login.jsx'

// componentes de docente
import DocenteInicio from './components/docente/DocenteInicio.jsx'
import DocenteCrearAusencia from './components/docente/DocenteCrearAusencia.jsx'
import DocenteVerMisAusencias from './components/docente/DocenteVerMisAusencias.jsx'
import DocenteCrearComunicado from './components/docente/DocenteCrearComunicado.jsx'
import DocenteVerMisComunicados from './components/docente/DocenteVerMisComunicados.jsx'


// componentes de admin
import AdminHome from './components/admin/AdminHome.jsx'
import AdminUsuarios from './components/admin/AdminUsuarios.jsx'
import AdminMaterias from './components/admin/AdminMaterias.jsx'
import AdminCrearComunicado from './components/admin/AdminCrearComunicado.jsx'
import AdminVerMisComunicados from './components/admin/AdminVerMisComunicados.jsx'
import AdminDocenteDetalle from './components/admin/AdminDocenteDetalle.jsx'






function App() {
  return (
    <BrowserRouter>
      <LoaderAnimacion />
      <Routes>
        {/* Rutas públicas */}

        <Route path="/" element={<HomeApp />} />
        <Route path="/ausencias" element={<Ausencias />} />
        <Route path="/comunicados" element={<Comunicados />} />
        


        {/* Rutas de autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />


        {/* Rutas de docente */}
        <Route path="/docente" element={<DocenteInicio />} />
        <Route path="/docente/crear-ausencia" element={<DocenteCrearAusencia />} />
        <Route path="/docente/mis-ausencias" element={<DocenteVerMisAusencias />} />
        <Route path="/docente/crear-comunicado" element={<DocenteCrearComunicado />} />
        <Route path="/docente/mis-comunicados" element={<DocenteVerMisComunicados />} />


        {/* Rutas de admin */}
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/usuarios" element={<AdminUsuarios />} />
        <Route path="/admin/materias" element={<AdminMaterias />} />
        <Route path="/admin/crear-comunicado" element={<AdminCrearComunicado />} />
        <Route path="/admin/mis-comunicados" element={<AdminVerMisComunicados />} />
        <Route path="/admin/docentes/:id" element={<AdminDocenteDetalle />} />


      </Routes>
    </BrowserRouter>
  )
}

export default App
