import { supabase } from '../lib/supabase'

export async function fetchCustomers() {
    if (!supabase) {
        throw new Error('Supabase is not configured')
    }

    const { data, error } = await supabase
        .from('customers')
        .select('id, name, contact, address, created_at')
        .order('name', { ascending: true })

    if (error) {
        throw error
    }

    return data
}

export async function createCustomer(customerData) {
    if (!supabase) {
        throw new Error('Supabase is not configured')
    }

    const { data, error } = await supabase
        .from('customers')
        .insert([
            {
                name: customerData.name,
                contact: customerData.contact,
                address: customerData.address || null,
            },
        ])
        .select()

    if (error) {
        throw error
    }

    return data?.[0]
}

export async function updateCustomer(id, customerData) {
    if (!supabase) {
        throw new Error('Supabase is not configured')
    }

    const { data, error } = await supabase
        .from('customers')
        .update({
            name: customerData.name,
            contact: customerData.contact,
            address: customerData.address || null,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()

    if (error) {
        throw error
    }

    return data?.[0]
}

export async function deleteCustomer(id) {
    if (!supabase) {
        throw new Error('Supabase is not configured')
    }

    const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)

    if (error) {
        throw error
    }
}
