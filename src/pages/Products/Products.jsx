// src/pages/Products/Products.jsx
import { useEffect, useRef, useMemo, useState } from "react";
import BookCard from "./BookCard/BookCard.jsx";
import BookFilters from "./BookFilters/BookFilters.jsx";
import useStickyFixed from "../../Features/products/hooks.js";
import { useAuth } from "../../context/useAuth";
import AddProductModal from "./AddProducts/AddProducts";
import { useProducts } from "../../context/ProductContext.jsx";

import { Helmet } from "react-helmet";
import { toast } from "react-hot-toast";

export default function Products() {
	const { user } = useAuth();
	const { books } = useProducts(); // 👈 AHORA TODO SALE DE ACÁ
	const [showAddModal, setShowAddModal] = useState(false);

	// Filtros
	const [filters, setFilters] = useState({
		q: "",
		yearFrom: "",
		yearTo: "",
		withCover: false,
		priceMin: 0,
		priceMax: 0,
	});

	const priceToNumber = (s) => {
		if (typeof s !== "string") return 0;
		const n = Number(s.replace(/[^\d]/g, ""));
		return Number.isFinite(n) ? n : 0;
	};

	// ⭐ Calcular límites reales de precios
	const priceBounds = useMemo(() => {
		const vals = books.map((b) => priceToNumber(b.price)).filter(Boolean);
		const min = vals.length ? Math.min(...vals) : 0;
		const max = vals.length ? Math.max(...vals) : 0;
		return { min, max };
	}, [books]);

	// ⭐ Resetear filtros cuando cambia catálogo o bounds
	useEffect(() => {
		setFilters((f) => ({
			...f,
			priceMin: priceBounds.min,
			priceMax: priceBounds.max,
		}));
	}, [priceBounds.min, priceBounds.max, books.length]);

	// ⭐ FILTRAR LIBROS
	const filteredItems = useMemo(() => {
		const { q, yearFrom, yearTo, withCover, priceMin, priceMax } = filters;

		return books.filter((b) => {
			// portada
			if (withCover && !b.image) return false;

			// año
			if (yearFrom && b.firstYear && Number(b.firstYear) < Number(yearFrom)) return false;
			if (yearTo && b.firstYear && Number(b.firstYear) > Number(yearTo)) return false;

			// precio
			const p = priceToNumber(b.price);
			if (p < priceMin || p > priceMax) return false;

			// búsqueda
			if (q.trim()) {
				const hay = (b.title + " " + (b.authors || "")).toLowerCase();
				if (!hay.includes(q.trim().toLowerCase())) return false;
			}

			return true;
		});
	}, [books, filters]);

	// sticky
	const stickyRef = useRef(null);
	const { fixed, left, width, top, height } = useStickyFixed(stickyRef, 96);

	useEffect(() => {
		const msg = localStorage.getItem("toastMessage");

		if (!msg) return;

		if (msg === "deleted") {
			toast.error("Producto eliminado correctamente");
		}

		if (msg === "added") {
			toast.success("Producto agregado correctamente");
		}

		if (msg === "edited") {
			toast.success("Producto editado correctamente");
		}

		localStorage.removeItem("toastMessage");
	}, [books.length]); // <--- ESTA ES LA CLAVE

	return (
		<>
			{/* ⭐ SEO CON REACT HELMET */}
			<Helmet>
				<title>Catálogo | Mythica Books</title>
				<meta
					name="description"
					content="Explora el catálogo completo de libros de fantasia disponibles. Filtra por precio, año, autores y más."
				/>
				<meta
					name="keywords"
					content="libros, catálogo, biblioteca, productos, precios, comprar libros, fantasía, autores, dragon, magia, aventuras, novelas, literatura, bestsellers"
				/>
				<meta charSet="utf-8" />
			</Helmet>
			<section className="w-full px-12 pt-12 pb-10">
				<header className="mb-4">
					<h2 className="[font-family:var(--font-display)] text-3xl text-[color:var(--green-700)]">Catálogo</h2>
					<p className="mt-1 text-[color:var(--green-700)]/70">
						Mostrando {filteredItems.length} de {books.length}
					</p>
				</header>

				<div className="relative">
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

							{user?.admin && (
								<button
									onClick={() => setShowAddModal(true)}
									className="mt-4 px-4 py-2.5 rounded-xl bg-[color:var(--green-600)] text-white shadow hover:bg-[color:var(--green-500)] cursor-pointer">
									Agregar producto
								</button>
							)}
						</div>

						{fixed && <div style={{ height }} />}

						<main>
							<ul className="grid grid-cols-3 gap-6">
								{filteredItems.map((b) => (
									<li
										key={b.id}
										className="group">
										<BookCard book={b} />
									</li>
								))}
							</ul>

							{filteredItems.length === 0 && <div className="mt-8 text-[color:var(--green-700)]/70">No hay resultados con esos filtros.</div>}
						</main>
					</div>
				</div>

				{showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} />}
			</section>
		</>
	);
}
