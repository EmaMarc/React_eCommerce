import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Navbar from "./components/Navbar/Navbar";
import { Toaster } from "react-hot-toast"; // 👈 agregar

// Páginas
import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import ProductsDetail from "./pages/ProductsDetail/ProductsDetail";
import Checkout from "./pages/Checkout/Checkout";
import Register from "./pages/Auth/Register/Register";
import Login from "./pages/Auth/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
	return (
		<>
			<Navbar />

			{/* 👇 Toaster global */}
			<Toaster
				position="bottom-center"
				gutter={12}
				containerStyle={{
					bottom: 40,
				}}
				toastOptions={{
					duration: 2500,
					style: {
						fontSize: "15px",
						padding: "12px 18px",
						borderRadius: "12px",
						background: "#171717",
						color: "#fff",
						border: "1px solid rgba(255,255,255,0.1)",
						boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
					},

					// 🟢 AGREGAR
					success: {
						icon: "➕",
						style: {
							background: "#0f5132",
							border: "1px solid #198754",
						},
					},

					// 🔵 EDITAR
					loading: {
						icon: "✏️",
						style: {
							background: "#063970",
							border: "1px solid #0d6efd",
						},
					},

					// 🔴 ELIMINAR (error)
					error: {
						icon: "🗑️",
						style: {
							background: "#842029",
							border: "1px solid #dc3545",
						},
					},
				}}
			/>

			<AppLayout>
				<Routes>
					<Route
						path="/"
						element={<Home />}
					/>
					<Route
						path="/products"
						element={<Products />}
					/>
					<Route
						path="/products/:workId"
						element={<ProductsDetail />}
					/>
					<Route
						path="/checkout"
						element={
							<ProtectedRoute>
								<Checkout />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/register"
						element={<Register />}
					/>
					<Route
						path="/login"
						element={<Login />}
					/>

					<Route
						path="*"
						element={
							<h1 className="text-xl">
								<i className="fas fa-exclamation-triangle"></i> 404 - Not Found
							</h1>
						}
					/>
				</Routes>
			</AppLayout>
		</>
	);
}

export default App;
