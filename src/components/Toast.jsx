import { useEffect, useState } from 'react'

export function Toast({ message, type = 'success', duration = 3000, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration)
        return () => clearTimeout(timer)
    }, [duration, onClose])

    const bgColor = {
        success: 'bg-emerald-50 text-emerald-900 border-emerald-200',
        error: 'bg-rose-50 text-rose-900 border-rose-200',
        info: 'bg-sky-50 text-sky-900 border-sky-200',
    }[type]

    const icon = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
    }[type]

    return (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg border px-4 py-3 ${bgColor}`}>
            <span className="font-semibold">{icon}</span>
            <span>{message}</span>
        </div>
    )
}

export function useToast() {
    const [toasts, setToasts] = useState([])

    const showToast = (message, type = 'success') => {
        const id = Date.now()
        setToasts((current) => [...current, { id, message, type }])
    }

    const removeToast = (id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
    }

    return { toasts, showToast, removeToast }
}
