import { supabase } from '../lib/supabase'

export async function createSale(saleData) {
    if (!supabase) {
        throw new Error('Supabase is not configured')
    }

    // Validate input
    if (!saleData.customer_name?.trim()) {
        throw new Error('Customer name is required')
    }

    if (!saleData.customer_contact?.trim()) {
        throw new Error('Customer contact is required')
    }

    if (!Array.isArray(saleData.items) || saleData.items.length === 0) {
        throw new Error('At least one item is required')
    }

    // Clean and validate items - only include required fields
    const cleanedItems = saleData.items.map((item, index) => {
        if (!item.product_id) {
            throw new Error(`Item ${index + 1}: product_id is required`)
        }

        const quantity = parseInt(item.quantity)
        if (isNaN(quantity) || quantity <= 0) {
            throw new Error(
                `Item ${index + 1}: Invalid quantity. Must be a positive number.`
            )
        }

        const rate = parseFloat(item.rate)
        if (isNaN(rate) || rate < 0) {
            throw new Error(`Item ${index + 1}: Invalid rate. Must be 0 or greater.`)
        }

        const mrp = parseFloat(item.mrp)
        if (isNaN(mrp) || mrp < 0) {
            throw new Error(`Item ${index + 1}: Invalid MRP. Must be 0 or greater.`)
        }

        // Return only the fields needed for JSONB storage
        // Ensure all are numbers, not strings
        const cleaned = {
            product_id: item.product_id,
            rate: rate,
            mrp: mrp,
            quantity: quantity,
        }

        return cleaned
    })

    // Debug: log what we're sending
    console.log('Sending sale data:', {
        customer_id: saleData.customer_id,
        customer_name: saleData.customer_name,
        customer_contact: saleData.customer_contact,
        items: cleanedItems,
        total_amount: saleData.total_amount,
    })

    // Call the RPC function with all required parameters
    const { data, error } = await supabase.rpc('create_sale_transaction', {
        p_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        p_customer_id: saleData.customer_id || null,
        p_customer_name: saleData.customer_name.trim(),
        p_customer_contact: saleData.customer_contact.trim(),
        p_items: cleanedItems, // Send only required fields with proper types
        p_total_amount: parseFloat(saleData.total_amount),
        p_payment_status: 'Pending',
        p_amount_paid: 0,
        p_balance_amount: parseFloat(saleData.total_amount),
    })

    if (error) {
        console.error('RPC Error:', error)
        // Parse Supabase RPC error messages
        if (error.message.includes('Insufficient stock')) {
            throw new Error(error.message)
        }
        if (error.message.includes('Customer not found')) {
            throw new Error('Selected customer not found')
        }
        if (error.message.includes('Product')) {
            throw new Error(error.message)
        }
        if (error.message.includes('Invalid sale item')) {
            throw new Error('Invalid sale data. Please check all fields are populated correctly.')
        }
        throw new Error('Failed to create sale: ' + error.message)
    }

    // Handle the response - it comes back as an array since we use RETURN QUERY
    if (!data || data.length === 0) {
        throw new Error('Sale created but response is empty')
    }

    return data[0]
}
