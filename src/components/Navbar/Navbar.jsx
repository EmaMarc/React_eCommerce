import { NavLink, useNavigate, Link } from "react-router-dom";
import "../../styles/Mist.scss";
import { useState } from "react";
import logo from "../../assets/logo.png";

const linkBase = "px-4 py-2 rounded-md text-[15px] font-medium transition-colors";
const linkInactive = "text-[color:var(--green-700)]/85 hover:bg-[color:var(--offwhite)] hover:text-[color:var(--green-700)]";
const linkActive =
	"text-[color:var(--green-700)] relative after:content-[''] after:absolute after:left-4 after:right-4 after:-bottom-2 after:h-[3px] after:bg-[color:var(--gold-500)] after:rounded-full";

export default function Navbar() {
	const [q, setQ] = useState("");
	const navigate = useNavigate();

	function doSearch(e) {
		e.preventDefault();
		const query = q.trim();
		navigate(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
	}

	return (
		<header className="w-screen sticky top-0 z-50">
			{/* Barra superior clara */}
			<div className="w-screen bg-white/85 backdrop-blur border-b [border-color:var(--green-300)] shadow-[var(--shadow-soft)]">
				{/* MÁS padding lateral y MÁS alto */}
				<div className="w-full px-32 h-20 flex items-center justify-between">
					{/* Izquierda: LOGO + MARCA (clickeables) */}
					<Link
						to="/"
						className="mythica-brand">
						{/* Logo con niebla */}
						<span className="mythica-mist mythica-mist--logo">
							<img
								src={logo}
								alt="Mythica Books"
								className="h-11 w-11 object-contain rounded-md shadow-[var(--shadow-gold)]"
							/>
						</span>

						{/* Texto con niebla también */}
						<span className="mythica-mist mythica-mist--text mythica-brand-text [font-family:var(--font-display)] text-2xl md:text-3xl tracking-wide">
							Mythica Books
						</span>
					</Link>

					{/* Centro: links */}
					<nav className="flex items-center gap-1">
						<NavLink
							to="/"
							end
							className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
							Inicio
						</NavLink>

						<NavLink
							to="/products"
							className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
							Catálogo
						</NavLink>
					</nav>

					{/* Derecha: buscador + carrito */}
					<div className="flex items-center gap-2">
						<form
							onSubmit={doSearch}
							className="flex items-center">
							<div className="flex items-center gap-2 pl-3 pr-2 h-11 rounded-full border [border-color:var(--green-300)] bg-[color:var(--offwhite)] focus-within:ring-2 focus-within:ring-[color:var(--green-500)]">
								<span className="material-icons text-[color:var(--green-600)] text-[20px]">search</span>
								<input
									value={q}
									onChange={(e) => setQ(e.target.value)}
									placeholder="Buscar libros…"
									className="bg-transparent outline-none text-[color:var(--green-700)] placeholder:text-[color:var(--green-700)]/50 w-[260px]"
								/>
								<button
									type="submit"
									className="ml-1 px-5 py-1.5 rounded-full text-white bg-[color:var(--green-600)] hover:bg-[color:var(--green-500)]"
									title="Buscar">
									Buscar
								</button>
							</div>
						</form>

						<Link
							to="/cart"
							className="h-11 w-11 grid place-items-center rounded-full hover:bg-[color:var(--offwhite)] border [border-color:var(--green-300)]"
							title="Carrito">
							<span className="material-icons text-[color:var(--green-700)]">shopping_cart</span>
						</Link>
					</div>
				</div>
			</div>
		</header>
	);
}
