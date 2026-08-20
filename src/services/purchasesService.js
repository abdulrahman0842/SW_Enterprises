import { supabase } from '../lib/supabase'

export async function fetchProducts() {
    if (!supabase) {
        throw new Error('Supabase is not configured')
    }

    const { data, error } = await supabase
        .from('products')
        .select('id, name, quantity_per_box, rate, mrp, stock')
        .order('name', { ascending: true })

    if (error) {
        throw error
    }

    return data
}

export async function fetchPurchases() {
    if (!supabase) {
        throw new Error('Supabase is not configured')
    }

    const { data, error } = await supabase
        .from('purchases')
        .select('id, date, product_id, rate, mrp, quantity, created_at, products(id, name, quantity_per_box)')
        .order('date', { ascending: false })

    if (error) {
        throw error
    }

    return data
}

export async function createPurchase(date, product_id, quantity, rate, mrp) {
    if (!supabase) {
        throw new Error('Supabase is not configured')
    }

    const { data, error } = await supabase
        .from('purchases')
        .insert([
            {
                date,
                product_id: Number(product_id),
                quantity: Number(quantity),
                rate: Number(rate),
                mrp: Number(mrp),
            },
        ])
        .select()

    if (error) {
        throw error
    }

    return data[0]
}

export async function getPurchaseDetails(purchaseId) {
    if (!supabase) {
        throw new Error('Supabase is not configured')
    }

    const { data, error } = await supabase
        .from('purchases')
        .select('id, date, product_id, rate, mrp, quantity, created_at, products(name, quantity_per_box)')
        .eq('id', purchaseId)
        .single()

    if (error) {
        throw error
    }

    return data
}
