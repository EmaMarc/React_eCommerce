import { cartStore } from "../../components/Cart/CartStore.js";

const fmtARS = (n) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n || 0);
const priceToNumber = (s) => Number((s || "").replace(/[^\d]/g, "")) || 0;

export default function Checkout() {
	const items = cartStore.get();
	const totalQty = items.reduce((a, b) => a + b.qty, 0);
	const totalARS = items.reduce((a, b) => a + b.qty * priceToNumber(b.price), 0);

	return (
		<section className="w-full px-12 pt-12 pb-14">
			<h1 className="[font-family:var(--font-display)] text-3xl text-[color:var(--green-700)]">Confirmación de compra</h1>

			{items.length === 0 ? (
				<p className="mt-4 text-[color:var(--green-700)]/70">Tu carrito está vacío.</p>
			) : (
				<div className="mt-6 grid grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
					<ul className="rounded-xl border [border-color:var(--surface-border)] bg-[rgba(255,255,255,.9)] shadow-[var(--shadow-soft)] divide-y [divide-color:var(--surface-border)]">
						{items.map((it) => (
							<li
								key={it.id}
								className="p-3 flex items-center gap-4">
								<div className="h-16 w-12 rounded-md overflow-hidden ring-1 ring-[color:var(--green-300)] bg-white/60">
									{it.image ? (
										<img
											src={it.image}
											alt=""
											className="h-full w-full object-cover"
										/>
									) : null}
								</div>
								<div className="min-w-0 flex-1">
									<p className="font-medium text-[color:var(--green-700)] truncate">{it.title}</p>
									<p className="text-sm text-[color:var(--green-700)]/70">
										x{it.qty} • {it.price}
									</p>
								</div>
							</li>
						))}
					</ul>

					<aside className="p-4 rounded-xl border [border-color:var(--surface-border)] bg-[rgba(255,255,255,.9)] shadow-[var(--shadow-soft)]">
						<h2 className="font-semibold text-[color:var(--green-700)] mb-3">Resumen</h2>
						<div className="flex items-center justify-between text-sm text-[color:var(--green-700)]/80">
							<span>Items</span>
							<span>{totalQty}</span>
						</div>
						<div className="mt-2 flex items-center justify-between text-base text-[color:var(--green-700)]">
							<strong>Total</strong>
							<strong>{fmtARS(totalARS)}</strong>
						</div>
						<button className="mt-4 w-full h-12 rounded-lg text-white text-lg font-semibold bg-[color:var(--green-600)] hover:bg-[color:var(--green-500)] hover:cursor-pointer">
							COMPRAR
						</button>
					</aside>
				</div>
			)}
		</section>
	);
}
