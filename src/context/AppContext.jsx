import { createContext, useContext, useMemo } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
    const value = useMemo(
        () => ({
            appName: 'SW Enterprise ERP',
            companyName: 'S.W. Ventures',
            module: 'Operations Dashboard',
        }),
        [],
    )

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
    const context = useContext(AppContext)

    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider')
    }

    return context
}
