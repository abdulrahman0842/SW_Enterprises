const summaryCards = [
    { label: 'Revenue', value: '$128.4K', tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Orders', value: '842', tone: 'bg-sky-50 text-sky-700' },
    { label: 'Inventory', value: '3,640', tone: 'bg-violet-50 text-violet-700' },
    { label: 'Alerts', value: '12', tone: 'bg-amber-50 text-amber-700' },
]

export function HomePage() {
    return (
        <div className="space-y-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
                    ERP foundation
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                    Business operations, structured for growth.
                </h2>
                <p className="mt-3 max-w-2xl text-base text-slate-600">
                    This starter setup prepares the project shell for inventory, finance, sales,
                    and operations modules without adding business logic yet.
                </p>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => (
                    <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${card.tone}`}>
                            {card.label}
                        </div>
                        <p className="mt-4 text-3xl font-bold text-slate-900">{card.value}</p>
                    </article>
                ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900">System readiness</h3>
                    <ul className="mt-4 space-y-3 text-sm text-slate-600">
                        <li>• Vite configured for modern React development</li>
                        <li>• Tailwind CSS enabled for a clean business UI</li>
                        <li>• Supabase environment variables ready for integration</li>
                        <li>• Project structure prepared for future modules</li>
                    </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900">Next setup</h3>
                    <p className="mt-3 text-sm text-slate-600">
                        Add domain modules, routing, and data services after this foundation is in place.
                    </p>
                </div>
            </section>
        </div>
    )
}
