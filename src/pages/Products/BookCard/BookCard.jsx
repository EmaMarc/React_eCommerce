import { Link } from "react-router-dom";
import { cartStore } from "../../../components/Cart/cartStore.js";

export default function BookCard({ book }) {
	const { title, authors, image, firstYear, price, workKey, id } = book;
	const workParam = workKey?.replace("/works/", "") || id; // ruta corta

	return (
		<Link
			to={`/products/${encodeURIComponent(workParam)}`}
			state={book}
			className="block">
			<article className="rounded-xl bg-[rgba(255,255,255,.82)] border [border-color:var(--surface-border)] shadow-[var(--shadow-soft)] overflow-hidden h-full">
				{/* Portada (2:3) */}
				<div className="aspect-[2/3] bg-white/70">
					{image ? (
						<img
							src={image}
							alt={title}
							loading="lazy"
							className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
						/>
					) : (
						<div className="h-full w-full grid place-items-center text-xs text-[color:var(--green-700)]/60">Sin portada</div>
					)}
				</div>

				{/* Texto */}
				<div className="p-3">
					<h3 className="font-semibold leading-snug text-[color:var(--green-700)] line-clamp-2">{title}</h3>
					<p className="text-sm text-[color:var(--green-700)]/70 line-clamp-1">{authors}</p>

					{/* Año + Precio */}
					<div className="mt-2 flex items-center justify-between">
						<span className="text-xs text-[color:var(--green-700)]/60">{firstYear ?? "—"}</span>
						<span className="text-sm font-medium text-[color:var(--green-700)]">{price}</span>
					</div>
				</div>
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						cartStore.add(book);
					}}
					className="mt-2 w-full h-9 rounded-md text-white bg-[color:var(--green-600)] hover:bg-[color:var(--green-500)] hover:cursor-pointer">
					Añadir al carrito
				</button>
			</article>
		</Link>
	);
}
