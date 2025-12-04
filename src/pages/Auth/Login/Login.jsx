import { useState } from "react";
import { useAuth } from "../../../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
	const { login } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		const ok = login(email, password);

		if (!ok) {
			setError("Correo o contraseña incorrectos");
			return;
		}

		setSuccess("Login exitoso, redirigiendo al inicio...");

		setTimeout(() => {
			navigate("/");
		}, 3000);
	};

	return (
		<div className="min-h-[70vh] w-full flex items-center justify-center px-4 py-10">
			<div
				className="
      w-full max-w-md 
      bg-white/80 backdrop-blur 
      border [border-color:var(--green-300)] 
      rounded-2xl 
      shadow-[var(--shadow-soft)] 
      p-8
    ">
				<h2 className="text-2xl font-semibold text-[color:var(--green-700)] text-center mb-6">Iniciar sesión</h2>

				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<label className="text-sm text-[color:var(--green-700)] font-medium">Correo</label>
						<input
							type="email"
							placeholder="correo@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="
              w-full px-4 py-2 
              rounded-full border 
              [border-color:var(--green-300)]
              text-[color:var(--green-700)]
              placeholder:text-[color:var(--green-700)]/50
              bg-white/60
              focus:outline-none
              focus:ring-2 focus:ring-[color:var(--green-500)]
              transition
            "
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-sm text-[color:var(--green-700)] font-medium">Contraseña</label>
						<input
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="
              w-full px-4 py-2 
              rounded-full border 
              [border-color:var(--green-300)]
              text-[color:var(--green-700)]
              placeholder:text-[color:var(--green-700)]/50
              bg-white/60
              focus:outline-none
              focus:ring-2 focus:ring-[color:var(--green-500)]
              transition
            "
						/>
					</div>

					<button
						type="submit"
						className="
            w-full mt-2 py-2 
            rounded-full
            bg-[color:var(--green-600)] 
            text-white font-medium
            shadow-[var(--shadow-soft)]
            hover:bg-[color:var(--green-500)]
            active:scale-[0.97]
            transition cursor-pointer
          ">
						Ingresar
					</button>

					{error && <p className="text-red-600 text-center text-sm mt-2">{error}</p>}
					{success && <p className="text-green-600 text-center text-sm mt-2">{success}</p>}
				</form>
			</div>
		</div>
	);
}
