import { CategoryType } from '@/api/common'
import { createContext, ReactNode, useContext } from 'react'

interface GlobalParams {
  translations?: { [key: string]: any } | null
  type?: CategoryType
}

interface GlobalProviderProps {
  children: ReactNode
  value: GlobalParams
}

const GlobalContext = createContext<GlobalParams>({})

export const GlobalProvider = ({ children, value }: GlobalProviderProps) => {
  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
}

export const useGlobalParams = () => {
  return useContext(GlobalContext)
}

export default GlobalContext
