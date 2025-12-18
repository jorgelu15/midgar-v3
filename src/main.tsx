import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from './context/ThemeContext/ThemeContext.tsx'

import AuthProvider from './context/authentication/authProvider.tsx'
import InventarioFisicoProvider from './context/InventarioFisico/InventarioFisicoProvider.tsx'
import AutoLavadoProvider from './context/AutoLavado/AutoLavadoProvider.tsx'
import GestionDeUsuariosProvider from './context/gestion-de-usuarios/gestion-de-usuariosProvider.tsx'
import GestionDeClientesProvider from './context/gestion-de-clientes/gestion-de-clientesProvider.tsx'
import GestionDeCreditosProvider from './context/gestion-de-creditos/gestion-de-creditosProvider.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GestionDeUsuariosProvider>
        <GestionDeClientesProvider>
          <GestionDeCreditosProvider>
            <InventarioFisicoProvider>
              <AutoLavadoProvider>
                <ThemeProvider>
                  <App />
                </ThemeProvider>
              </AutoLavadoProvider>
            </InventarioFisicoProvider>
          </GestionDeCreditosProvider>
        </GestionDeClientesProvider>
      </GestionDeUsuariosProvider>
    </AuthProvider>
    <ReactQueryDevtools />
  </QueryClientProvider>
)
