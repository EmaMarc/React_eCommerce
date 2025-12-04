import { createContext, useContext, useState, useEffect } from "react";
import { getFixedFantasy48 } from "../Features/products/api";

const ProductContext = createContext();
export function useProducts() {
	return useContext(ProductContext);
}

export function ProductProvider({ children }) {
	const [books, setBooks] = useState([]);

	useEffect(() => {
		const stored = localStorage.getItem("booksCatalog");

		if (stored) {
			try {
				const parsed = JSON.parse(stored);

				// 🚨 SOLO aceptar si es array y NO está vacío
				if (Array.isArray(parsed) && parsed.length > 0) {
					setBooks(parsed);
					return;
				}
			} catch {}
		}

		// Si no hay catálogo válido, cargar los 48 libros iniciales
		loadInitialBooks();
	}, []);

	async function loadInitialBooks() {
		const initial48 = await getFixedFantasy48();

		// 🚨 Si la API falla y devuelve vacío, NO guardar un [] vacío
		if (!Array.isArray(initial48) || initial48.length === 0) {
			console.warn("⚠️ getFixedFantasy48 devolvió vacío, se evita romper el catálogo.");
			return;
		}

		setBooks(initial48);
		localStorage.setItem("booksCatalog", JSON.stringify(initial48));
	}

	// Guardado automático
	useEffect(() => {
		if (Array.isArray(books) && books.length > 0) {
			localStorage.setItem("booksCatalog", JSON.stringify(books));
		}
	}, [books]);

	function addBook(book) {
		setBooks((prev) => [...prev, book]);
	}

	function updateBook(id, data) {
		setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
	}

	function deleteBook(id) {
		setBooks((prev) => prev.filter((b) => b.id !== id));
	}

	return <ProductContext.Provider value={{ books, addBook, updateBook, deleteBook }}>{children}</ProductContext.Provider>;
}
