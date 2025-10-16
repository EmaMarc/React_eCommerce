// api.js — versión simple y estable (48 libros de fantasía)
// Fuente: Open Library (https://openlibrary.org)

const OL = "https://openlibrary.org";
const STORAGE_KEY = "mythica.fixed.fantasy48.v1";

// --- Precio fake (solo para mostrar en la UI) ---
function fakePrice(seed) {
	let h = 0;
	for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
	const base = Math.abs(h % 13500) + 5000; // 5000..19999 ARS
	return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(base);
}

// --- Normalizador de documento de Open Library ---
function toBook(d) {
	const key = d.key || ""; // e.g. "/works/OL12345W"
	const coverId = d.cover_i;
	const isbn = (d.isbn && d.isbn[0]) || null;
	const image = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` : null;

	return {
		id: key || isbn || `${d.title}-${d.first_publish_year || ""}`,
		workKey: key,
		title: d.title,
		authors: d.author_name?.join(", ") || "Autor desconocido",
		firstYear: d.first_publish_year || null,
		isbn13: isbn || null,
		image,
		price: fakePrice(key || d.title),
	};
}

// --- Trae una página de fantasía (pool de candidatos) ---
async function fetchFantasyPage(page = 1, limit = 20) {
	const params = new URLSearchParams({
		subject: "fantasy",
		page: String(page),
		limit: String(limit),
	});
	const res = await fetch(`${OL}/search.json?${params.toString()}`);
	if (!res.ok) throw new Error("No se pudo cargar fantasía");
	const data = await res.json();
	const docs = Array.isArray(data.docs) ? data.docs : [];
	return docs.map(toBook);
}

/**
 * Obtiene siempre los mismos 48 libros de fantasía:
 * 1) Si existe en localStorage, devuelve ese listado (estable).
 * 2) Si no existe, arma un pool pequeño (3 páginas ≈ 60), prioriza con portada,
 *    ordena de forma determinística y guarda los primeros 48 en localStorage.
 */
export async function getFixedFantasy48() {
	// 1) cache local
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			const cached = JSON.parse(raw);
			if (Array.isArray(cached) && cached.length === 48) return cached;
		}
	} catch {
		// si localStorage falla, seguimos sin cache
	}

	// 2) construir pool (simple y rápido)
	const pool = [];
	// 3 páginas * 20 = ~60 candidatos (ajustable)
	for (let p = 1; p <= 3; p++) {
		try {
			const chunk = await fetchFantasyPage(p, 20);
			pool.push(...chunk);
		} catch {
			// si una página falla, seguimos con las otras
		}
	}

	if (pool.length === 0) {
		// fallback vacío (no rompe la app)
		return [];
	}

	// 3) priorizar libros con portada y ordenar de forma estable
	const withCover = pool.filter((b) => !!b.image);
	const withoutCover = pool.filter((b) => !b.image);

	const stableSort = (a, b) => {
		// orden determinístico por título (locale) y año (asc)
		const t = (a.title || "").localeCompare(b.title || "", "es", { sensitivity: "base" });
		if (t !== 0) return t;
		const ay = a.firstYear || 99999;
		const by = b.firstYear || 99999;
		return ay - by;
	};

	withCover.sort(stableSort);
	withoutCover.sort(stableSort);

	// 4) elegir los 48: primero con portada, si faltan completa sin portada
	const fixed = [...withCover, ...withoutCover].slice(0, 48);

	// 5) guardar en localStorage para que sean SIEMPRE los mismos 48
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(fixed));
	} catch {
		// si no se puede guardar, igual devolvemos el array
	}

	return fixed;
}

// Utilidad para forzar regenerar los 48 (si querés refrescar la lista manualmente)
export function resetFixedFantasyCache() {
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch {
		// no importa si falla
	}
}
