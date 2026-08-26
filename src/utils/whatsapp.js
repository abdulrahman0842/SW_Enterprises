export function normalizeWhatsappNumber(rawPhone) {
    if (!rawPhone) {
        return ''
    }

    let digits = String(rawPhone).replace(/\D/g, '')

    if (!digits) {
        return ''
    }

    if (digits.startsWith('91') && digits.length > 10) {
        return digits
    }

    if (digits.startsWith('0')) {
        digits = digits.slice(1)
    }

    if (digits.length === 10) {
        return `91${digits}`
    }

    if (digits.startsWith('91') && digits.length > 10) {
        return digits
    }

    return digits
}

export function buildInvoiceMessage(sale, productsById) {
    const businessName = 'SW Enterprises'
    const customerName = sale?.customer_name || 'Customer'
    const customerContact = sale?.customer_contact || 'N/A'
    const items = Array.isArray(sale?.items)
        ? sale.items
        : []

    const lines = [
        `*${businessName}*`,
        `*SALES INVOICE*`,
        '',
        `Invoice No: #${sale?.id || 'N/A'}`,
        `Date: ${sale?.date || 'N/A'}`,
        '',
        `*Customer:* ${customerName}`,
        `*Contact:* ${customerContact}`,
        '',
        '*Items*',
        '────────────────────',
    ]

    if (items.length === 0) {
        lines.push('No items')
    } else {
        items.forEach((item, index) => {
            const product =
                productsById.get(
                    Number(item.product_id)
                ) || {}

            const productName =
                product.name ||
                `Product ${item.product_id}`

            const quantity = Number(
                item.quantity || 0
            )

            // MRP is the actual selling price
            const sellingPrice = Number(
                item.mrp || 0
            )

            const itemTotal =
                quantity * sellingPrice

            lines.push(
                `*${index + 1}. ${productName}*`
            )

            lines.push(
                `${quantity} box × ₹${sellingPrice.toFixed(2)} = *₹${itemTotal.toFixed(2)}*`
            )

            if (index < items.length - 1) {
                lines.push('')
            }
        })
    }

    const total = Number(
        sale?.total_amount || 0
    )

    const amountPaid = Number(
        sale?.amount_paid || 0
    )

    const balance = Number(
        sale?.balance_amount || 0
    )

    lines.push('')
    lines.push('────────────────────')
    lines.push(`*Total: ₹${total.toFixed(2)}*`)
    lines.push('')
    lines.push(
        `Payment: *${sale?.payment_status || 'Pending'}*`
    )
    lines.push(
        `Amount Paid: ₹${amountPaid.toFixed(2)}`
    )
    lines.push(
        `Balance Due: *₹${balance.toFixed(2)}*`
    )
    lines.push('')
    lines.push('Thank you for your business!')
    lines.push(`*${businessName}*`)

    return lines.join('\n')
}
export function openWhatsappInvoice(sale, productsById) {
    if (!sale) {
        return
    }

    const message = buildInvoiceMessage(sale, productsById)
    const waNumber = normalizeWhatsappNumber(sale.customer_contact)
    const baseUrl = waNumber ? `https://wa.me/${waNumber}` : 'https://wa.me/'
    const url = `${baseUrl}?text=${encodeURIComponent(message)}`

    window.open(url, '_blank', 'noopener,noreferrer')
}
