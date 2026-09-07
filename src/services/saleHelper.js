function validateSaleData(saleData) {
    // -----------------------------
    // Validate customer
    // -----------------------------
    if (!saleData.customer_id) {
        throw new Error('Customer is required')
    }

    // -----------------------------
    // Validate sale date
    // -----------------------------
    if (!saleData.date) {
        throw new Error('Sale date is required')
    }

    // -----------------------------
    // Validate items
    // -----------------------------
    if (
        !Array.isArray(saleData.items) ||
        saleData.items.length === 0
    ) {
        throw new Error('At least one item is required')
    }

    // -----------------------------
    // Payment
    // -----------------------------
    const paymentStatus =
        saleData.payment_status || 'Pending'

    const totalAmount = Number(
        saleData.total_amount || 0
    )

    const amountPaid = Number(
        saleData.amount_paid || 0
    )

    const balanceAmount = Number(
        saleData.balance_amount ??
        totalAmount - amountPaid
    )

    // -----------------------------
    // Validate payment status
    // -----------------------------
    if (
        !['Paid', 'Pending', 'Partial'].includes(
            paymentStatus
        )
    ) {
        throw new Error(
            'Payment status must be Paid, Pending, or Partial.'
        )
    }

    if (totalAmount <= 0) {
        throw new Error(
            'Total amount must be greater than zero.'
        )
    }

    if (
        Number.isNaN(amountPaid) ||
        amountPaid < 0
    ) {
        throw new Error(
            'Amount paid must be a valid non-negative number.'
        )
    }

    if (paymentStatus === 'Paid') {
        if (amountPaid !== totalAmount) {
            throw new Error(
                'Paid status requires amount paid to equal the total amount.'
            )
        }
    }

    if (paymentStatus === 'Pending') {
        if (amountPaid !== 0) {
            throw new Error(
                'Pending status requires amount paid to be zero.'
            )
        }
    }

    if (paymentStatus === 'Partial') {
        if (
            !(
                amountPaid > 0 &&
                amountPaid < totalAmount
            )
        ) {
            throw new Error(
                'Partial status requires amount paid to be greater than zero and less than total.'
            )
        }
    }

    return {
        paymentStatus,
        totalAmount,
        amountPaid,
        balanceAmount,
    }
}
function cleanSaleItems(items) {
    return items.map((item, index) => {
        if (!item.product_id) {
            throw new Error(
                `Item ${index + 1}: product_id is required`
            )
        }

        const quantity = parseInt(
            item.quantity,
            10
        )

        if (
            Number.isNaN(quantity) ||
            quantity <= 0
        ) {
            throw new Error(
                `Item ${index + 1}: Quantity must be greater than zero.`
            )
        }

        const rate = parseFloat(item.rate)

        if (
            Number.isNaN(rate) ||
            rate < 0
        ) {
            throw new Error(
                `Item ${index + 1}: Purchase rate must be zero or greater.`
            )
        }

        const mrp = parseFloat(item.mrp)

        if (
            Number.isNaN(mrp) ||
            mrp < 0
        ) {
            throw new Error(
                `Item ${index + 1}: MRP must be zero or greater.`
            )
        }

        return {
            mrp,
            rate,
            quantity,
            product_id: Number(item.product_id),
        }
    })
}

export function prepareSaleData(saleData) {
    // validation
    const {
        paymentStatus,
        totalAmount,
        amountPaid,
        balanceAmount } = validateSaleData(saleData)

    // item cleaning
    const cleanedItems = cleanSaleItems(saleData.items)
    return {
        paymentStatus,
        totalAmount,
        amountPaid,
        balanceAmount,
        cleanedItems,
    }
}