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

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GestionDeUsuariosProvider>
        <InventarioFisicoProvider>
          <AutoLavadoProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </AutoLavadoProvider>
        </InventarioFisicoProvider>
      </GestionDeUsuariosProvider>
    </AuthProvider>
    <ReactQueryDevtools />
  </QueryClientProvider>
)
