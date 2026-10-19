# 🛸 Rick and Morty BFF Explorer

Aplicación Full-Stack implementada bajo el patrón arquitectónico **Backend-For-Frontend (BFF)** con **Java 17**, **Spring Boot** y **Vanilla JS + Tailwind CSS**, acompañada de pruebas **End-to-End (E2E)** automatizadas con **Playwright**.

---

## 🏗️ Arquitectura del Proyecto (Patrón BFF)

El navegador nunca realiza peticiones directas a la API pública externa (`rickandmortyapi.com`). En su lugar, el frontend es servido directamente por Spring Boot en `http://localhost:8080` y consume únicamente los endpoints locales expuestos por el backend:

```text
[ Navegador (Vanilla JS + Tailwind CSS) ]
                 │
                 ▼  (Fetch a rutas locales: /api/*)
[ Backend-For-Frontend (Spring Boot :8080) ]
                 │
                 ▼  (RestClient HTTP GET)
[ API Externa (https://rickandmortyapi.com/api) ]
```

---

## 📂 Estructura de Directorios

```text
rickandmorty/
├── src/main/
│   ├── java/com/proyecto/rickandmorty/
│   │   ├── controller/
│   │   │   └── RickAndMortyController.java   # Endpoints locales (/api/personajes, /api/ubicaciones/{id}, /api/episodios/{id})
│   │   ├── model/
│   │   │   ├── CharacterDTO.java             # DTO de personaje (id, name, species, image, origin, location, episode)
│   │   │   ├── CharacterResponseDTO.java     # Wrapper de la respuesta paginada
│   │   │   ├── LocationDTO.java              # DTO de ubicación y dimensión
│   │   │   └── EpisodeDTO.java               # DTO de episodio
│   │   ├── service/
│   │   │   └── RickAndMortyService.java      # Cliente HTTP con RestClient hacia rickandmortyapi.com
│   │   └── RickandmortyApplication.java      # Clase principal de Spring Boot
│   └── resources/
│       └── static/
│           └── index.html                    # UI oscura con Tailwind CDN, Debounce de 4000ms y Modal
├── tests/
│   └── rickandmorty.spec.js                  # Suite de pruebas E2E con Playwright
├── playwright.config.js                      # Configuración de Playwright apuntando a http://localhost:8080
├── package.json                              # Scripts de ejecución de pruebas E2E
└── pom.xml                                   # Configuración Maven (Spring Boot + Java 17)
```

---

## 🚀 Endpoints Locales del BFF

| Método | Ruta Local | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/personajes` | Obtiene la lista de personajes por defecto. Soporta filtro opcional `?name={nombre}`. |
| `GET` | `/api/ubicaciones/{id}` | Obtiene el detalle de una ubicación (incluyendo su `dimension`). |
| `GET` | `/api/episodios/{id}` | Obtiene el detalle de un episodio (incluyendo su `name` y código `episode`). |

---

## ✨ Características del Frontend

- **UI Temática Oscura**: Diseñada con utilidades de **Tailwind CSS** vía CDN.
- **Buscador con Debounce Estricto (4000 ms)**: Incluye una función `debounce` de 4 segundos exactos; la petición a `/api/personajes?name=...` solo se ejecuta tras 4000 ms sin que el usuario escriba.
- **Grid de Tarjetas y Modal Multi-Endpoint**: Muestra `image`, `name` y `species`. Al hacer clic en cualquier tarjeta, abre un modal centrado que consulta `/api/ubicaciones/{id}` y `/api/episodios/{id}` para mostrar la dimensión de origen y el nombre del primer episodio.

---

## 🛠️ Ejecución del Proyecto

### 1. Iniciar el Servidor Spring Boot
Desde la raíz del proyecto, ejecuta:

```powershell
.\mvnw.cmd spring-boot:run
```

Una vez iniciado, abre en tu navegador:
👉 **`http://localhost:8080`**

---

## 🧪 Ejecución de las Pruebas E2E (Playwright)

El proyecto cuenta con 3 pruebas automatizadas en `tests/rickandmorty.spec.js` que validan:
1. **Carga inicial**: Renderizado de las 20 tarjetas por defecto desde `/api/personajes`.
2. **Validación estricta del Debounce (4000 ms)**: Verifica que al escribir `"Morty"` no se dispare ninguna petición antes de los 4 segundos y que el grid se actualice tras cumplirse los 4000 ms.
3. **Interacción del Modal (Multi-Endpoints)**: Verifica la apertura del modal y la carga de la dimensión (`Dimension C-137`) y el primer episodio (`Pilot`) desde `/api/ubicaciones/1` y `/api/episodios/1`.

### Comandos disponibles:

```powershell
# Ejecutar todas las pruebas en consola (modo headless)
npm test

# Ejecutar las pruebas viendo el navegador abrirse en vivo
npm run test:headed

# Abrir el panel interactivo de Playwright (modo UI)
npm run test:ui

# Abrir el reporte HTML con capturas de pantalla y trazas paso a paso
npx playwright show-report
```
