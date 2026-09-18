import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from '@/routes/AppRoutes'
import { ModuleProvider } from '@/context/ModuleContext'

export function App() {
  return (
    <BrowserRouter>
      <ModuleProvider>
        <AppRoutes />
      </ModuleProvider>
    </BrowserRouter>
  )
}
