import { supabase } from '../lib/supabase'

export async function fetchSuppliers() {
    if (!supabase) {
        throw new Error('Supabase is not configured')
    }

    const { data, error } = await supabase
        .from('suppliers')
        .select('id, name, contact, created_at')
        .order('name', { ascending: true })

    if (error) {
        throw error
    }

    return data
}

export async function createSupplier(supplierData) {
   
    if (!supabase) {
        throw new Error('Supabase is not configured')
    }

    const { data, error } = await supabase
        .from('suppliers')
        .insert([
            {
                name: supplierData.name,
                contact: supplierData.contact,
            },
        ])
        .select()

    if (error) {
        throw error
    }
    
    return data?.[0]
}

export async function updateSupplier(id, supplierData) {
    if (!supabase) {
        throw new Error('Supabase is not configured')
    }

    const { data, error } = await supabase
        .from('suppliers')
        .update({
            name: supplierData.name,
            contact: supplierData.contact,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()

    if (error) {
        throw error
    }

    return data?.[0]
}

export async function deleteSupplier(id) {
    if (!supabase) {
        throw new Error('Supabase is not configured')
    }

    const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id)

    if (error) {
        throw error
    }
}
