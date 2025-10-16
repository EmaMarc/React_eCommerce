export default function AppLayout({ children }) {
	return (
		<div className="min-h-screen w-screen overflow-x-hidden text-[color:var(--green-700)] [background-image:var(--bg-gradient)]">
			<main className="px-12 py-12 w-screen min-h-screen !max-w-none !mx-0">{children}</main>
		</div>
	);
}
