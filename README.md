# NotiApp

Aplicación de noticias personalizada desarrollada con Next.js y TailwindCSS.

## Características

- 📱 Diseño responsive
- 🌓 Modo oscuro/claro
- 👤 Sistema de autenticación
- 🔍 Búsqueda de noticias
- 📰 Visualización de noticias en slider
- 🎨 Interfaz moderna y amigable
- 🔔 Personalización de intereses

## Tecnologías Utilizadas

- Next.js 14
- React
- TypeScript
- TailwindCSS
- News API

## Estructura del Proyecto

```
NotiApp/
├── frontend/               # Aplicación Next.js
│   ├── src/                # Código fuente
│   │   ├── app/            # Componentes y páginas
│   │   │   ├── page.tsx    # Página principal
│   │   │   └── layout.tsx  # Layout principal
│   │   └── ...
│   ├── public/             # Archivos estáticos
│   ├── next.config.js      # Configuración de Next.js
│   └── package.json        # Dependencias
└── README.md               # Este archivo
```

## Requisitos

- Node.js (versión 18 o superior)
- NPM o Yarn

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/TU_USUARIO/notiapp.git
cd notiapp
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env.local` y agrega tu API key de News API:
```
NEXT_PUBLIC_NEWS_API_KEY=tu_api_key
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

## Licencia

[MIT](https://choosealicense.com/licenses/mit/) 