import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Link
} from '@react-pdf/renderer'

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Helvetica',
        color: '#222',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    businessSection: {
        width: '60%',
    },

    businessName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 6,
    },

    businessInfo: {
        fontSize: 10,
        color: '#555',
        marginBottom: 3,
    },
    businessLink: {
        color: '#555',
        textDecoration: 'underline',
    },

    invoiceSection: {
        width: '35%',
        alignItems: 'flex-end',
    },

    invoiceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },

    invoiceInfo: {
        fontSize: 10,
        marginBottom: 3,
    },

    divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#222',
        marginBottom: 20,
    },

    customerSection: {
        marginBottom: 20,
    },

    sectionTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        marginBottom: 6,
        textTransform: 'uppercase',
    },

    customerName: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 3,
    },

    customerInfo: {
        fontSize: 10,
        color: '#555',
    },

    table: {
        width: '100%',
        marginTop: 5,
    },

    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#eeeeee',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#cccccc',
        paddingVertical: 8,
    },

    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#dddddd',
        paddingVertical: 9,
    },

    colNo: {
        width: '7%',
        textAlign: 'center',
    },

    colProduct: {
        width: '38%',
    },

    colQty: {
        width: '15%',
        textAlign: 'center',
    },

    colRate: {
        width: '18%',
        textAlign: 'right',
    },

    colAmount: {
        width: '22%',
        textAlign: 'right',
    },

    headerText: {
        fontSize: 9,
        fontWeight: 'bold',
    },

    cellText: {
        fontSize: 9,
    },

    summaryContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

    summary: {
        width: '45%',
    },

    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 7,
    },

    summaryLabel: {
        fontSize: 10,
    },

    summaryValue: {
        fontSize: 10,
        textAlign: 'right',
    },

    totalRow: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#222',
        paddingVertical: 9,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    totalLabel: {
        fontSize: 12,
        fontWeight: 'bold',
    },

    totalValue: {
        fontSize: 12,
        fontWeight: 'bold',
    },

    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 8,
        backgroundColor: '#f5f5f5',
    },

    balanceLabel: {
        fontSize: 10,
        fontWeight: 'bold',
    },

    balanceValue: {
        fontSize: 10,
        fontWeight: 'bold',
    },

    footer: {
        marginTop: 50,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#dddddd',
        alignItems: 'center',
    },

    thankYou: {
        fontSize: 11,
        marginBottom: 5,
    },

    footerText: {
        fontSize: 9,
        color: '#666',
        marginBottom: 2,
    },
    developerFooter: {
        position: 'absolute',
        bottom: 18,
        left: 40,
        right: 40,
        alignItems: 'center',
    },

    developerText: {
        fontSize: 7,
        color: '#999',
        marginBottom: 2,
    },

    developerContact: {
        fontSize: 7,
        color: '#999',
    },
    developerLink: {
        color: '#555',
        textDecoration: 'underline',
    },
    watermark: {
        position: 'absolute',
        top: 360,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 58,
        fontWeight: 'bold',
        color: '#d1d5db',
        opacity: 0.18,
        transform: 'rotate(-35deg)',
    },
})

