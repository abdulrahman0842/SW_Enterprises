import { pdf } from '@react-pdf/renderer'
import { InvoicePDF } from '../components/sale/InvoicePDF'

export async function shareInvoice({
    sale,
    productsById,
}) {
    try {
        if (!sale) {
            throw new Error('Sale data is missing')
        }

        // Generate PDF
        const blob = await pdf(
            <InvoicePDF
                sale={sale}
                productsById={productsById}
            />
        ).toBlob()

        // Convert Blob → File
        const file = new File(
            [blob],
            `Invoice-${sale.id || 'N/A'}.pdf`,
            {
                type: 'application/pdf',
            }
        )

        // Check whether browser supports sharing files
        if (
            !navigator.share ||
            !navigator.canShare ||
            !navigator.canShare({ files: [file] })
        ) {
            // Fallback: download PDF
            const url = URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = `Invoice-${sale.id || 'N/A'}.pdf`

            document.body.appendChild(link)
            link.click()
            link.remove()

            URL.revokeObjectURL(url)

            return {
                success: true,
                shared: false,
                downloaded: true,
            }
        }

        // Open native/system share sheet
        await navigator.share({
            title: `Invoice #${sale.id || 'N/A'}`,
            text: 'Invoice from SW Enterprises',
            files: [file],
        })

        return {
            success: true,
            shared: true,
            downloaded: false,
        }

    } catch (error) {

        // User cancelled share dialog
        if (error?.name === 'AbortError') {
            return {
                success: false,
                cancelled: true,
            }
        }

        console.error(
            'Failed to share invoice:',
            error
        )

        throw error
    }
}