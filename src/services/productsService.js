import { supabase } from '../lib/supabase'

export async function fetchProducts() {
  if (!supabase) {
    throw new Error('Supabase is not configured')
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

export async function createProduct(name, description, quantity_per_box) {
  if (!supabase) {
    throw new Error('Supabase is not configured')
  }

  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        name: name.trim(),
        description: description.trim() || null,
        quantity_per_box: Number(quantity_per_box),
        rate: 0,
        mrp: 0,
        stock: 0,
      },
    ])
    .select()

  if (error) {
    throw error
  }

  return data[0]
}

export async function updateProduct(id, name, description, quantity_per_box) {
  if (!supabase) {
    throw new Error('Supabase is not configured')
  }

  const { data, error } = await supabase
    .from('products')
    .update({
      name: name.trim(),
      description: description.trim() || null,
      quantity_per_box: Number(quantity_per_box),
    })
    .eq('id', id)
    .select()

  if (error) {
    throw error
  }

  return data[0]
}

export async function deleteProduct(id) {
  if (!supabase) {
    throw new Error('Supabase is not configured')
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
}

export async function checkProductNameExists(name, excludeId = null) {
  if (!supabase) {
    throw new Error('Supabase is not configured')
  }

  let query = supabase
    .from('products')
    .select('id', { count: 'exact' })
    .ilike('name', name.trim())

  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { count, error } = await query

  if (error) {
    throw error
  }

  return count > 0
}
