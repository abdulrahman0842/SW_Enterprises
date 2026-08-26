import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { fetchCustomers } from '../../services/customersService'
import { fetchProducts } from '../../services/productsService'
import { SaleItems } from './SaleItems'
import { SaleCheckout } from './SaleCheckout'

export const SalesForm = forwardRef(function SalesForm(
    { onSubmit, isLoading = false },
    ref
) {
    const [step, setStep] = useState(1)

    const [customers, setCustomers] = useState([])
    const [products, setProducts] = useState([])
    const [loadingData, setLoadingData] = useState(true)

    const [saleDate, setSaleDate] = useState(
        new Date().toISOString().split('T')[0]
    )

    const [customerId, setCustomerId] = useState('')
    const [items, setItems] = useState([])

    const [paymentStatus, setPaymentStatus] = useState('Pending')
    const [amountPaid, setAmountPaid] = useState('0')

    const [errors, setErrors] = useState({})

    useImperativeHandle(ref, () => ({
        resetForm,
    }))

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        try {
            const [customersData, productsData] = await Promise.all([
                fetchCustomers(),
                fetchProducts(),
            ])

            setCustomers(customersData)
            setProducts(productsData)
        } catch (error) {
            console.error('Failed to load sale data:', error)
        } finally {
            setLoadingData(false)
        }
    }

    function resetForm() {
        setStep(1)
        setSaleDate(new Date().toISOString().split('T')[0])
        setCustomerId('')
        setItems([])
        setPaymentStatus('Pending')
        setAmountPaid('0')
        setErrors({})
    }

    function calculateTotal() {
        return items.reduce(
            (total, item) =>
                total + item.quantity * item.mrp,
            0
        )
    }

    function calculateBalance() {
        const total = calculateTotal()
        const paid = Number(amountPaid || 0)

        if (paymentStatus === 'Paid') {
            return 0
        }

        if (paymentStatus === 'Pending') {
            return total
        }

        return Math.max(total - paid, 0)
    }

    function handleProductsContinue() {
        if (items.length === 0) {
            setErrors({
                items: 'Please add at least one product.',
            })
            return
        }

        setErrors({})
        setStep(2)
    }

    function handleBackToProducts() {
        setErrors({})
        setStep(1)
    }

    function validateCheckout() {
        const newErrors = {}

        if (!saleDate) {
            newErrors.date = 'Please select a sale date.'
        }

        if (!customerId) {
            newErrors.customer = 'Please select a customer.'
        }

        const total = calculateTotal()
        const paid = Number(amountPaid || 0)

        if (Number.isNaN(paid) || paid < 0) {
            newErrors.payment =
                'Amount paid must be a valid number.'
        }

        if (paid > total) {
            newErrors.payment =
                'Amount paid cannot be greater than the total.'
        }

        if (paymentStatus === 'Paid' && paid !== total) {
            newErrors.payment =
                'Paid status requires the full amount to be paid.'
        }

        if (paymentStatus === 'Pending' && paid !== 0) {
            newErrors.payment =
                'Pending status requires amount paid to be zero.'
        }

        if (
            paymentStatus === 'Partial' &&
            !(paid > 0 && paid < total)
        ) {
            newErrors.payment =
                'Partial payment must be greater than zero and less than total.'
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    function handleSubmit(e) {
        e.preventDefault()

        if (!validateCheckout()) {
            return
        }

        const total = calculateTotal()
        const paid = Number(amountPaid || 0)

        const saleData = {
            date: saleDate,
            customer_id: Number(customerId),
            items,
            total_amount: total,
            payment_status: paymentStatus,
            amount_paid: paid,
            balance_amount: calculateBalance(),
        }

        onSubmit(saleData)
    }

    if (loadingData) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-sky-600" />

                    <p className="mt-3 text-sm text-slate-500">
                        Loading sale form...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col"
        >
            {/* Step indicator */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-400">
                        Step {step} of 2
                    </p>

                    <h2 className="text-lg font-semibold text-slate-900">
                        {step === 1
                            ? 'Products'
                            : 'Checkout'}
                    </h2>
                </div>

                <div className="flex gap-1.5">
                    <span
                        className={`h-2 w-6 rounded-full ${step === 1
                                ? 'bg-sky-600'
                                : 'bg-slate-200'
                            }`}
                    />

                    <span
                        className={`h-2 w-6 rounded-full ${step === 2
                                ? 'bg-sky-600'
                                : 'bg-slate-200'
                            }`}
                    />
                </div>
            </div>

            {step === 1 && (
                <SaleItems
                    products={products}
                    items={items}
                    setItems={setItems}
                    onContinue={handleProductsContinue}
                    errors={errors}
                />
            )}

            {step === 2 && (
                <SaleCheckout
                    customers={customers}
                    saleDate={saleDate}
                    setSaleDate={setSaleDate}
                    customerId={customerId}
                    setCustomerId={setCustomerId}
                    items={items}
                    paymentStatus={paymentStatus}
                    setPaymentStatus={setPaymentStatus}
                    amountPaid={amountPaid}
                    setAmountPaid={setAmountPaid}
                    total={calculateTotal()}
                    balance={calculateBalance()}
                    errors={errors}
                    onBack={handleBackToProducts}
                    isLoading={isLoading}
                />
            )}
        </form>
    )
})


// import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
// import { fetchCustomers } from '../services/customersService'
// import { fetchProducts } from '../services/productsService'

// export const SalesForm = forwardRef(function SalesForm(
//     { onSubmit, isLoading = false },
//     ref
// ) {
//     const [step, setStep] = useState(1)

//     const [customers, setCustomers] = useState([])
//     const [products, setProducts] = useState([])
//     const [loadingData, setLoadingData] = useState(true)

//     const [customerId, setCustomerId] = useState('')

//     const [items, setItems] = useState([])

//     const [selectedProductId, setSelectedProductId] = useState('')
//     const [quantity, setQuantity] = useState('1')
//     const [rate, setRate] = useState('')

//     const [paymentStatus, setPaymentStatus] = useState('Pending')
//     const [amountPaid, setAmountPaid] = useState('0')

//     const [errors, setErrors] = useState({})

//     useImperativeHandle(ref, () => ({
//         resetForm,
//     }))

//     useEffect(() => {
//         loadData()
//     }, [])

//     async function loadData() {
//         try {
//             const [customersData, productsData] = await Promise.all([
//                 fetchCustomers(),
//                 fetchProducts(),
//             ])

//             setCustomers(customersData)
//             setProducts(productsData)
//         } catch (error) {
//             console.error('Failed to load sale data:', error)
//         } finally {
//             setLoadingData(false)
//         }
//     }

//     function resetForm() {
//         setStep(1)
//         setCustomerId('')
//         setItems([])
//         setSelectedProductId('')
//         setQuantity('1')
//         setRate('')
//         setPaymentStatus('Pending')
//         setAmountPaid('0')
//         setErrors({})
//     }

//     function calculateItemTotal(item) {
//         return item.quantity * item.rate
//     }

//     function calculateUnits(item) {
//         return item.quantity * item.quantity_per_box
//     }

//     function calculateTotal() {
//         return items.reduce(
//             (total, item) => total + calculateItemTotal(item),
//             0
//         )
//     }

//     function calculateBalance() {
//         const total = calculateTotal()
//         const paid = Number(amountPaid || 0)

//         if (paymentStatus === 'Paid') {
//             return 0
//         }

//         if (paymentStatus === 'Pending') {
//             return total
//         }

//         return Math.max(total - paid, 0)
//     }

//     function handleProductChange(productId) {
//         setSelectedProductId(productId)

//         const product = products.find(
//             (item) => item.id === Number(productId)
//         )

//         if (product) {
//             setRate(String(product.rate ?? ''))
//         } else {
//             setRate('')
//         }

//         setErrors((prev) => ({
//             ...prev,
//             product: '',
//         }))
//     }

//     function handleAddItem() {
//         const newErrors = {}

//         if (!selectedProductId) {
//             newErrors.product = 'Please select a product'
//         }

//         const product = products.find(
//             (item) => item.id === Number(selectedProductId)
//         )

//         const itemQuantity = Number(quantity)
//         const itemRate = Number(rate)

//         if (!quantity || itemQuantity <= 0) {
//             newErrors.quantity = 'Enter a valid quantity'
//         }

//         if (rate === '' || Number.isNaN(itemRate) || itemRate < 0) {
//             newErrors.rate = 'Enter a valid rate'
//         }

//         if (product && itemQuantity > Number(product.stock)) {
//             newErrors.quantity = `Only ${product.stock} boxes available`
//         }

//         if (Object.keys(newErrors).length > 0) {
//             setErrors((prev) => ({
//                 ...prev,
//                 ...newErrors,
//             }))
//             return
//         }

//         const existingItem = items.find(
//             (item) => item.product_id === product.id
//         )

//         if (existingItem) {
//             setItems((prev) =>
//                 prev.map((item) =>
//                     item.product_id === product.id
//                         ? {
//                               ...item,
//                               quantity: itemQuantity,
//                               rate: itemRate,
//                           }
//                         : item
//                 )
//             )
//         } else {
//             setItems((prev) => [
//                 ...prev,
//                 {
//                     product_id: product.id,
//                     product_name: product.name,
//                     quantity_per_box: product.quantity_per_box,
//                     quantity: itemQuantity,
//                     rate: itemRate,
//                     mrp: product.mrp,
//                 },
//             ])
//         }

//         setSelectedProductId('')
//         setQuantity('')
//         setRate('')

//         setErrors((prev) => ({
//             ...prev,
//             product: '',
//             quantity: '',
//             rate: '',
//         }))
//     }

//     function handleRemoveItem(productId) {
//         setItems((prev) =>
//             prev.filter((item) => item.product_id !== productId)
//         )
//     }

//     function handleUpdateItem(productId, field, value) {
//         setItems((prev) =>
//             prev.map((item) => {
//                 if (item.product_id !== productId) {
//                     return item
//                 }

//                 const product = products.find(
//                     (p) => p.id === productId
//                 )

//                 let newValue = Number(value)

//                 if (field === 'quantity') {
//                     newValue = Math.max(1, newValue || 1)

//                     if (
//                         product &&
//                         newValue > Number(product.stock)
//                     ) {
//                         newValue = Number(product.stock)
//                     }
//                 }

//                 if (field === 'rate') {
//                     newValue = Math.max(0, newValue || 0)
//                 }

//                 return {
//                     ...item,
//                     [field]: newValue,
//                 }
//             })
//         )
//     }

//     function validateStepOne() {
//         if (items.length === 0) {
//             setErrors({
//                 items: 'Please add at least one product',
//             })
//             return false
//         }

//         setErrors({})
//         return true
//     }

//     function goToCheckout() {
//         if (!validateStepOne()) {
//             return
//         }

//         setStep(2)
//     }

//     function goBackToProducts() {
//         setStep(1)
//         setErrors({})
//     }

//     function validateCheckout() {
//         const newErrors = {}

//         if (!customerId) {
//             newErrors.customer = 'Please select a customer'
//         }

//         const total = calculateTotal()
//         const paid = Number(amountPaid || 0)

//         if (Number.isNaN(paid) || paid < 0) {
//             newErrors.payment =
//                 'Amount paid must be a valid number'
//         } else if (paid > total) {
//             newErrors.payment =
//                 'Amount paid cannot be greater than total'
//         }

//         if (paymentStatus === 'Paid' && paid !== total) {
//             newErrors.payment =
//                 'Paid status requires full payment'
//         }

//         if (paymentStatus === 'Pending' && paid !== 0) {
//             newErrors.payment =
//                 'Pending status requires amount paid to be zero'
//         }

//         if (
//             paymentStatus === 'Partial' &&
//             !(paid > 0 && paid < total)
//         ) {
//             newErrors.payment =
//                 'Partial payment must be greater than zero and less than total'
//         }

//         setErrors(newErrors)

//         return Object.keys(newErrors).length === 0
//     }

//     function handleSubmit(e) {
//         e.preventDefault()

//         if (!validateCheckout()) {
//             return
//         }

//         const total = calculateTotal()
//         const paid = Number(amountPaid || 0)

//         const saleData = {
//             customer_id: Number(customerId),
//             items,
//             total_amount: total,
//             payment_status: paymentStatus,
//             amount_paid: paid,
//             balance_amount: calculateBalance(),
//         }

//         onSubmit(saleData)
//     }

//     if (loadingData) {
//         return (
//             <div className="flex min-h-[300px] items-center justify-center">
//                 <div className="text-center">
//                     <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-sky-600" />

//                     <p className="mt-3 text-sm text-slate-500">
//                         Loading sale form...
//                     </p>
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <form
//             onSubmit={handleSubmit}
//             className="flex min-h-0 flex-col"
//         >
//             {/* Header */}
//             <div className="mb-4 flex items-center justify-between">
//                 <div>
//                     <p className="text-xs font-medium text-slate-400">
//                         Step {step} of 2
//                     </p>

//                     <h2 className="text-lg font-semibold text-slate-900">
//                         {step === 1
//                             ? 'Select Products'
//                             : 'Checkout'}
//                     </h2>
//                 </div>

//                 <div className="flex items-center gap-1.5">
//                     <span
//                         className={`h-2 w-2 rounded-full ${
//                             step >= 1
//                                 ? 'bg-sky-600'
//                                 : 'bg-slate-200'
//                         }`}
//                     />

//                     <span
//                         className={`h-2 w-2 rounded-full ${
//                             step >= 2
//                                 ? 'bg-sky-600'
//                                 : 'bg-slate-200'
//                         }`}
//                     />
//                 </div>
//             </div>

//             {/* =========================
//                 STEP 1
//             ========================== */}
//             {step === 1 && (
//                 <div className="space-y-4">
//                     {/* Add Product */}
//                     <section className="rounded-2xl border border-slate-200 bg-white p-4">
//                         <div className="mb-4">
//                             <h3 className="text-sm font-semibold text-slate-900">
//                                 Add Product
//                             </h3>

//                             <p className="mt-0.5 text-xs text-slate-500">
//                                 Select product, quantity and selling rate
//                             </p>
//                         </div>

//                         <div className="space-y-3">
//                             {/* Product */}
//                             <div>
//                                 <label className="mb-1.5 block text-xs font-semibold text-slate-700">
//                                     Product
//                                 </label>

//                                 <select
//                                     value={selectedProductId}
//                                     onChange={(e) =>
//                                         handleProductChange(
//                                             e.target.value
//                                         )
//                                     }
//                                     className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
//                                 >
//                                     <option value="">
//                                         Select product...
//                                     </option>

//                                     {products.map((product) => {
//                                         const added = items.some(
//                                             (item) =>
//                                                 item.product_id ===
//                                                 product.id
//                                         )

//                                         return (
//                                             <option
//                                                 key={product.id}
//                                                 value={product.id}
//                                             >
//                                                 {product.name}
//                                                 {added
//                                                     ? ' (added)'
//                                                     : ''}
//                                             </option>
//                                         )
//                                     })}
//                                 </select>

//                                 {errors.product && (
//                                     <p className="mt-1 text-xs text-rose-600">
//                                         {errors.product}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Selected product info */}
//                             {selectedProductId && (
//                                 <ProductInfo
//                                     product={products.find(
//                                         (p) =>
//                                             p.id ===
//                                             Number(
//                                                 selectedProductId
//                                             )
//                                     )}
//                                 />
//                             )}

//                             {/* Quantity + Rate */}
//                             <div className="grid grid-cols-2 gap-3">
//                                 <div>
//                                     <label className="mb-1.5 block text-xs font-semibold text-slate-700">
//                                         Boxes
//                                     </label>

//                                     <input
//                                         type="number"
//                                         min="1"
//                                         // value={quantity}
//                                         onChange={(e) =>
//                                             setQuantity(
//                                                 e.target.value
//                                             )
//                                         }
//                                         className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
//                                     />

//                                     {errors.quantity && (
//                                         <p className="mt-1 text-xs text-rose-600">
//                                             {errors.quantity}
//                                         </p>
//                                     )}
//                                 </div>

//                                 <div>
//                                     <label className="mb-1.5 block text-xs font-semibold text-slate-700">
//                                         Rate / Box
//                                     </label>

//                                     <input
//                                         type="number"
//                                         min="0"
//                                         step="0.01"
//                                         // value={rate}
//                                         onChange={(e) =>
//                                             setRate(
//                                                 e.target.value
//                                             )
//                                         }
//                                         className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
//                                     />

//                                     {errors.rate && (
//                                         <p className="mt-1 text-xs text-rose-600">
//                                             {errors.rate}
//                                         </p>
//                                     )}
//                                 </div>
//                             </div>

//                             <button
//                                 type="button"
//                                 onClick={handleAddItem}
//                                 className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
//                             >
//                                 + Add Product
//                             </button>
//                         </div>
//                     </section>

//                     {/* Items */}
//                     {items.length > 0 && (
//                         <section>
//                             <div className="mb-2 flex items-center justify-between">
//                                 <h3 className="text-sm font-semibold text-slate-900">
//                                     Sale Items
//                                 </h3>

//                                 <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
//                                     {items.length}{' '}
//                                     {items.length === 1
//                                         ? 'item'
//                                         : 'items'}
//                                 </span>
//                             </div>

//                             <div className="space-y-2.5">
//                                 {items.map((item) => (
//                                     <SaleItemCard
//                                         key={item.product_id}
//                                         item={item}
//                                         onRemove={
//                                             handleRemoveItem
//                                         }
//                                         onUpdate={
//                                             handleUpdateItem
//                                         }
//                                         calculateUnits={
//                                             calculateUnits
//                                         }
//                                         calculateItemTotal={
//                                             calculateItemTotal
//                                         }
//                                     />
//                                 ))}
//                             </div>
//                         </section>
//                     )}

//                     {errors.items && (
//                         <p className="rounded-xl bg-rose-50 px-3 py-2.5 text-xs text-rose-600">
//                             {errors.items}
//                         </p>
//                     )}

//                     {/* Sticky action */}
//                     <div className="sticky bottom-0 -mx-1 bg-white pt-2">
//                         <div className="mb-2 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
//                             <span className="text-sm text-slate-600">
//                                 Total
//                             </span>

//                             <span className="text-lg font-bold text-sky-700">
//                                 ₹{calculateTotal().toFixed(2)}
//                             </span>
//                         </div>

//                         <button
//                             type="button"
//                             onClick={goToCheckout}
//                             disabled={items.length === 0}
//                             className="w-full rounded-xl bg-sky-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
//                         >
//                             Continue to Checkout →
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* =========================
//                 STEP 2
//             ========================== */}
//             {step === 2 && (
//                 <div className="space-y-4">
//                     {/* Customer */}
//                     <section className="rounded-2xl border border-slate-200 bg-white p-4">
//                         <div className="mb-4">
//                             <h3 className="text-sm font-semibold text-slate-900">
//                                 Customer
//                             </h3>

//                             <p className="mt-0.5 text-xs text-slate-500">
//                                 Select the customer for this sale
//                             </p>
//                         </div>

//                         <select
//                             value={customerId}
//                             onChange={(e) => {
//                                 setCustomerId(e.target.value)

//                                 setErrors((prev) => ({
//                                     ...prev,
//                                     customer: '',
//                                 }))
//                             }}
//                             className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
//                         >
//                             <option value="">
//                                 Select customer...
//                             </option>

//                             {customers.map((customer) => (
//                                 <option
//                                     key={customer.id}
//                                     value={customer.id}
//                                 >
//                                     {customer.name}
//                                     {customer.contact
//                                         ? ` (${customer.contact})`
//                                         : ''}
//                                 </option>
//                             ))}
//                         </select>

//                         {errors.customer && (
//                             <p className="mt-1.5 text-xs text-rose-600">
//                                 {errors.customer}
//                             </p>
//                         )}

//                         {customerId && (
//                             <CustomerCard
//                                 customer={customers.find(
//                                     (customer) =>
//                                         customer.id ===
//                                         Number(customerId)
//                                 )}
//                             />
//                         )}
//                     </section>

//                     {/* Order Summary */}
//                     <section className="rounded-2xl border border-slate-200 bg-white p-4">
//                         <div className="mb-3 flex items-center justify-between">
//                             <h3 className="text-sm font-semibold text-slate-900">
//                                 Order Summary
//                             </h3>

//                             <span className="text-sm font-bold text-sky-700">
//                                 ₹{calculateTotal().toFixed(2)}
//                             </span>
//                         </div>

//                         <div className="space-y-2">
//                             {items.map((item) => (
//                                 <div
//                                     key={item.product_id}
//                                     className="flex items-start justify-between gap-3 text-xs"
//                                 >
//                                     <div>
//                                         <p className="font-medium text-slate-800">
//                                             {item.product_name}
//                                         </p>

//                                         <p className="text-slate-500">
//                                             {item.quantity} boxes × ₹
//                                             {item.rate.toFixed(2)}
//                                         </p>
//                                     </div>

//                                     <span className="font-semibold text-slate-900">
//                                         ₹
//                                         {calculateItemTotal(
//                                             item
//                                         ).toFixed(2)}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>

//                     {/* Payment */}
//                     <section className="rounded-2xl border border-slate-200 bg-white p-4">
//                         <div className="mb-4">
//                             <h3 className="text-sm font-semibold text-slate-900">
//                                 Payment
//                             </h3>

//                             <p className="mt-0.5 text-xs text-slate-500">
//                                 Record payment for this sale
//                             </p>
//                         </div>

//                         <div className="space-y-3">
//                             <div>
//                                 <label className="mb-1.5 block text-xs font-semibold text-slate-700">
//                                     Payment Status
//                                 </label>

//                                 <select
//                                     value={paymentStatus}
//                                     onChange={(e) => {
//                                         const status =
//                                             e.target.value

//                                         setPaymentStatus(status)

//                                         if (
//                                             status ===
//                                             'Paid'
//                                         ) {
//                                             setAmountPaid(
//                                                 String(
//                                                     calculateTotal()
//                                                 )
//                                             )
//                                         }

//                                         if (
//                                             status ===
//                                             'Pending'
//                                         ) {
//                                             setAmountPaid('0')
//                                         }

//                                         setErrors(
//                                             (prev) => ({
//                                                 ...prev,
//                                                 payment: '',
//                                             })
//                                         )
//                                     }}
//                                     className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
//                                 >
//                                     <option value="Pending">
//                                         Pending
//                                     </option>

//                                     <option value="Partial">
//                                         Partial
//                                     </option>

//                                     <option value="Paid">
//                                         Paid
//                                     </option>
//                                 </select>
//                             </div>

//                             <div>
//                                 <label className="mb-1.5 block text-xs font-semibold text-slate-700">
//                                     Amount Paid
//                                 </label>

//                                 <input
//                                     type="number"
//                                     min="0"
//                                     step="0.01"
//                                     value={amountPaid}
//                                     disabled={
//                                         paymentStatus ===
//                                         'Pending'
//                                     }
//                                     onChange={(e) =>
//                                         setAmountPaid(
//                                             e.target.value
//                                         )
//                                     }
//                                     className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
//                                 />
//                             </div>

//                             {errors.payment && (
//                                 <p className="rounded-xl bg-rose-50 px-3 py-2.5 text-xs text-rose-600">
//                                     {errors.payment}
//                                 </p>
//                             )}

//                             <div className="rounded-xl bg-slate-50 p-4">
//                                 <div className="flex justify-between text-sm">
//                                     <span className="text-slate-500">
//                                         Total
//                                     </span>

//                                     <span className="font-semibold text-slate-900">
//                                         ₹
//                                         {calculateTotal().toFixed(
//                                             2
//                                         )}
//                                     </span>
//                                 </div>

//                                 <div className="mt-2 flex justify-between text-sm">
//                                     <span className="text-slate-500">
//                                         Paid
//                                     </span>

//                                     <span className="font-semibold text-slate-900">
//                                         ₹
//                                         {Number(
//                                             amountPaid || 0
//                                         ).toFixed(2)}
//                                     </span>
//                                 </div>

//                                 <div className="mt-3 flex justify-between border-t border-slate-200 pt-3">
//                                     <span className="font-semibold text-slate-900">
//                                         Balance
//                                     </span>

//                                     <span className="font-bold text-amber-700">
//                                         ₹
//                                         {calculateBalance().toFixed(
//                                             2
//                                         )}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                     </section>

//                     {/* Actions */}
//                     <div className="sticky bottom-0 -mx-1 bg-white pt-2">
//                         <div className="grid grid-cols-[auto_1fr] gap-2">
//                             <button
//                                 type="button"
//                                 onClick={goBackToProducts}
//                                 disabled={isLoading}
//                                 className="rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
//                             >
//                                 ← Back
//                             </button>

//                             <button
//                                 type="submit"
//                                 disabled={
//                                     isLoading ||
//                                     !customerId
//                                 }
//                                 className="rounded-xl bg-sky-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
//                             >
//                                 {isLoading
//                                     ? 'Creating Sale...'
//                                     : `Create Sale • ₹${calculateTotal().toFixed(
//                                           2
//                                       )}`}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </form>
//     )
// })

// function ProductInfo({ product }) {
//     if (!product) {
//         return null
//     }

//     return (
//         <div className="rounded-xl border border-sky-100 bg-sky-50 px-3 py-3">
//             <div className="grid grid-cols-3 gap-2 text-xs">
//                 <div>
//                     <p className="text-slate-500">
//                         Stock
//                     </p>

//                     <p className="mt-0.5 font-semibold text-slate-800">
//                         {product.stock} boxes
//                     </p>
//                 </div>

//                 <div>
//                     <p className="text-slate-500">
//                         Per box
//                     </p>

//                     <p className="mt-0.5 font-semibold text-slate-800">
//                         {product.quantity_per_box}
//                     </p>
//                 </div>

//                 <div>
//                     <p className="text-slate-500">
//                         MRP
//                     </p>

//                     <p className="mt-0.5 font-semibold text-slate-800">
//                         ₹
//                         {Number(
//                             product.mrp || 0
//                         ).toFixed(2)}
//                     </p>
//                 </div>
//             </div>
//         </div>
//     )
// }

// function SaleItemCard({
//     item,
//     onRemove,
//     onUpdate,
//     calculateUnits,
//     calculateItemTotal,
// }) {
//     return (
//         <div className="rounded-2xl border border-slate-200 bg-white p-3.5">
//             <div className="flex items-start justify-between gap-3">
//                 <div className="min-w-0">
//                     <p className="truncate text-sm font-semibold text-slate-900">
//                         {item.product_name}
//                     </p>

//                     <p className="mt-0.5 text-xs text-slate-500">
//                         {calculateUnits(item)} units
//                     </p>
//                 </div>

//                 <button
//                     type="button"
//                     onClick={() =>
//                         onRemove(item.product_id)
//                     }
//                     className="shrink-0 rounded-lg p-1.5 text-lg leading-none text-slate-400 hover:bg-rose-50 hover:text-rose-600"
//                     aria-label={`Remove ${item.product_name}`}
//                 >
//                     ×
//                 </button>
//             </div>

//             <div className="mt-3 grid grid-cols-2 gap-2">
//                 <div>
//                     <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
//                         Boxes
//                     </p>

//                     <input
//                         type="number"
//                         min="1"
//                         value={item.quantity}
//                         onChange={(e) =>
//                             onUpdate(
//                                 item.product_id,
//                                 'quantity',
//                                 e.target.value
//                             )
//                         }
//                         className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-sky-500"
//                     />
//                 </div>

//                 <div>
//                     <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
//                         Rate
//                     </p>

//                     <input
//                         type="number"
//                         min="0"
//                         step="0.01"
//                         value={item.rate}
//                         onChange={(e) =>
//                             onUpdate(
//                                 item.product_id,
//                                 'rate',
//                                 e.target.value
//                             )
//                         }
//                         className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-sky-500"
//                     />
//                 </div>
//             </div>

//             <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
//                 <span className="text-xs text-slate-500">
//                     {item.quantity} × ₹
//                     {item.rate.toFixed(2)}
//                 </span>

//                 <span className="text-sm font-bold text-sky-700">
//                     ₹
//                     {calculateItemTotal(
//                         item
//                     ).toFixed(2)}
//                 </span>
//             </div>
//         </div>
//     )
// }

// function CustomerCard({ customer }) {
//     if (!customer) {
//         return null
//     }

//     return (
//         <div className="mt-3 rounded-xl border border-sky-100 bg-sky-50 p-3">
//             <p className="text-sm font-semibold text-slate-900">
//                 {customer.name}
//             </p>

//             {customer.contact && (
//                 <p className="mt-1 text-xs text-slate-600">
//                     {customer.contact}
//                 </p>
//             )}

//             {customer.address && (
//                 <p className="mt-1 text-xs text-slate-500">
//                     {customer.address}
//                 </p>
//             )}
//         </div>
//     )
// }