// src/components/Cart/Cart.jsx
import { useEffect, useState, useRef, useLocation } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cartStore } from "./CartStore";

const fmtARS = (n) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n || 0);
const priceToNumber = (s) => Number((s || "").replace(/[^\d]/g, "")) || 0;

export default function Cart({ anchorClass = "" }) {
	const [open, setOpen] = useState(false);
	const [items, setItems] = useState(cartStore.get());
	const navigate = useNavigate();

	useEffect(() => cartStore.subscribe(setItems), []);
	const totalQty = items.reduce((a, b) => a + b.qty, 0);
	const totalARS = items.reduce((a, b) => a + b.qty * priceToNumber(b.price), 0);

	const rootRef = useRef(null);
	//const location = useLocation();

	useEffect(() => {
		if (!open) return;
		const handleDown = (e) => {
			if (rootRef.current && !rootRef.current.contains(e.target)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleDown);
		document.addEventListener("touchstart", handleDown, { passive: true });
		return () => {
			document.removeEventListener("mousedown", handleDown);
			document.removeEventListener("touchstart", handleDown);
		};
	}, [open]);

	return (
		<div
			ref={rootRef}
			className="relative">
			{/* Botón carrito */}
			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				className={`justify-center align-middle hover:border-[color:var(--green-700)] hover:scale-105 hover:cursor-pointer relative h-11 w-11 grid place-items-center rounded-full border [border-color:var(--green-300)] bg-white/60 hover:bg-white transition ${anchorClass}`}
				title="Carrito"
				aria-label="Carrito">
				<span className="material-icons text-[color:var(--green-700)]">shopping_cart</span>
				{totalQty > 0 && (
					<span className="absolute -top-1 -right-1 px-1.5 min-w-[18px] h-[18px] grid place-items-center text-[11px] rounded-full bg-[color:var(--gold-600)] text-white">
						{totalQty}
					</span>
				)}
			</button>

			{/* Dropdown */}
			{open && (
				<div className="absolute right-0 mt-2 w-[360px] max-h-[70vh] overflow-auto rounded-xl border [border-color:var(--surface-border)] bg-[rgba(255,255,255,.96)] shadow-[var(--shadow-soft)] p-2 z-50">
					<div className="px-2 py-1 text-sm text-[color:var(--green-700)]/70">
						Carrito • {totalQty} item{totalQty !== 1 ? "s" : ""}
					</div>

					<ul className="divide-y [divide-color:var(--surface-border)]">
						{items.length === 0 && <li className="px-2 py-4 text-[color:var(--green-700)]/60 text-sm">Tu carrito está vacío.</li>}
						{items.map((it) => (
							<li
								key={it.id}
								className="flex items-center gap-3 px-2 py-2">
								<div className="h-10 w-7 rounded-sm overflow-hidden bg-white/60 ring-1 ring-[color:var(--green-300)] shrink-0">
									{it.image ? (
										<img
											src={it.image}
											alt=""
											className="h-full w-full object-cover"
										/>
									) : null}
								</div>
								<div className="min-w-0 flex-1">
									<p className="text-sm text-[color:var(--green-700)] truncate">{it.title}</p>
									<p className="text-xs text-[color:var(--green-700)]/60">
										x{it.qty} • {it.price}
									</p>
								</div>
								<button
									className=" justify-center align-middle h-8 w-8 grid place-items-center rounded-md border [border-color:var(--green-300)] hover:bg-[color:var(--offwhite)]"
									title="Quitar uno"
									onClick={() => cartStore.removeOne(it.id)}>
									<span className="material-icons text-[18px] text-[color:var(--green-700)] hover:cursor-pointer">remove</span>
								</button>
							</li>
						))}
					</ul>

					{items.length > 0 && (
						<div className="p-2">
							<div className="flex items-center justify-between text-sm text-[color:var(--green-700)]/80 mb-2">
								<span>Total aprox.</span>
								<strong>{fmtARS(totalARS)}</strong>
							</div>
							<button
								className="w-full h-10 rounded-md text-white bg-[color:var(--green-600)] hover:bg-[color:var(--green-500)] hover:cursor-pointer"
								onClick={() => {
									setOpen(false);
									navigate("/checkout");
								}}>
								Ir a confirmar compra
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
