import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!supabase) {
            setLoading(false)
            return undefined
        }
        
        let isMounted = true

        const initializeSession = async () => {
            const {
                data: { session: initialSession },
            } = await supabase.auth.getSession()

            if (!isMounted) {
                return
            }

            setSession(initialSession)
            setUser(initialSession?.user ?? null)
            setLoading(false)
        }

        initializeSession()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            if (!isMounted) {
                return
            }

            setSession(currentSession)
            setUser(currentSession?.user ?? null)
            setLoading(false)
        })

        return () => {
            isMounted = false
            subscription?.unsubscribe()
        }
    }, [])

    const signIn = async (email, password) => {

        if (!supabase) {
            throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            throw error
        }

        setSession(data.session)
        setUser(data.user)
        return data
    }

    const signOut = async () => {
        if (!supabase) {
            throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
        }

        const { error } = await supabase.auth.signOut()

        if (error) {
            throw error
        }

        setSession(null)
        setUser(null)
    }

    const value = useMemo(
        () => ({
            session,
            user,
            loading,
            signIn,
            signOut,
            isAuthenticated: Boolean(session),
        }),
        [session, user, loading],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider')
    }

    return context
}
