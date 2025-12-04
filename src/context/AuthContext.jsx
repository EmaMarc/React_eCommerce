import { createContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [users, setUsers] = useState([]);
	const [user, setUser] = useState(null);
	const [isFirstLoad, setIsFirstLoad] = useState(true);

	useEffect(() => {
		const storedUsers = localStorage.getItem("users");
		const storedCurrent = localStorage.getItem("currentUser"); // 👈 AÑADIDO

		if (storedUsers) {
			setUsers(JSON.parse(storedUsers));
		} else {
			const adminUser = {
				nombre: "Administrator",
				email: "admin@gmail.com",
				password: "123",
				admin: true,
			};
			setUsers([adminUser]);
		}

		// 👇 AÑADIDO: recuperar usuario logueado
		if (storedCurrent) {
			setUser(JSON.parse(storedCurrent));
		}

		setIsFirstLoad(false);
	}, []);

	useEffect(() => {
		if (!isFirstLoad) {
			localStorage.setItem("users", JSON.stringify(users));
		}
	}, [users, isFirstLoad]);

	function register(nombre, email, password) {
		const existe = users.some((u) => u.email === email);
		if (existe) return false;

		const nuevoUsuario = { nombre, email, password, admin: false };
		setUsers([...users, nuevoUsuario]);
		return true;
	}

	function login(email, password) {
		const foundUser = users.find((u) => u.email === email && u.password === password);

		if (!foundUser) return false;

		setUser(foundUser);
		localStorage.setItem("currentUser", JSON.stringify(foundUser));
		return true;
	}

	function logout() {
		setUser(null);
		localStorage.removeItem("currentUser");
	}

	return <AuthContext.Provider value={{ users, user, setUsers, setUser, register, login, logout }}>{children}</AuthContext.Provider>;
}
