// src/pages/ProductsDetail/ProductsDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { cartStore } from "../../components/Cart/cartStore";
import { useProducts } from "../../context/ProductContext";
import { useAuth } from "../../context/useAuth";
import { getWork, pickDescription } from "../../Features/products/api";
import EditProductModal from "./EditProduct/EditProductModal";
import { Toaster } from "react-hot-toast";

export default function ProductsDetail() {
	// Auth
	const { user } = useAuth();
	const isAdmin = user?.admin === true;

	// Context de productos
	const { books, deleteBook, updateBook } = useProducts();

	// Router
	const { workId } = useParams();
	const location = useLocation();
	const navigate = useNavigate();

	const stateBook = location.state || null;

	// 📚 Libro “real” del catálogo
	const book = useMemo(() => {
		// Primero intento encontrarlo en el contexto
		const fromContext = books.find((b) => String(b.id) === String(workId));
		// Si todavía no está (ej: recarga directa muy rápida), uso el state como fallback
		return fromContext || stateBook || null;
	}, [books, workId, stateBook]);

	const [showDelete, setShowDelete] = useState(false);
	const [expanded, setExpanded] = useState(false);
	const [loadingExtra, setLoadingExtra] = useState(false);

	// Desestructuro con fallback por si aún no hay book en el primer render
	const { id, title, authors, price, firstYear, image, descripcion, subjects, workKey } = book || {};

	// 🔥 Opción 2: solo descargo sinopsis/tags si faltan
	useEffect(() => {
		// Si todavía no hay libro, no hago nada
		if (!book) return;

		// Si no es un libro de OpenLibrary, no hay workKey → no hay nada que pedir
		if (!workKey) return;

		// Si ya tengo descripción y temas, no vuelvo a pegarle a la API
		if (descripcion && Array.isArray(subjects) && subjects.length > 0) return;

		let alive = true;

		(async () => {
			try {
				setLoadingExtra(true);

				const work = await getWork(workKey);
				if (!alive) return;

				const desc = pickDescription(work.description) || "Sin sinopsis disponible.";
				const subs = Array.isArray(work.subjects) ? work.subjects.slice(0, 10) : [];

				// 🧠 Actualizo en el catálogo local
				updateBook(id, { descripcion: desc, subjects: subs });
			} catch (err) {
				console.warn("No se pudo cargar metadata extra:", err);
			} finally {
				if (alive) setLoadingExtra(false);
			}
		})();

		return () => {
			alive = false;
		};
	}, [book, workKey, descripcion, subjects, id, updateBook]);

	// 🛑 Si el libro no existe en ningún lado
	if (!book) {
		return (
			<section className="p-10">
				<p className="text-red-600 mb-4">El libro no existe en tu catálogo.</p>
				<Link
					to="/products"
					className="text-blue-600 underline">
					Volver al catálogo
				</Link>
			</section>
		);
	}

	function handleDelete() {
		deleteBook(id);

		localStorage.setItem("toastMessage", "deleted");

		navigate("/products", { replace: true });
	}

	const [showEdit, setShowEdit] = useState(false);

	return (
		<section className="w-full px-12 pt-10 pb-14">
			<Toaster
				position="bottom-center"
				toastOptions={{
					style: {
						background: "rgba(255,255,255,0.85)",
						backdropFilter: "blur(10px)",
						borderRadius: "10px",
						padding: "12px 18px",
						color: "#0a3d2f",
						fontWeight: "500",
					},
					iconTheme: {
						primary: "#16a34a",
						secondary: "#ffffff",
					},
				}}
			/>

			{/* Breadcrumb */}
			<nav className="text-sm mb-3 text-gray-600">
				<Link
					to="/products"
					className="hover:underline">
					Catálogo
				</Link>
				<span className="mx-2">/</span>
				<span className="truncate inline-block max-w-[60ch]">{title}</span>
			</nav>

			<div className="grid grid-cols-[320px_minmax(0,1fr)] gap-8">
				{/* Columna izquierda */}
				<aside>
					<div className="rounded-2xl overflow-hidden border bg-white shadow">
						{image ? (
							<img
								src={image}
								alt={title}
								className="w-full h-full object-cover aspect-[3/4]"
							/>
						) : (
							<div className="aspect-[3/4] grid place-items-center text-gray-500">Sin portada</div>
						)}
					</div>

					{/* Tarjeta de compra */}
					<div className="mt-4 p-4 border rounded-xl bg-white shadow">
						<div className="flex justify-between items-center">
							<span className="text-2xl font-bold">{price}</span>
							<span className="material-icons text-yellow-500">local_offer</span>
						</div>

						<button
							onClick={() => cartStore.add(book)}
							className="mt-3 w-full h-11 rounded-lg bg-green-600 text-white hover:bg-green-500">
							Añadir al carrito
						</button>
					</div>
				</aside>

				{/* Columna derecha */}
				<main>
					{/* Acciones */}
					<div className="flex items-center justify-between mb-4">
						<Link
							to="/products"
							className="flex items-center gap-1 px-4 py-2 bg-white border rounded-lg hover:bg-green-500 hover:text-white">
							<span className="material-icons">arrow_back</span>
							Volver
						</Link>

						{isAdmin && (
							<div className="flex gap-3">
								<button
									onClick={() => setShowEdit(true)}
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 cursor-pointer">
									Editar
								</button>

								<button
									onClick={() => setShowDelete(true)}
									className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 cursor-pointer">
									Eliminar
								</button>
							</div>
						)}
					</div>

					{/* Modal eliminar */}
					{showDelete && (
						<div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
							<div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
								<h2 className="text-lg font-semibold mb-3">¿Eliminar producto?</h2>
								<p className="text-gray-600 mb-6">Esta acción no se puede deshacer.</p>

								<div className="flex justify-end gap-3">
									<button
										onClick={() => setShowDelete(false)}
										className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer">
										Cancelar
									</button>
									<button
										onClick={handleDelete}
										className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-500 cursor-pointer">
										Eliminar
									</button>
								</div>
							</div>
						</div>
					)}
					{showEdit && (
						<EditProductModal
							book={book}
							onClose={() => setShowEdit(false)}
						/>
					)}

					{/* Detalles */}
					<header className="pb-4 border-b">
						<h1 className="text-3xl text-green-700">{title}</h1>

						<div className="mt-1 flex gap-4 text-gray-600">
							<span className="flex items-center gap-1">
								<span className="material-icons text-[18px]">person</span>
								{authors || "Autor desconocido"}
							</span>

							<span className="flex items-center gap-1">
								<span className="material-icons text-[18px]">calendar_month</span>
								{firstYear || "—"}
							</span>
						</div>
					</header>

					{/* Sinopsis y temas */}
					<section className="mt-5 grid gap-4">
						{/* Sinopsis */}
						<div className="p-4 bg-white border rounded-xl shadow">
							<h2 className="font-semibold text-green-700 mb-2 flex items-center gap-1">
								<span className="material-icons">menu_book</span>
								Sinopsis
							</h2>

							{loadingExtra && !descripcion ? (
								<p className="text-gray-500">Cargando sinopsis…</p>
							) : (
								<>
									<p className={`${expanded ? "" : "line-clamp-5"} text-gray-700`}>{descripcion || "Sin sinopsis disponible."}</p>
									<button
										onClick={() => setExpanded((v) => !v)}
										className="mt-2 text-sm text-green-600 underline">
										{expanded ? "Mostrar menos" : "Mostrar más"}
									</button>
								</>
							)}
						</div>

						{/* Temas */}
						{Array.isArray(subjects) && subjects.length > 0 && (
							<div className="p-4 bg-white border rounded-xl shadow">
								<h3 className="font-semibold text-green-700 mb-2 flex items-center gap-1">
									<span className="material-icons">category</span>
									Temas
								</h3>

								<div className="flex flex-wrap gap-2">
									{subjects.map((s) => (
										<span
											key={s}
											className="px-2 py-1 text-xs border rounded-full text-gray-700">
											{s}
										</span>
									))}
								</div>
							</div>
						)}
					</section>
				</main>
			</div>
		</section>
	);
}
