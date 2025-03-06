# NotiApp - Aplicación de Noticias Personalizadas

NotiApp es una aplicación web que muestra noticias personalizadas utilizando la API de NewsAPI.

## Características

- Pantalla de carga con barra de progreso
- Visualización de noticias en tarjetas
- Manejo de errores y datos de ejemplo
- Diseño responsive para móviles

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

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/notiapp.git
   cd notiapp
   ```

2. Instala las dependencias del frontend:
   ```bash
   cd frontend
   npm install
   ```

## Ejecución

1. Inicia el servidor de desarrollo del frontend:
   ```bash
   cd frontend
   npm run dev
   ```

2. Abre tu navegador y visita:
   ```
   http://localhost:3001
   ```

## API de Noticias

Esta aplicación utiliza [NewsAPI](https://newsapi.org/) para obtener noticias en tiempo real. Si la API no devuelve resultados, la aplicación mostrará datos de ejemplo.

Para obtener tu propia API Key:
1. Regístrate en [NewsAPI](https://newsapi.org/register)
2. Copia tu API Key
3. Reemplaza la API Key en el archivo `frontend/src/app/page.tsx`

## Solución de Problemas

Si encuentras el mensaje "No se encontraron noticias disponibles", puede deberse a:

1. La API Key ha expirado o no es válida
2. No hay noticias disponibles para el país seleccionado (mx)
3. Problemas de conexión con la API

En estos casos, la aplicación mostrará noticias de ejemplo para que puedas seguir probando la interfaz.

## Licencia

ISC 