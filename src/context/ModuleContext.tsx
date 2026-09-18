import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  MANAGEMENT_MODULES,
  MODULE_LIST,
  getModuleFromPath,
  type ManagementModuleConfig,
  type ManagementModuleId,
} from '@/config/modules'

const MODULE_STORAGE_KEY = 'ddbakes_active_module'

interface ModuleContextType {
  currentModule: ManagementModuleConfig
  moduleId: ManagementModuleId
  setModule: (id: ManagementModuleId) => void
  modules: ManagementModuleConfig[]
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined)

export function ModuleProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()

  const [currentModule, setCurrentModule] = useState<ManagementModuleConfig>(() => {
    // Check path first
    const pathModule = getModuleFromPath(location.pathname)
    if (location.pathname !== '/' && pathModule.id !== 'bakery') {
      return pathModule
    }
    // Check saved preference
    const saved = localStorage.getItem(MODULE_STORAGE_KEY) as ManagementModuleId | null
    if (saved && MANAGEMENT_MODULES[saved] && location.pathname === '/') {
      return MANAGEMENT_MODULES[saved]
    }
    return pathModule
  })

  // Keep module synchronized with route
  useEffect(() => {
    const routeModule = getModuleFromPath(location.pathname)
    if (routeModule.id !== currentModule.id) {
      setCurrentModule(routeModule)
      localStorage.setItem(MODULE_STORAGE_KEY, routeModule.id)
    }
  }, [location.pathname, currentModule.id])

  const setModule = (id: ManagementModuleId) => {
    const targetModule = MANAGEMENT_MODULES[id]
    if (!targetModule) return

    setCurrentModule(targetModule)
    localStorage.setItem(MODULE_STORAGE_KEY, id)
    navigate(targetModule.defaultPath)
  }

  return (
    <ModuleContext.Provider
      value={{
        currentModule,
        moduleId: currentModule.id,
        setModule,
        modules: MODULE_LIST,
      }}
    >
      {children}
    </ModuleContext.Provider>
  )
}

export function useModule() {
  const context = useContext(ModuleContext)
  if (!context) {
    throw new Error('useModule must be used within a ModuleProvider')
  }
  return context
}
