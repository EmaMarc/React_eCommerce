import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Fija el elemento cuando window.scrollY + topPx
 * supera su posición original (anchorTop).
 */
export default function useStickyFixed(ref, topPx = 96) {
	const [fixed, setFixed] = useState(false);
	const [left, setLeft] = useState(0);
	const [width, setWidth] = useState(260);
	const [height, setHeight] = useState(0);

	const anchorTopRef = useRef(0); // posición original del wrapper en el doc

	const measure = () => {
		const el = ref.current;
		if (!el) return;
		const parent = el.parentElement;
		const rect = el.getBoundingClientRect();
		const parentRect = parent.getBoundingClientRect();

		setLeft(parentRect.left + window.scrollX);
		setWidth(parentRect.width);
		setHeight(rect.height);

		// ancla: top absoluto de EL respecto del documento
		anchorTopRef.current = rect.top + window.scrollY;
	};

	useLayoutEffect(() => {
		measure();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const onScroll = () => {
			const anchorTop = anchorTopRef.current || 0;
			const shouldFix = window.scrollY + topPx >= anchorTop;
			setFixed(shouldFix);
		};
		const onResize = () => {
			measure();
			// recalcular estado tras resize
			const anchorTop = anchorTopRef.current || 0;
			setFixed(window.scrollY + topPx >= anchorTop);
		};

		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onResize);
		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onResize);
		};
	}, [measure, topPx]);

	// si cambia el contenido (altura), volvemos a medir
	useEffect(() => {
		measure();
	});

	return { fixed, left, width, top: topPx, height };
}
