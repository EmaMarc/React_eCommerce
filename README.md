# ✨ **Proyecto React -- Gestión de Productos & Catálogo**

### *Desarrollado por **Emanuel Marcello***

```{=html}
<p align="center">
```
`<img src="https://img.shields.io/badge/React-19.0-blue?style=for-the-badge" />`{=html}
`<img src="https://img.shields.io/badge/TailwindCSS-3.4-blueviolet?style=for-the-badge" />`{=html}
`<img src="https://img.shields.io/badge/Context_API-Global_State-orange?style=for-the-badge" />`{=html}
`<img src="https://img.shields.io/badge/CRUD-Products-success?style=for-the-badge" />`{=html}
`<img src="https://img.shields.io/badge/SEO%20Ready-Yes-77DD77?style=for-the-badge" />`{=html}
```{=html}
</p>
```
## 📌 **Descripción General**

Este proyecto es una aplicación construida en **React + Tailwind**,
diseñada para gestionar un catálogo de productos con una interfaz visual
moderna, transiciones suaves y un flujo de trabajo optimizado.

Incluye:

-   🛒 **Gestión completa de productos**\
    Crear, editar y eliminar ítems del catálogo.
-   🎚️ **Filtros avanzados**\
    Filtro por precio con sliders, por categoría, por búsqueda, y
    auto-reseteo cuando se agregan productos nuevos.
-   💾 **Context API global**\
    Manejo de productos, carrito y estados globales sin librerías
    externas.
-   🎟️ **Modales con animaciones**\
    Modales para agregar y editar productos que se despliegan desde
    *ProductDetail*.
-   🔔 **Toasts de notificación**\
    Feedback visual al crear o editar un producto.
-   🎨 **UI moderna**\
    Tailwind, animaciones personalizadas, orbes luminosos, y mejoras en
    home con estilos fluidos.
-   🔍 **SEO básico + accesibilidad**\
    Uso de etiquetas semánticas, mejoras ARIA, optimización de
    metadatos.
-   ⚙️ **Conexión con APIs reales y mockeadas**\
    Soporte para backend propio (Node/PHP) o API interna temporal.

## 🚀 **Tecnologías Principales**

  Tecnología              Uso
  ----------------------- --------------------------------------
  **React 19**            Base del proyecto
  **TailwindCSS**         Estilos rápidos, responsive y temado
  **React Context API**   Manejo global de estado
  **React Toastify**      Notificaciones
  **Custom Hooks**        Lógica separada y reutilizable
  **LocalStorage Sync**   Persistencia básica
  **Vite / CRA**          Entorno de desarrollo

## 📂 **Estructura del Proyecto**

    src/
    │── components/
    │   ├── Products/
    │   │   ├── ProductCard/
    │   │   ├── ProductDetail/
    │   │   ├── AddProductModal/
    │   │   └── EditProductModal/
    │   └── Filters/
    │── context/
    │   └── ProductContext.jsx
    │── Features/
    │   └── products/
    │── styles/
    │── App.jsx
    └── main.jsx

## 🧠 **Lógica del Proyecto**

### ✔️ Context API

Centraliza la lógica de:

-   Lista de productos\
-   Métodos `addBook`, `editBook`, `deleteBook`\
-   Carrito\
-   Filtros

Todo sincronizado con LocalStorage.

### ✔️ Modales dinámicos

-   Se abren desde botones dentro de **ProductDetail**.\
-   Tienen animación de entrada y salida.\
-   Se cierran automáticamente después de editar/crear.\
-   Muestran toast de éxito.

### ✔️ Filtros inteligentes

Los filtros se recalculan automáticamente cuando:

-   Se agrega un producto con precio fuera del rango actual\
-   Se elimina un producto\
-   Se resetea el catálogo

Evitan inconsistencias entre UI y lógica.

## 🖼️ **Diseño y Estilo**

✔️ Home con **orbes luminosos animados**\
✔️ Paleta soft moderna\
✔️ Layout fluido y responsivo\
✔️ Microinteracciones\
✔️ Código limpio inspirado en producción real

## 📦 **Características principales del CRUD**

### ➕ Agregar Producto

-   Validaciones\
-   Toast de éxito\
-   Reset automático del filtro

### ✏️ Editar Producto

-   Modal dentro del detalle\
-   Sincroniza cambios globales\
-   Muestra toast debajo de ProductDetail

### 🗑️ Eliminar Producto

-   Confirmación\
-   Actualiza filtros y UI

## 🛠️ **Instalación**

``` bash
npm install
npm run dev
```

## 🌐 **Deploy**

Compatible con:

-   Vercel\
-   Netlify\
-   Render

## ✨ **Autor**

### **👨‍💻 Emanuel Marcello**

Desarrollador Frontend -- Proyecto React 2025

## 🎯 **Objetivo del Proyecto**

Ofrecer un sistema visual, intuitivo y escalable para gestionar
productos con experiencia moderna, pensado para un entorno real de
catálogo o tienda.
