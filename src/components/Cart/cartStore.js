// src/Cart/cartStore.js
const KEY = "mythica.cart.min.v1";
const listeners = new Set();

function read() {
	try {
		return JSON.parse(localStorage.getItem(KEY)) || [];
	} catch {
		return [];
	}
}
function write(arr) {
	localStorage.setItem(KEY, JSON.stringify(arr));
	listeners.forEach((fn) => fn(arr));
}

export const cartStore = {
	get() {
		return read();
	},
	add(book) {
		const items = read();
		const i = items.findIndex((x) => x.id === book.id);
		if (i >= 0) items[i].qty += 1;
		else items.push({ id: book.id, title: book.title, image: book.image || null, price: book.price, qty: 1, workKey: book.workKey });
		write(items);
	},
	removeOne(id) {
		const items = read();
		const i = items.findIndex((x) => x.id === id);
		if (i === -1) return;
		items[i].qty -= 1;
		if (items[i].qty <= 0) items.splice(i, 1);
		write(items);
	},
	clear() {
		write([]);
	},
	subscribe(fn) {
		listeners.add(fn);
		return () => listeners.delete(fn);
	},
};
