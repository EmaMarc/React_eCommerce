/** @type {import('plop').NodePlopAPI} */
module.exports = function (plop) {
	plop.setHelper("lcFirst", (txt) => txt.charAt(0).toLowerCase() + txt.slice(1));

	plop.setGenerator("component", {
		description: "React component scaffold",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Nombre del componente (PascalCase o cualquier formato):",
				validate: (v) => !!v || "Ingresa un nombre",
			},
			{
				type: "list",
				name: "style",
				message: "¿Estilos?",
				choices: [
					{ name: "Sin estilos (ideal Tailwind)", value: "none" },
					{ name: "CSS Module", value: "module" },
					{ name: "styled-components", value: "sc" },
				],
				default: "none",
			},
			{
				type: "confirm",
				name: "withIndex",
				message: "¿Crear index.js para export por carpeta?",
				default: true,
			},
			{
				type: "confirm",
				name: "withTest",
				message: "¿Crear archivo de test? (vitest/jest)",
				default: false,
			},
		],
		actions: (data) => {
			const actions = [];

			// Carpeta destino: src/components/<Name>/
			actions.push({
				type: "add",
				path: "src/components/{{pascalCase name}}/{{pascalCase name}}.jsx",
				templateFile: "plop-templates/component/Component.jsx.hbs",
			});

			if (data.style === "module") {
				actions.push({
					type: "add",
					path: "src/components/{{pascalCase name}}/{{pascalCase name}}.module.css",
					templateFile: "plop-templates/component/Component.module.css.hbs",
				});
			}

			if (data.style === "sc") {
				actions.push({
					type: "add",
					path: "src/components/{{pascalCase name}}/styled.js",
					templateFile: "plop-templates/component/styled.js.hbs",
				});
			}

			if (data.withIndex) {
				actions.push({
					type: "add",
					path: "src/components/{{pascalCase name}}/index.js",
					templateFile: "plop-templates/component/index.js.hbs",
				});
			}

			if (data.withTest) {
				actions.push({
					type: "add",
					path: "src/components/{{pascalCase name}}/{{pascalCase name}}.test.jsx",
					templateFile: "plop-templates/component/Component.test.jsx.hbs",
				});
			}

			return actions;
		},
	});
};
