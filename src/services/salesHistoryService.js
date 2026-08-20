import { supabase } from '../lib/supabase'

export async function fetchSalesHistory() {
    if (!supabase) {
        throw new Error('Supabase is not configured')
    }

    const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        throw error
    }

    return data || []
}

export function normalizeSalesWithCounts(sales) {
    return (sales || []).map((sale) => ({
        ...sale,
        product_count: Array.isArray(sale.items) ? sale.items.length : 0,
        total_amount: Number(sale.total_amount || 0),
        amount_paid: Number(sale.amount_paid || 0),
        balance_amount: Number(sale.balance_amount || 0),
    }))
}
