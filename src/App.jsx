import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProvedorAuth } from './contextos/ContextoAuth'
import RotaProtegida from './componentes/RotaProtegida'
import PaginaLogin from './paginas/PaginaLogin'
import PaginaDashboard from './paginas/PaginaDashboard'
import PaginaMinhasIndicacoes from './paginas/PaginaMinhasIndicacoes'
import PaginaTodasIndicacoes from './paginas/PaginaTodasIndicacoes'
import { ROTAS } from './constantes'
import './estilos/global.css'

export default function App() {
  return (
    <ProvedorAuth>
      <BrowserRouter>
        <Routes>
          {/* Pública */}
          <Route path={ROTAS.LOGIN} element={<PaginaLogin />} />

          {/* Protegidas — qualquer usuário autenticado */}
          <Route
            path={ROTAS.DASHBOARD}
            element={
              <RotaProtegida>
                <PaginaDashboard />
              </RotaProtegida>
            }
          />

          {/* Apenas usuários comuns */}
          <Route
            path={ROTAS.MINHAS_INDICACOES}
            element={
              <RotaProtegida>
                <PaginaMinhasIndicacoes />
              </RotaProtegida>
            }
          />

          {/* Apenas admin */}
          <Route
            path={ROTAS.TODAS_INDICACOES}
            element={
              <RotaProtegida apenasAdmin>
                <PaginaTodasIndicacoes />
              </RotaProtegida>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={ROTAS.DASHBOARD} replace />} />
        </Routes>
      </BrowserRouter>
    </ProvedorAuth>
  )
}
