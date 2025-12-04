	export default function BookFilters({ value, onChange, onClear, minPriceBound, maxPriceBound }) {
		const { q, yearFrom, yearTo, priceMin, priceMax } = value;

		// formateador simple para mostrar el ARS
		const fmt = (n) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n || 0);

		return (
			<aside className="w-[260px] shrink-0">
				<div className="rounded-xl border [border-color:var(--surface-border)] bg-[rgba(255,255,255,.82)] shadow-[var(--shadow-soft)] p-4 max-h-[calc(100vh-120px)] overflow-auto">
					<h3 className="font-semibold text-[color:var(--green-700)] mb-3">Filtros</h3>

					<form
						onSubmit={(e) => e.preventDefault()}
						className="space-y-4 text-sm">
						{/* Texto */}
						<div>
							<label className="block mb-1 text-[color:var(--green-700)]">Buscar</label>
							<input
								value={q}
								onChange={(e) => onChange({ ...value, q: e.target.value })}
								placeholder="Tolkien, dragón…"
								className="w-full rounded-md border [border-color:var(--green-300)] bg-white/80 px-3 py-2 outline-none focus:ring-2 focus:ring-[color:var(--green-500)]"
							/>
						</div>

						{/* Años */}
						<h5 className=" text-[color:var(--green-700)] mb-1">Años</h5>
						<div className="grid grid-cols-2 gap-2">
							<div>
								<label className="block mb-1 ml-3 text-[color:var(--green-700)]">Desde</label>
								<input
									type="number"
									min="1800"
									max="2025"
									value={yearFrom}
									placeholder="1800"
									onChange={(e) => onChange({ ...value, yearFrom: e.target.value })}
									className="w-full rounded-md border [border-color:var(--green-300)] bg-white/80 px-3 py-2 outline-none focus:ring-2 focus:ring-[color:var(--green-500)]"
								/>
							</div>
							<div>
								<label className="block ml-3 mb-1 text-[color:var(--green-700)]">Hasta</label>
								<input
									type="number"
									min="1800"
									max="2025"
									value={yearTo}
									placeholder="2025"
									onChange={(e) => onChange({ ...value, yearTo: e.target.value })}
									className="w-full rounded-md border [border-color:var(--green-300)] bg-white/80 px-3 py-2 outline-none focus:ring-2 focus:ring-[color:var(--green-500)]"
								/>
							</div>
						</div>

						{/* Precio */}
						<div className="pt-2">
							<h5 className="mb-2 font-[var(--font-display)] text-[color:var(--green-700)]">Precio</h5>

							{/* Min */}
							<label className="flex items-center justify-between text-xs text-[color:var(--green-700)]/80">
								<span className="ml-3">Mínimo</span>
								<span className="font-medium">{fmt(priceMin)}</span>
							</label>
							<input
								type="range"
								min={minPriceBound || 0}
								max={maxPriceBound || 0}
								value={priceMin}
								onChange={(e) => {
									const v = Number(e.target.value);
									onChange({ ...value, priceMin: Math.min(v, value.priceMax) });
								}}
								className="fantasy-range"
								style={{
									/* relleno verde desde el inicio hasta el valor actual */
									background: (() => {
										const min = minPriceBound || 0;
										const max = maxPriceBound || 0;
										const pct = max > min ? ((priceMin - min) * 100) / (max - min) : 0;
										return `linear-gradient(to right, var(--green-600) ${pct}%, var(--offwhite) ${pct}%)`;
									})(),
								}}
							/>

							{/* Máx */}
							<label className="mt-3 flex items-center justify-between text-xs text-[color:var(--green-700)]/80">
								<span className="ml-3">Máximo</span>
								<span className="font-medium">{fmt(priceMax)}</span>
							</label>
							<input
								type="range"
								min={minPriceBound || 0}
								max={maxPriceBound || 0}
								value={priceMax}
								onChange={(e) => {
									const v = Number(e.target.value);
									onChange({ ...value, priceMax: Math.max(v, value.priceMin) });
								}}
								className="fantasy-range"
								style={{
									/* relleno dorado para diferenciar el slider de Máx */
									background: (() => {
										const min = minPriceBound || 0;
										const max = maxPriceBound || 0;
										const pct = max > min ? ((priceMax - min) * 100) / (max - min) : 0;
										return `linear-gradient(to right, var(--gold-600) ${pct}%, var(--offwhite) ${pct}%)`;
									})(),
								}}
							/>
						</div>

						{/* Acciones */}
						<div className="pt-1 flex gap-2">
							<button
								type="button"
								className="px-3 py-2 rounded-md border [border-color:var(--green-300)
													hover:bg-[color:var(--green-500)] hover:text-white hover:[border-color:var(--gold-500)]
													hover:cursor-pointer transition-colors"
								onClick={onClear}>
								Limpiar
							</button>
						</div>
					</form>
				</div>
			</aside>
		);
	}