export function InvoicePDF({ sale, productsById }) {
    const items = Array.isArray(sale?.items)
        ? sale.items
        : []

    const total = Number(sale?.total_amount || 0)
    const amountPaid = Number(sale?.amount_paid || 0)
    const balance = Number(sale?.balance_amount || 0)

    const contact_no = import.meta.env.VITE_CONTACT_NO
    return (
        <Document
            title={`Invoice #${sale?.id || 'N/A'}`}
            author="SW Enterprises"
            subject="Sales Invoice"
        >
            <Page size="A4" style={styles.page}>
                {/* WATERMARK */}
                <Text style={styles.watermark}>
                    SW ENTERPRISES
                </Text>
                {/* BUSINESS HEADER */}
                <View style={styles.header}>

                    <View style={styles.businessSection}>
                        <Text style={styles.businessName}>
                            SW Enterprises
                        </Text>

                        <Text style={styles.businessInfo}>
                            Malegaon - 423203
                        </Text>

                        <Text style={styles.businessInfo}>
                            Contact:{' '}
                            <Link
                                src={`tel:+91${contact_no}`}
                                style={styles.businessLink}
                            >
                                +91 {contact_no}
                            </Link>
                        </Text>
                    </View>

                    <View style={styles.invoiceSection}>
                        <Text style={styles.invoiceTitle}>
                            INVOICE
                        </Text>

                        <Text style={styles.invoiceInfo}>
                            Invoice No: #{sale?.id || 'N/A'}
                        </Text>

                        <Text style={styles.invoiceInfo}>
                            Date: {sale?.date || 'N/A'}
                        </Text>
                    </View>

                </View>

                <View style={styles.divider} />

                {/* CUSTOMER */}
                <View style={styles.customerSection}>

                    <Text style={styles.sectionTitle}>
                        Bill To
                    </Text>

                    <Text style={styles.customerName}>
                        {sale?.customer_name || 'Customer'}
                    </Text>

                    <Text style={styles.customerInfo}>
                        Contact: {sale?.customer_contact || 'N/A'}
                    </Text>

                </View>

                {/* ITEMS TABLE */}
                <View style={styles.table}>

                    <View style={styles.tableHeader}>

                        <Text style={[styles.colNo, styles.headerText]}>
                            #
                        </Text>

                        <Text style={[styles.colProduct, styles.headerText]}>
                            Product
                        </Text>

                        <Text style={[styles.colQty, styles.headerText]}>
                            Qty
                        </Text>

                        <Text style={[styles.colRate, styles.headerText]}>
                            Rate
                        </Text>

                        <Text style={[styles.colAmount, styles.headerText]}>
                            Amount
                        </Text>

                    </View>

                    {items.length === 0 ? (

                        <View style={styles.tableRow}>
                            <Text style={styles.cellText}>
                                No items
                            </Text>
                        </View>

                    ) : (

                        items.map((item, index) => {

                            const product =
                                productsById.get(
                                    Number(item.product_id)
                                ) || {}

                            const productName =
                                product.name ||
                                `Product ${item.product_id}`

                            const quantity =
                                Number(item.quantity || 0)

                            // MRP is your actual selling price
                            const sellingPrice =
                                Number(item.mrp || 0)

                            const itemTotal =
                                quantity * sellingPrice

                            return (
                                <View
                                    key={`${item.product_id}-${index}`}
                                    style={styles.tableRow}
                                >

                                    <Text
                                        style={[
                                            styles.colNo,
                                            styles.cellText,
                                        ]}
                                    >
                                        {index + 1}
                                    </Text>

                                    <Text
                                        style={[
                                            styles.colProduct,
                                            styles.cellText,
                                        ]}
                                    >
                                        {productName}
                                    </Text>

                                    <Text
                                        style={[
                                            styles.colQty,
                                            styles.cellText,
                                        ]}
                                    >
                                        {quantity} box
                                    </Text>

                                    <Text
                                        style={[
                                            styles.colRate,
                                            styles.cellText,
                                        ]}
                                    >
                                        Rs. {sellingPrice.toFixed(2)}
                                    </Text>

                                    <Text
                                        style={[
                                            styles.colAmount,
                                            styles.cellText,
                                        ]}
                                    >
                                        Rs. {itemTotal.toFixed(2)}
                                    </Text>

                                </View>
                            )
                        })
                    )}

                </View>

                {/* PAYMENT SUMMARY */}
                <View style={styles.summaryContainer}>

                    <View style={styles.summary}>

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>
                                Total
                            </Text>

                            <Text style={styles.totalValue}>
                                Rs. {total.toFixed(2)}
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>
                                Payment Status
                            </Text>

                            <Text style={styles.summaryValue}>
                                {sale?.payment_status || 'Pending'}
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>
                                Amount Paid
                            </Text>

                            <Text style={styles.summaryValue}>
                                Rs. {amountPaid.toFixed(2)}
                            </Text>
                        </View>

                        <View style={styles.balanceRow}>
                            <Text style={styles.balanceLabel}>
                                Balance Due
                            </Text>

                            <Text style={styles.balanceValue}>
                                Rs. {balance.toFixed(2)}
                            </Text>
                        </View>

                    </View>

                </View>

                {/* FOOTER */}
                <View style={styles.footer}>

                    <Text style={styles.thankYou}>
                        Thank you for your business!
                    </Text>

                    <Text style={styles.footerText}>
                        SW Enterprises
                    </Text>

                    <Text style={styles.footerText}>
                        Malegaon - 423203
                    </Text>

                </View>

                {/* Developer */}
                <View style={styles.developerFooter}>

                    <Text style={styles.developerText}>
                        Developed by Abdul Rahman
                    </Text>

                    <Text style={styles.developerContact}>
                        Contact:{' '}

                        <Link
                            src="tel:+917447885249"
                            style={styles.developerLink}
                        >
                            +91 7447885249
                        </Link>

                        {' / '}

                        <Link
                            src="mailto:abdulrahmanmlg744@gmail.com"
                            style={styles.developerLink}
                        >
                            abdulrahmanmlg744@gmail.com
                        </Link>
                    </Text>

                </View>

            </Page>
        </Document>
    )
}