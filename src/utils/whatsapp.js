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
    const customerName = sale?.customer_name || 'Customer'
    const customerContact = sale?.customer_contact || 'N/A'
    const items = Array.isArray(sale?.items) ? sale.items : []

    const lines = [
        '*Invoice*',
        '',
        `Customer: ${customerName}`,
        `Contact: ${customerContact}`,
        '',
        'Items:',
        '',
    ]

    if (items.length === 0) {
        lines.push('No items')
    } else {
        items.forEach((item) => {
            const product = productsById.get(Number(item.product_id)) || {}
            const productName = product.name || `Product ${item.product_id}`
            const qty = Number(item.quantity || 0)
            const rate = Number(item.rate || 0)
            const total = qty * rate

            lines.push(`${productName}`)
            lines.push(`${qty} boxes × ₹${rate.toFixed(2)} = ₹${total.toFixed(2)}`)
            lines.push('')
        })
    }

    lines.push(`Total: ₹${Number(sale?.total_amount || 0).toFixed(2)}`)
    lines.push(`Payment Status: ${sale?.payment_status || 'Pending'}`)
    lines.push(`Amount Paid: ₹${Number(sale?.amount_paid || 0).toFixed(2)}`)
    lines.push(`Balance: ₹${Number(sale?.balance_amount || 0).toFixed(2)}`)
    lines.push('')
    lines.push('Thank you for your business!')

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
