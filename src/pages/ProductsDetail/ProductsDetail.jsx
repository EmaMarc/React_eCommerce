// src/pages/ProductsDetail/ProductsDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { getWork, getAuthorName, pickDescription, coverById } from "../../Features/products/api.js";

// Precio fake por si entramos directo sin state
function fakePrice(seed) {
	let h = 0;
	for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
	const base = Math.abs(h % 13500) + 5000;
	return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(base);
}

export default function ProductsDetail() {
	const { workId } = useParams();
	const location = useLocation();
	const stateBook = location.state || null;

	const workKey = useMemo(() => {
		if (!workId) return "";
		return workId.startsWith("/works/") ? workId : `/works/${workId}`;
	}, [workId]);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState(null);
	const [authors, setAuthors] = useState([]);
	const [cover, setCover] = useState(stateBook?.image || null);
	const [expanded, setExpanded] = useState(false);

	useEffect(() => {
		let alive = true;
		(async () => {
			try {
				setLoading(true);
				setError(null);

				const work = await getWork(workKey);
				if (!alive) return;
				setData(work);

				if (!stateBook?.image) {
					const firstCover = Array.isArray(work.covers) && work.covers.length ? coverById(work.covers[0], "L") : null;
					setCover(firstCover);
				}

				const authorKeys = (work.authors || []).map((a) => a?.author?.key).filter(Boolean);

				const names = [];
				for (const k of authorKeys) {
					const n = await getAuthorName(k);
					if (n) names.push(n);
				}
				if (alive) setAuthors(names);
			} catch (e) {
				if (alive) setError(e.message || "Error cargando detalle");
			} finally {
				if (alive) setLoading(false);
			}
		})();
		return () => {
			alive = false;
		};
	}, [stateBook?.image, workKey]);

	const description = useMemo(() => pickDescription(data?.description) || "Sin sinopsis disponible.", [data]);

	const title = stateBook?.title || data?.title || "Título desconocido";
	const price = stateBook?.price || fakePrice(workKey);
	const year = stateBook?.firstYear || data?.first_publish_date || data?.created?.value?.slice(0, 4) || "—";
	const subjects = Array.isArray(data?.subjects) ? data.subjects.slice(0, 10) : [];
	const authorStr = authors.length ? authors.join(", ") : stateBook?.authors || "Autor desconocido";

	return (
		<section className="w-full px-12 pt-10 pb-14">
			{/* Breadcrumb minimal */}
			<nav className="text-sm mb-3 text-[color:var(--green-700)]/70">
				<Link
					to="/products"
					className="hover:underline">
					Catálogo
				</Link>
				<span className="mx-2">/</span>
				<span className="truncate inline-block max-w-[60ch] align-bottom">{title}</span>
			</nav>

			{loading && <p className="mt-2 text-[color:var(--green-700)]/70">Cargando…</p>}
			{error && <p className="mt-2 text-red-700">Error: {error}</p>}

			{!loading && !error && (
				<div className="grid grid-cols-[320px_minmax(0,1fr)] gap-8 items-start">
					{/* Lateral compacto */}
					<aside className="group">
						<div
							className="relative rounded-2xl overflow-hidden border [border-color:var(--surface-border)] shadow-[var(--shadow-soft)]
                         bg-white/80">
							{/* Brillo sutil al hover */}
							<div
								className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500
                              bg-[radial-gradient(40%_60%_at_50%_10%,rgba(255,255,255,.20),transparent_60%)]"
							/>
							{cover ? (
								<img
									src={cover}
									alt={title}
									className="w-full h-full object-cover aspect-[3/4] transition-transform duration-500 group-hover:scale-[1.02]"
								/>
							) : (
								<div className="aspect-[3/4] grid place-items-center text-[color:var(--green-700)]/60">Sin portada</div>
							)}
						</div>

						{/* Tarjeta de compra compacta */}
						<div className="mt-4 p-4 rounded-xl bg-[rgba(255,255,255,.9)] border [border-color:var(--surface-border)] shadow-[var(--shadow-soft)]">
							<div className="flex items-center justify-between">
								<span className="text-2xl font-semibold text-[color:var(--green-700)]">{price}</span>
								<span className="material-icons text-[color:var(--gold-600)]">local_offer</span>
							</div>
							<button
								className="mt-3 w-full h-11 rounded-lg text-white bg-[color:var(--green-600)] hover:bg-[color:var(--green-500)]
                           shadow-[var(--shadow-soft)] transition-colors flex items-center justify-center gap-2">
								<span className="material-icons text-[20px]">shopping_cart</span>
								Añadir al carrito
							</button>
						</div>
					</aside>

					{/* Contenido principal */}
					<main>
						{/* Footer de acciones rápidas (opcional) */}
						<div className="flex flex-wrap items-center justify-between gap-3 mb-4">
							<Link
								to="/products"
								className="inline-flex items-center  px-3 py-2 rounded-lg border [border-color:var(--green-300)]
                            bg-white/80 text-[color:var(--green-700)]
                            hover:bg-[color:var(--green-500)] hover:text-[color:var(--white)] hover:shadow-[var(--shadow-soft)] transition-colors">
								<span className="material-icons text-[18px]">arrow_back</span>
								Volver al catálogo
							</Link>
						</div>
						{/* Título + autores compactos */}

						<header className="pb-4 border-b [border-color:var(--surface-border)]">
							<h1 className="[font-family:var(--font-display)] text-[34px] leading-tight text-[color:var(--green-700)]">{title}</h1>
							<div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[color:var(--green-700)]/75">
								<span className="inline-flex items-center gap-1">
									<span className="material-icons text-[18px] align-middle">person</span>
									{authorStr}
								</span>
								<span className="inline-flex items-center gap-1">
									<span className="material-icons text-[18px] align-middle">calendar_month</span>
									{year}
								</span>
							</div>
						</header>

						{/* Bloque de sinopsis + temas */}
						<section className="mt-5 grid gap-4">
							{/* Sinopsis con “mostrar más” */}
							<div
								className="p-4 rounded-xl bg-[rgba(255,255,255,.86)] border [border-color:var(--surface-border)] shadow-[var(--shadow-soft)]
                              transition-transform duration-300 hover:-translate-y-[1px]">
								<h2 className="font-semibold text-[color:var(--green-700)] mb-2 flex items-center gap-1">
									<span className="material-icons text-[18px]">menu_book</span>
									Sinopsis
								</h2>
								<p className={`text-[color:var(--green-700)]/85 leading-relaxed whitespace-pre-line ${expanded ? "" : "line-clamp-5"}`}>{description}</p>
								<button
									onClick={() => setExpanded((v) => !v)}
									className="mt-2 text-sm text-[color:var(--green-700)] hover:text-[color:var(--green-600)]">
									{expanded ? "Mostrar menos" : "Mostrar más"}
								</button>
							</div>

							{/* Temas como chips */}
							{!!subjects.length && (
								<div
									className="p-4 rounded-xl bg-[rgba(255,255,255,.86)] border [border-color:var(--surface-border)] shadow-[var(--shadow-soft)]
                                transition-transform duration-300 hover:-translate-y-[1px]">
									<h3 className="font-semibold text-[color:var(--green-700)] mb-2 flex items-center gap-1">
										<span className="material-icons text-[18px]">category</span>
										Temas
									</h3>
									<div className="flex flex-wrap gap-2">
										{subjects.map((s) => (
											<span
												key={s}
												title={s}
												className="px-2 py-1 text-xs rounded-full border [border-color:var(--green-300)]
                                   bg-white/80 text-[color:var(--green-700)]/80 hover:bg-white hover:shadow-[var(--shadow-soft)]">
												{s}
											</span>
										))}
									</div>
								</div>
							)}
						</section>
					</main>
				</div>
			)}
		</section>
	);
}
