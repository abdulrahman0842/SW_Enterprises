import { supabase } from '../lib/supabase'
import { prepareSaleData } from './saleHelper'

export async function createSale(saleData) {
    if (!supabase) {
        throw new Error('Supabase is not configured')
    }


    // // Validate customer
    // if (!saleData.customer_id) {
    //     throw new Error('Customer is required')
    // }
    // // Validate sale date
    // if (!saleData.date) {
    //     throw new Error('Sale date is required')
    // }


    // // Validate items

    // if (
    //     !Array.isArray(saleData.items) ||
    //     saleData.items.length === 0
    // ) {
    //     throw new Error('At least one item is required')
    // }


    // // Payment

    // const paymentStatus =
    //     saleData.payment_status || 'Pending'

    // const totalAmount = Number(
    //     saleData.total_amount || 0
    // )

    // const amountPaid = Number(
    //     saleData.amount_paid || 0
    // )

    // const balanceAmount = Number(
    //     saleData.balance_amount ??
    //     totalAmount - amountPaid
    // )

    // if (
    //     !['Paid', 'Pending', 'Partial'].includes(
    //         paymentStatus
    //     )
    // ) {
    //     throw new Error(
    //         'Payment status must be Paid, Pending, or Partial.'
    //     )
    // }

    // if (totalAmount <= 0) {
    //     throw new Error(
    //         'Total amount must be greater than zero.'
    //     )
    // }

    // if (
    //     Number.isNaN(amountPaid) ||
    //     amountPaid < 0
    // ) {
    //     throw new Error(
    //         'Amount paid must be a valid non-negative number.'
    //     )
    // }

    // if (paymentStatus === 'Paid') {
    //     if (amountPaid !== totalAmount) {
    //         throw new Error(
    //             'Paid status requires amount paid to equal the total amount.'
    //         )
    //     }
    // }

    // if (paymentStatus === 'Pending') {
    //     if (amountPaid !== 0) {
    //         throw new Error(
    //             'Pending status requires amount paid to be zero.'
    //         )
    //     }
    // }

    // if (paymentStatus === 'Partial') {
    //     if (
    //         !(
    //             amountPaid > 0 &&
    //             amountPaid < totalAmount
    //         )
    //     ) {
    //         throw new Error(
    //             'Partial status requires amount paid to be greater than zero and less than total.'
    //         )
    //     }
    // }


    // // Clean items

    // const cleanedItems = saleData.items.map(
    //     (item, index) => {
    //         if (!item.product_id) {
    //             throw new Error(
    //                 `Item ${index + 1}: product_id is required`
    //             )
    //         }

    //         const quantity = parseInt(
    //             item.quantity,
    //             10
    //         )

    //         if (
    //             Number.isNaN(quantity) ||
    //             quantity <= 0
    //         ) {
    //             throw new Error(
    //                 `Item ${index + 1}: Quantity must be greater than zero.`
    //             )
    //         }

    //         // Purchase price per box
    //         const rate = parseFloat(item.rate)

    //         if (
    //             Number.isNaN(rate) ||
    //             rate < 0
    //         ) {
    //             throw new Error(
    //                 `Item ${index + 1}: Purchase rate must be zero or greater.`
    //             )
    //         }

    //         // Selling price per box
    //         const mrp = parseFloat(item.mrp)

    //         if (
    //             Number.isNaN(mrp) ||
    //             mrp < 0
    //         ) {
    //             throw new Error(
    //                 `Item ${index + 1}: MRP must be zero or greater.`
    //             )
    //         }

    //         return {
    //             mrp,
    //             rate,
    //             quantity,
    //             product_id: Number(item.product_id),
    //         }
    //     }
    // )


    // Debug

    // Validate and Clean Data
    const { paymentStatus,
        totalAmount,
        amountPaid,
        balanceAmount,
        cleanedItems } = prepareSaleData(saleData)

    console.log('Sending sale data:', {
        date: saleData.date,
        customer_id: saleData.customer_id,
        items: cleanedItems,
        total_amount: totalAmount,
        payment_status: paymentStatus,
        amount_paid: amountPaid,
        balance_amount: balanceAmount,
    })


    // Create sale transaction

    const { data, error } =
        await supabase.rpc(
            'create_sale_transaction',
            {
                p_date: saleData.date,

                p_customer_id:
                    Number(saleData.customer_id),

                p_items: cleanedItems,

                p_total_amount:
                    totalAmount,

                p_payment_status:
                    paymentStatus,

                p_amount_paid:
                    amountPaid,

                p_balance_amount:
                    balanceAmount,
            }
        )


    // Handle RPC error

    if (error) {
        console.error(
            'Create sale RPC error:',
            error
        )

        if (
            error.message.includes(
                'Insufficient stock'
            )
        ) {
            throw new Error(error.message)
        }

        if (
            error.message.includes(
                'Customer not found'
            )
        ) {
            throw new Error(
                'Selected customer not found.'
            )
        }

        if (
            error.message.includes(
                'Product'
            )
        ) {
            throw new Error(error.message)
        }

        if (
            error.message.includes(
                'Invalid sale item'
            )
        ) {
            throw new Error(
                'Invalid sale item data. Please check the product, quantity and MRP.'
            )
        }

        throw new Error(
            'Failed to create sale: ' +
            error.message
        )
    }


    // Handle RPC response

    if (!data || data.length === 0) {
        throw new Error(
            'Sale created but response is empty.'
        )
    }

    return data[0]
}

