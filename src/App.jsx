import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Navbar from "./components/Navbar/Navbar";

// Páginas
import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import ProductsDetail from "./pages/ProductsDetail/ProductsDetail";
import Checkout from "./pages/Checkout/Checkout";

function App() {
	return (
		<>
			<Navbar />
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
						element={<Checkout />}
					/>
					<Route
						path="*"
						element={
							<h1 className="text-xl">
								{" "}
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
