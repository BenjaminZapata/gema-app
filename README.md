# Sistema de Gestión Integral para Librería Gema

## Introducción General

Este proyecto implementa una solución tecnológica integral diseñada específicamente para la **Librería Gema**. El sistema consiste en una aplicación web dinámica que unifica la gestión de inventario, ventas, gastos y análisis del negocio en una interfaz moderna y fácil de usar.

La aplicación ha sido desarrollada pensando en una ejecución completamente local, donde una única computadora actúa como cliente y servidor simultáneamente. Esto elimina la necesidad de despliegues en la nube o configuraciones de dominio complejas, enfocándose en proveer una herramienta potente y accesible para la operación diaria de la librería.

## Objetivos del Sistema y Funcionalidades Clave

El propósito fundamental de esta aplicación es optimizar y simplificar la administración de la Librería Gema. Para ello, el sistema ofrece las siguientes funcionalidades:

- **Gestión de Productos:**
  - Registro y administración detallada de productos.
  - Campos incluyen: código de identificación, descripción (opcional), nombre, categoría, stock disponible, stock mínimo (para alertas de pedidos basados en faltantes), precio de compra, precio de venta al público, proveedor asociado, fecha de vencimiento (opcional) y un indicador de disponibilidad para la tienda online.
- **Registro de Ventas:**
  - Interfaz para la captura y almacenamiento eficiente de las transacciones de venta.
  - Permite la inclusión de múltiples productos previamente registrados en cada venta.
- **Registro de Gastos:**
  - Módulo para registrar todos los egresos del negocio.
  - Cubre diversos tipos de gastos como pagos de servicios, impuestos, pedidos a distribuidores, sueldos y otros gastos operativos.
- **Análisis de Ventas y Gastos:**
  - Herramientas visuales para la evaluación del rendimiento del negocio.
  - Consulta de productos más vendidos (filtrables por categoría o nombre).
  - Cálculo y visualización de totales de ingresos y egresos para un análisis financiero claro.

## Tecnologías Utilizadas

La solución se ha construido utilizando un stack tecnológico moderno y eficiente:

- **Framework Principal:** [Next.js](https://nextjs.org/) (con React y TypeScript) - Utilizado para desarrollar tanto el frontend como el backend (API interna) en un entorno unificado.
- **Manejo de Estado Global:** [Redux](https://redux.js.org/) - Para una gestión de estados centralizada y predecible a lo largo de la aplicación.
- **Interfaz de Usuario (UI):** [Material UI (MUI)](https://mui.com/) - Para un diseño de interfaz de usuario profesional, consistente y con componentes reutilizables.
- **ORM (Object-Relational Mapper):** [Prisma](https://www.prisma.io/) - Para una interacción segura, tipada y eficiente con la base de datos.
- **Peticiones HTTP:** [Axios](https://axios-http.com/) - Para la comunicación entre el frontend y la API interna de Next.js.
- **Base de Datos:** [MySQL](https://www.mysql.com/) - Sistema de gestión de base de datos relacional para almacenar toda la información crítica del negocio (productos, ventas, gastos, proveedores).
- **Entorno de Ejecución:** Local (la misma máquina actúa como cliente y servidor).

## Configuración y Ejecución Local

Para ejecutar este proyecto en tu entorno local, sigue estos pasos generales:

1.  **Prerrequisitos:**

    - Node.js (se recomienda la última versión LTS)
    - npm o yarn
    - Un servidor de base de datos MySQL instalado y en ejecución.

2.  **Clonar el Repositorio:**

    ```bash
    git clone https://github.com/BenjaminZapata/gema-app.git
    cd gema-app
    ```

3.  **Instalar Dependencias:**

    ```bash
    npm install
    # o
    yarn install
    ```

4.  **Configuración de la Base de Datos:**

    - Crea una base de datos MySQL para el proyecto.
    - Configura el archivo `.env` en la raíz del proyecto con tu cadena de conexión a la base de datos. Prisma usa la variable `DATABASE_URL`. Ejemplo:
      ```env
      DATABASE_URL="mysql://USUARIO:CONTRASEÑA@HOST:PUERTO/NOMBRE_BASE_DE_DATOS"
      ```
    - Ejecuta las migraciones de Prisma para crear las tablas en tu base de datos:
      ```bash
      npx prisma migrate dev
      ```

5.  **Ejecutar la Aplicación en Modo Desarrollo:**
    ```bash
    npm run dev
    # o
    yarn dev
    ```
    La aplicación debería estar disponible en `http://localhost:3000` (o el puerto que Next.js indique).
