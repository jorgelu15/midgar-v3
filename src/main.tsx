import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from './context/ThemeContext/ThemeContext.tsx'

import AuthProvider from './context/Authentication/authProvider.tsx'
import InventarioFisicoProvider from './context/InventarioFisico/InventarioFisicoProvider.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <InventarioFisicoProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </InventarioFisicoProvider>
    </AuthProvider>
    <ReactQueryDevtools />
  </QueryClientProvider>
)
