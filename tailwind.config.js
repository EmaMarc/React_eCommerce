/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				brand: {
					50: "#eef2ff",
					100: "#e0e7ff",
					300: "#a5b4fc",
					500: "#6366f1",
					600: "#4f46e5",
					800: "#2a246d",
					900: "#181657",
				},
				accent: {
					400: "#e6c65c",
					500: "#d4af37",
				},
				surface: {
					50: "#0b1020",
					100: "#10162a",
					200: "#151b2e",
					300: "#1a2035",
				},
				parchment: "#f6f1e5",
			},
			fontFamily: {
				display: ["Cinzel", "serif"],
				sans: ["Inter", "system-ui", "sans-serif"],
			},
			boxShadow: {
				glow: "0 0 0 2px rgba(212,175,55,0.25), 0 8px 30px rgba(0,0,0,0.35)",
			},
			backgroundImage: {
				"arcane-radial":
					"radial-gradient(1200px 600px at 10% -10%, rgba(79,70,229,0.25), transparent 60%), radial-gradient(1000px 500px at 90% 0%, rgba(16,185,129,0.12), transparent 55%)",
			},
		},
	},
	plugins: [],
};
