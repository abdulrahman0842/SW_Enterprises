import { supabase } from '../lib/supabase'

export async function fetchInventory() {
    if (!supabase) {
        throw new Error('Supabase is not configured')
    }

    const { data, error } = await supabase
        .from('products')
        .select('id, name, quantity_per_box, stock, rate, mrp')
        .order('name', { ascending: true })

    if (error) {
        throw error
    }

    return data
}

export function calculateBottles(stockBoxes, quantityPerBox) {
    return stockBoxes * quantityPerBox
}

export function isLowStock(stockBoxes, lowStockThreshold = 5) {
    return stockBoxes <= lowStockThreshold
}
