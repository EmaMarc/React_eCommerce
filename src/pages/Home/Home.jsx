import { Link } from "react-router-dom";
import logo from "../../../public/logo.png";
import "../../styles/Mist.scss";

// ⭐ IMPORTAR HELMET
import { Helmet } from "react-helmet";

export default function Home() {
	return (
		<>
			{/* ⭐ SEO PARA HOME */}
			<Helmet>
				<title>Mythica Books | Librería de Fantasía Épica y Mundos Mágicos</title>

				<meta
					name="description"
					content="Descubrí libros de fantasía épica, sagas, mundos mágicos, aventuras, dragones, mitología y autores icónicos del género. Bienvenido a Mythica Books."
				/>

				<meta
					name="keywords"
					content="fantasía épica, libros de fantasía, sagas, magia, dragones, literatura fantástica, mitología, mundos mágicos, novelas fantásticas"
				/>

				<meta charSet="utf-8" />
			</Helmet>

			<section className="w-full py-20 px-12">
				<div className="max-w-[1200px]">
					{/* Logotipo + título */}
					<div className="flex items-center gap-4">
						<div className="mythica-brand flex items-center gap-4">
							<span className="mythica-mist mythica-mist--logo">
								<img
									src={logo}
									alt="Mythica Books logo"
									className="relative [z-index:2] h-24 w-24 object-contain rounded-xl"
								/>
							</span>
						</div>
						<h1 className="[font-family:var(--font-display)] text-5xl leading-tight text-[color:var(--green-700)] drop-shadow-sm">Mythica Books</h1>
					</div>

					<p className="mt-3 text-lg text-[color:var(--green-700)]/80">Fantasía épica, mundos y magia. Descubrí tu próxima saga.</p>

					<div className="mt-8 flex items-center gap-4">
						<Link
							to="/products"
							className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-white
                       bg-[color:var(--green-600)] hover:bg-[color:var(--green-500)]
                       shadow-[var(--shadow-soft)]">
							<span className="material-icons text-base">local_library</span>
							Explorar libros
						</Link>

						<Link
							to="/products?featured=1"
							className="inline-flex items-center gap-2 px-5 py-3 rounded-md
                       text-[color:var(--green-700)]
                       bg-[color:var(--offwhite)] hover:bg-white
                       border [border-color:var(--green-300)]
                       shadow-[var(--shadow-soft)]">
							<span className="material-icons text-base">auto_awesome</span>
							Recomendados
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