export async function updateSale(saleId, saleData) {
    if (!supabase) {
        throw new Error('Supabase is not configured')
    }

    const { paymentStatus,
        totalAmount,
        amountPaid,
        balanceAmount,
        cleanedItems, } = prepareSaleData(saleData)


    // Debug
    console.log('Updating sale:', {
        sale_id: saleId,
        date: saleData.date,
        customer_id: saleData.customer_id,
        items: cleanedItems,
        total_amount: totalAmount,
        payment_status: paymentStatus,
        amount_paid: amountPaid,
        balance_amount: balanceAmount,
    })


    // Update sale transaction

    const { data, error } =
        await supabase.rpc(
            'update_sale_transaction',
            {
                p_sale_id: Number(saleId),

                p_date: saleData.date,

                p_customer_id:
                    Number(saleData.customer_id),

                p_items: cleanedItems,

                p_total_amount:
                    totalAmount,

                p_payment_status:
                    paymentStatus,

                p_amount_paid:
                    amountPaid,

                p_balance_amount:
                    balanceAmount,
            }
        )


    // Handle RPC error

    if (error) {
        console.error(
            'Update sale RPC error:',
            error
        )

        if (
            error.message.includes(
                'Insufficient stock'
            )
        ) {
            throw new Error(error.message)
        }

        if (
            error.message.includes(
                'Sale not found'
            )
        ) {
            throw new Error(
                'Sale not found.'
            )
        }

        if (
            error.message.includes(
                'Customer not found'
            )
        ) {
            throw new Error(
                'Selected customer not found.'
            )
        }

        if (
            error.message.includes(
                'Product'
            )
        ) {
            throw new Error(error.message)
        }

        if (
            error.message.includes(
                'Invalid sale item'
            )
        ) {
            throw new Error(
                'Invalid sale item data. Please check the product, quantity and MRP.'
            )
        }

        throw new Error(
            'Failed to update sale: ' +
            error.message
        )
    }


    // Handle response

    if (!data || data.length === 0) {
        throw new Error(
            'Sale updated but response is empty.'
        )
    }

    return data[0]
}

export async function deleteSale(saleId) {
    if (!supabase) {
        throw new Error('Supabase is not configured')
    }

    if (!saleId) {
        throw new Error('Sale ID is required')
    }

    console.log('Deleting sale:', saleId)

    const { data, error } =
        await supabase.rpc(
            'delete_sale_transaction',
            {
                p_sale_id: Number(saleId),
            }
        )

    if (error) {
        console.error(
            'Delete sale RPC error:',
            error
        )

        if (
            error.message.includes(
                'Sale not found'
            )
        ) {
            throw new Error(
                'Sale not found.'
            )
        }

        throw new Error(
            'Failed to delete sale: ' +
            error.message
        )
    }

    return data
}