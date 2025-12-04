import { useState } from "react";
import { useProducts } from "../../../context/ProductContext";
import { toast } from "react-hot-toast";

export default function EditProductModal({ book, onClose }) {
	const { updateBook } = useProducts();

	const [nombre, setNombre] = useState(book.title || "");
	const [precio, setPrecio] = useState(Number(book.price?.replace(/[^\d]/g, "")) || 0);
	const [descripcion, setDescripcion] = useState(book.descripcion || "");
	const [error, setError] = useState("");
	const [closing, setClosing] = useState(false);

	const handleClose = () => {
		setClosing(true);
		setTimeout(() => {
			onClose();
			setClosing(false);
		}, 200);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setError("");

		if (!nombre.trim()) return setError("El nombre es obligatorio.");
		if (precio <= 0) return setError("El precio debe ser mayor a 0.");
		if (descripcion.length < 10) return setError("La descripción debe tener mínimo 10 caracteres.");

		updateBook(book.id, {
			title: nombre,
			price: `$${precio}`,
			descripcion,
		});

    localStorage.setItem("toastMessage", "edited");
    toast.success("Producto editado correctamente");

		handleClose();
	};

	return (
		<div
			className={`fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4 transition-opacity duration-200 ${
				closing ? "opacity-0" : "opacity-100"
			}`}
			onClick={handleClose}>
			<div
				className={`bg-white/90 border rounded-2xl shadow-xl p-8 w-full max-w-lg transition-all duration-200 ${
					closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
				}`}
				onClick={(e) => e.stopPropagation()}>
				<h2 className="text-xl font-semibold text-green-700 mb-4">Editar producto</h2>

				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-4">
					<div>
						<label className="text-sm font-medium text-green-700">Nombre</label>
						<input
							type="text"
							value={nombre}
							onChange={(e) => setNombre(e.target.value)}
							className="w-full px-4 py-2 rounded-full border border-green-300 bg-white/70 outline-none focus:ring-2 focus:ring-green-500"
						/>
					</div>

					<div>
						<label className="text-sm font-medium text-green-700">Precio</label>
						<input
							type="number"
							value={precio}
							onChange={(e) => setPrecio(Number(e.target.value))}
							className="w-full px-4 py-2 rounded-full border border-green-300 bg-white/70 outline-none focus:ring-2 focus:ring-green-500"
						/>
					</div>

					<div>
						<label className="text-sm font-medium text-green-700">Descripción</label>
						<textarea
							value={descripcion}
							onChange={(e) => setDescripcion(e.target.value)}
							className="w-full px-4 py-2 rounded-xl border border-green-300 bg-white/70 outline-none focus:ring-2 focus:ring-green-500 h-28"
						/>
					</div>

					{error && <p className="text-red-600 text-center text-sm">{error}</p>}

					<button
						type="submit"
						className="w-full py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-500 active:scale-95 transition cursor-pointer">
						Guardar cambios
					</button>
				</form>

				<button
					onClick={handleClose}
					className="mt-4 w-full py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition cursor-pointer">
					Cancelar
				</button>
			</div>
		</div>
	);
}
