import { useEffect, useRef, useMemo, useState } from "react";
import { getFixedFantasy48 } from "../../Features/products/api.js";
import BookCard from "./BookCard/BookCard.jsx";
import BookFilters from "./BookFilters/BookFilters.jsx";
import useStickyFixed from "../../Features/products/hooks.js";

export default function Products() {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const [filters, setFilters] = useState({
		q: "",
		yearFrom: "",
		yearTo: "",
		priceMin: 0,
		priceMax: 0,
	});

	// helper para obtener valor numérico de un precio formateado
	const priceToNumber = (s) => {
		if (typeof s !== "string") return 0;
		// deja solo dígitos (asumimos ARS sin decimales relevantes)
		const n = Number(s.replace(/[^\d]/g, ""));
		return Number.isFinite(n) ? n : 0;
	};

	// Carga fija de 48 libros
	useEffect(() => {
		let alive = true;
		(async () => {
			try {
				setLoading(true);
				const fixed = await getFixedFantasy48();
				if (!alive) return;
				setItems(fixed);

				// calcular min/max reales
				const values = fixed.map((b) => priceToNumber(b.price)).filter(Boolean);
				const min = values.length ? Math.min(...values) : 0;
				const max = values.length ? Math.max(...values) : 0;

				// inicializar sliders al rango completo
				setFilters((f) => ({
					...f,
					priceMin: min,
					priceMax: max,
				}));
			} catch (e) {
				if (alive) setError(e.message || "Error cargando catálogo");
			} finally {
				if (alive) setLoading(false);
			}
		})();
		return () => {
			alive = false;
		};
	}, []);

	// Aplicar filtros
	const filteredItems = useMemo(() => {
		const { q, yearFrom, yearTo, withCover, priceMin, priceMax } = filters;

		return items.filter((b) => {
			if (withCover && !b.image) return false;
			if (yearFrom && b.firstYear && Number(b.firstYear) < Number(yearFrom)) return false;
			if (yearTo && b.firstYear && Number(b.firstYear) > Number(yearTo)) return false;

			// precio
			const p = priceToNumber(b.price);
			if (priceMin && p < priceMin) return false;
			if (priceMax && p > priceMax) return false;

			// texto
			if (q.trim()) {
				const hay = (b.title + " " + (b.authors || "")).toLowerCase();
				if (!hay.includes(q.trim().toLowerCase())) return false;
			}
			return true;
		});
	}, [items, filters]);

	const priceBounds = useMemo(() => {
		const vals = items.map((b) => priceToNumber(b.price)).filter(Boolean);
		const min = vals.length ? Math.min(...vals) : 0;
		const max = vals.length ? Math.max(...vals) : 0;
		return { min, max };
	}, [items]);

	// sticky
	const stickyRef = useRef(null);
	const { fixed, left, width, top, height } = useStickyFixed(stickyRef, 96); // 96px ≈ top-24

	return (
		<section className="w-full px-12 pt-12 pb-10">
			<header className="mb-4">
				<h2 className="[font-family:var(--font-display)] text-3xl text-[color:var(--green-700)]">Catálogo</h2>
				{loading && <p className="mt-1 text-[color:var(--green-700)]/70">Cargando…</p>}
				{error && <p className="mt-1 text-red-700">Error: {error}</p>}
				{!loading && !error && (
					<p className="mt-1 text-[color:var(--green-700)]/70">
						Mostrando {filteredItems.length} de {items.length}
					</p>
				)}
			</header>

			<div className="relative">
				{/* Sidebar de filtros */}
				<div className="grid grid-cols-[260px_minmax(0,1fr)] gap-8 items-start">
					<div
						ref={stickyRef}
						style={fixed ? { position: "fixed", top: `${top}px`, left, width } : {}}>
						<BookFilters
							value={filters}
							onChange={setFilters}
							onClear={() =>
								setFilters({
									q: "",
									yearFrom: "",
									yearTo: "",
									withCover: false,
									priceMin: priceBounds.min,
									priceMax: priceBounds.max,
								})
							}
							minPriceBound={priceBounds.min}
							maxPriceBound={priceBounds.max}
						/>
					</div>

					{/* Placeholder para evitar salto cuando el filtro pasa a fixed */}
					{fixed && <div style={{ height }} />}

					{/* Grilla */}
					<main className="flex-1">
						<ul className="grid grid-cols-3 gap-6">
							{filteredItems.map((b) => (
								<li
									key={b.id}
									className="group">
									<BookCard book={b} />
								</li>
							))}
						</ul>

						{/* Estado vacío */}
						{!loading && !error && filteredItems.length === 0 && (
							<div className="mt-8 text-[color:var(--green-700)]/70">No hay resultados con esos filtros.</div>
						)}
					</main>
				</div>
			</div>
		</section>
	);
}
