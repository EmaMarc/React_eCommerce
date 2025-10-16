import { NavLink, useNavigate, Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/Mist.scss";
import logo from "../../../public/logo.png";
import { getFixedFantasy48 } from "../../Features/products/api.js";
import Cart from "../Cart/Cart.jsx";

// === Estilos de links con subrayado animado (desde el centro) ===
const linkBase =
	"relative group px-4 py-2 rounded-md text-[15px] font-medium transition-colors " +
	"text-[color:var(--green-700)]/85 hover:text-[color:var(--green-700)] " +
	"after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 " +
	"after:h-[3px] after:w-0 after:bg-[color:var(--gold-500)] after:rounded-full " +
	"after:opacity-0 after:transition-[width,opacity] after:duration-300 " +
	"hover:after:w-[calc(100%-1.5rem)] hover:after:opacity-100 " +
	"focus-visible:after:w-[calc(100%-1.5rem)] focus-visible:after:opacity-100";

const linkActive = "text-[color:var(--green-700)] after:w-[calc(100%-1.5rem)] after:opacity-100";

export default function Navbar() {
	const [q, setQ] = useState("");
	const [allBooks, setAllBooks] = useState([]);
	const [open, setOpen] = useState(false);
	const [debounced, setDebounced] = useState("");
	const navigate = useNavigate();

	// Carga los 48 una vez (de localStorage o fetch)
	useEffect(() => {
		let alive = true;
		(async () => {
			try {
				const arr = await getFixedFantasy48();
				if (alive) setAllBooks(arr);
			} catch {
				// noop
			}
		})();
		return () => {
			alive = false;
		};
	}, []);

	// Debounce de la query (150ms)
	useEffect(() => {
		const t = setTimeout(() => setDebounced(q.trim()), 150);
		return () => clearTimeout(t);
	}, [q]);

	// Filtro SOLO por título (case-insensitive)
	const results = useMemo(() => {
		const needle = debounced.toLowerCase();
		if (!needle) return [];
		return allBooks.filter((b) => (b.title || "").toLowerCase().includes(needle)).slice(0, 8);
	}, [allBooks, debounced]);

	// Abrir/cerrar dropdown
	useEffect(() => {
		setOpen(debounced.length > 0 && results.length > 0);
	}, [debounced, results.length]);

	// Cerrar al hacer click fuera
	const popRef = useRef(null);
	useEffect(() => {
		const onClick = (e) => {
			if (!popRef.current) return;
			if (!popRef.current.contains(e.target)) setOpen(false);
		};
		const onEsc = (e) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("mousedown", onClick);
		document.addEventListener("keydown", onEsc);
		return () => {
			document.removeEventListener("mousedown", onClick);
			document.removeEventListener("keydown", onEsc);
		};
	}, []);

	// No navegamos al catálogo al enviar
	function doSearch(e) {
		e.preventDefault();
		// opcional: si querés que Enter vaya al primero
		if (results[0]) {
			goToDetail(results[0]);
		}
	}

	function goToDetail(book) {
		const workParam = (book.workKey || book.id || "").replace("/works/", "");
		setOpen(false);
		setQ("");
		navigate(`/products/${encodeURIComponent(workParam)}`, { state: book });
	}

	return (
		<header className="w-screen sticky top-0 z-50">
			<div className="w-screen bg-white/85 backdrop-blur border-b [border-color:var(--green-300)] shadow-[var(--shadow-soft)]">
				<div className="w-full px-32 h-20 flex items-center justify-between">
					{/* Izquierda: logo + marca */}
					<Link
						to="/"
						className="mythica-brand">
						<span className="mythica-mist mythica-mist--logo">
							<img
								src={logo}
								alt="Mythica Books"
								className="h-11 w-11 object-contain rounded-md shadow-[var(--shadow-gold)]"
							/>
						</span>
						<span className="mythica-mist mythica-mist--text mythica-brand-text [font-family:var(--font-display)] text-2xl md:text-3xl tracking-wide">
							Mythica Books
						</span>
					</Link>

					{/* Centro: links */}
					<nav className="flex items-center gap-1">
						<NavLink
							to="/"
							end
							className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}>
							Inicio
						</NavLink>
						<NavLink
							to="/products"
							className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}>
							Catálogo
						</NavLink>
					</nav>

					{/* Derecha: buscador + carrito */}
					<div
						className="flex items-center gap-2"
						ref={popRef}>
						<form
							onSubmit={doSearch}
							className="group/search relative">
							{/* Wrapper buscador */}
							<div
								className="
                  flex items-center gap-2 pl-3 pr-2 h-11 rounded-full border
                  [border-color:var(--green-300)] bg-white/70
                  shadow-inner transition
                  focus-within:ring-2 focus-within:ring-[color:var(--green-500)]
                  hover:shadow-[var(--shadow-soft)]
                ">
								<span
									className="
                    material-icons text-[color:var(--green-600)] text-[20px]
                    transition-transform duration-200
                    group-focus-within/search:translate-x-[2px]
                  "
									aria-hidden>
									search
								</span>

								<input
									value={q}
									onChange={(e) => setQ(e.target.value)}
									onFocus={() => {
										if (results.length) setOpen(true);
									}}
									placeholder="Buscar por título…"
									className="
                    bg-transparent outline-none
                    text-[color:var(--green-700)]
                    placeholder:text-[color:var(--green-700)]/50
                    w-[40px] md:w-[120px]
                    transition-[width] duration-300
                    focus:w-[240px]
                  "
									aria-label="Buscar por título"
								/>

								<button
									type="submit"
									className="
                    ml-1 px-4 py-1.5 rounded-full text-white
                    bg-[color:var(--green-600)] hover:bg-[color:var(--green-500)]
                    shadow-[var(--shadow-soft)] relative overflow-hidden transition-colors
                    after:content-[''] after:absolute after:inset-0 after:rounded-full
                    after:bg-white/0 hover:after:bg-white/10 after:transition
                  "
									title="Buscar">
									Buscar
								</button>
							</div>

							{/* Dropdown de resultados */}
							{open && (
								<div
									className="
                    absolute left-0 mt-2 w-[420px] max-h-[70vh] overflow-auto
                    rounded-xl border [border-color:var(--surface-border)]
                    bg-[rgba(255,255,255,.96)] shadow-[var(--shadow-soft)]
                    backdrop-blur-sm
                  ">
									{results.map((b) => {
										const workParam = (b.workKey || b.id || "").replace("/works/", "");
										return (
											<button
												key={b.id}
												type="button"
												onClick={() => goToDetail(b)}
												className="
                          w-full text-left px-3 py-2 flex items-center gap-3
                          hover:bg-[color:var(--offwhite)]
                          transition-colors
                        ">
												<div className="h-10 w-7 rounded-sm overflow-hidden bg-white/60 ring-1 ring-[color:var(--green-300)] shrink-0">
													{b.image ? (
														<img
															src={b.image}
															alt=""
															className="h-full w-full object-cover"
														/>
													) : (
														<div className="h-full w-full grid place-items-center text-[10px] text-[color:var(--green-700)]/60">—</div>
													)}
												</div>
												<div className="min-w-0">
													<p className="text-sm text-[color:var(--green-700)] truncate">{b.title}</p>
													<p className="text-xs text-[color:var(--green-700)]/60 truncate">{b.authors}</p>
												</div>
											</button>
										);
									})}
									{/* Footer del dropdown (opcional) */}
									<div className="px-3 py-2 text-xs text-[color:var(--green-700)]/60 border-t [border-color:var(--surface-border)]">
										{results.length} resultado{results.length !== 1 ? "s" : ""} • Buscar por título
									</div>
								</div>
							)}
						</form>

						{/* Carrito */}
						<Cart />
					</div>
				</div>
			</div>
		</header>
	);
}
