import { useState } from "react";
import { useProducts } from "../../../context/ProductContext.jsx";

export default function AddProductModal({ onClose }) {
	const [nombre, setNombre] = useState("");
	const [precio, setPrecio] = useState("");
	const [descripcion, setDescripcion] = useState("");

	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const [closing, setClosing] = useState(false);

	const { addBook } = useProducts();

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
		setSuccess("");

		if (!nombre.trim()) return setError("El nombre es obligatorio.");
		if (precio <= 0) return setError("El precio debe ser mayor a 0.");
		if (descripcion.length < 10) return setError("La descripción debe tener mínimo 10 caracteres.");

		addBook({
			id: crypto.randomUUID(),
			title: nombre,
			price: `$${precio}`,
			authors: "Administrador",
			image: null,
			firstYear: "2024",
			descripcion,
			workKey: null,
		});

		localStorage.setItem("toastMessage", "added");

		setSuccess("Producto agregado correctamente ✨");
		setTimeout(() => {
			handleClose();
		}, 1500);
	};

	return (
		<div
			className={`
        fixed inset-0 flex items-center justify-center z-50 px-4
        bg-black/40 backdrop-blur-sm
        transition-opacity duration-200
        ${closing ? "opacity-0" : "opacity-100"}
      `}
			onClick={handleClose}>
			<div
				className={`
          bg-white/90 border rounded-2xl shadow-[var(--shadow-soft)]
          p-8 w-full max-w-lg
          transition-all duration-200
          ${closing ? "scale-95 opacity-0" : "scale-100 opacity-100"}
        `}
				onClick={(e) => e.stopPropagation()}>
				<h2 className="text-xl font-semibold text-[color:var(--green-700)] mb-4">Agregar producto</h2>

				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium text-[color:var(--green-700)]">Nombre</label>
						<input
							type="text"
							value={nombre}
							onChange={(e) => setNombre(e.target.value)}
							className="px-4 py-2 rounded-full border [border-color:var(--green-300)] bg-white/70 outline-none focus:ring-2 focus:ring-[color:var(--green-500)]"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium text-[color:var(--green-700)]">Precio</label>
						<input
							type="number"
							value={precio}
							onChange={(e) => setPrecio(Number(e.target.value))}
							className="px-4 py-2 rounded-full border [border-color:var(--green-300)] bg-white/70 outline-none focus:ring-2 focus:ring-[color:var(--green-500)]"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium text-[color:var(--green-700)]">Descripción</label>
						<textarea
							value={descripcion}
							onChange={(e) => setDescripcion(e.target.value)}
							className="px-4 py-2 rounded-xl border [border-color:var(--green-300)] bg-white/70 outline-none focus:ring-2 focus:ring-[color:var(--green-500)] h-28"
						/>
					</div>
					<button
						type="submit"
						className="
              w-full py-2 rounded-full
              bg-[color:var(--green-600)]
              text-white font-medium
              hover:bg-[color:var(--green-500)]
              active:scale-[0.98]
              transition cursor-pointer
            ">
						Guardar producto
					</button>
					{error && <p className="text-red-600 text-center text-sm">{error}</p>}
				</form>

				<button
					onClick={handleClose}
					className="mt-4 w-full py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition">
					Cancelar
				</button>
			</div>
		</div>
	);
}
