# 🛸 Rick and Morty Monorepo BFF (API Composition)

Aplicación Full-Stack implementada bajo el patrón arquitectónico **Backend-For-Frontend (BFF)** y **API Composition (Endpoints Anidados)** con **Java 17**, **Spring Boot (`RestTemplate`)** y **Vanilla JS + Tailwind CSS**, acompañada de pruebas **End-to-End (E2E)** automatizadas con **Playwright**.

---

## 🏗️ Arquitectura del Proyecto (API Composition)

El frontend estático es servido directamente por Spring Boot en `http://localhost:8080` y consume un único endpoint local compuesto (`/api/personaje/buscar?nombre=X`). Internamente, el backend encadena tres peticiones con `RestTemplate` hacia la API pública de Rick and Morty (`rickandmortyapi.com`) y devuelve los objetos JSON consolidados en un solo paso:

```text
[ Navegador (index.html + app.js + Tailwind CSS) ]
                       │
                       ▼  GET /api/personaje/buscar?nombre=X
[ Backend-For-Frontend (Spring Boot :8080 - RestTemplate) ]
   ├── 1. GET https://rickandmortyapi.com/api/character/?name=X
   ├── 2. GET location.url  -> Extrae la dimensión (dimension)
   └── 3. GET episode[0]    -> Extrae el nombre del primer episodio (name)
```

---

## 📂 Estructura del Proyecto

```text
rickandmorty/
├── src/main/
│   ├── java/com/proyecto/rickandmorty/
│   │   ├── controller/
│   │   │   └── RickAndMortyController.java      # Endpoint único: GET /api/personaje/buscar?nombre=X
│   │   ├── model/
│   │   │   ├── PersonajeConsolidadoDTO.java     # DTO consolidado (personaje + dimensión + 1er episodio)
│   │   │   ├── CharacterDTO.java                # DTO de personaje externo
│   │   │   ├── CharacterResponseDTO.java        # Wrapper de respuesta paginada
│   │   │   ├── LocationDTO.java                 # DTO de ubicación externa
│   │   │   └── EpisodeDTO.java                  # DTO de episodio externo
│   │   ├── service/
│   │   │   └── RickAndMortyService.java         # Servicio que encadena las 3 peticiones con RestTemplate
│   │   └── RickandmortyApplication.java         # Clase principal de Spring Boot
│   └── resources/
│       ├── static/
│       │   ├── index.html                       # Estructura base con Tailwind CSS (CDN)
│       │   └── app.js                           # Debounce de 4000ms + tarjetas y modal 100% desde el DOM
│       └── application.properties
├── tests/
│   └── rickandmorty.spec.js                     # Pruebas E2E automatizadas con Playwright
├── playwright.config.js                         # Configuración de Playwright para http://localhost:8080
├── package.json                                 # Scripts de pruebas E2E
└── pom.xml                                      # Configuración Maven (Spring Web + Java 17)
```

---

## 🚀 Endpoint Compuesto del Backend

| Método | Ruta Local | Parámetro | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/personaje/buscar` | `nombre` *(opcional)* | Encadena las peticiones de personaje, ubicación (`location.url`) y primer episodio (`episode[0]`) y devuelve el JSON consolidado. |

---

## 🛠️ Ejecución del Proyecto

Desde la raíz del proyecto, inicia el servidor de Spring Boot:

```powershell
.\mvnw.cmd spring-boot:run
```

Luego abre en tu navegador:
👉 **`http://localhost:8080`**

---

## 🧪 Ejecución de las Pruebas E2E (Playwright)

```powershell
# Ejecutar las 3 pruebas E2E en consola (modo headless)
npm test

# Ejecutar las pruebas abriendo el navegador en vivo
npm run test:headed

# Abrir el panel interactivo de Playwright (modo UI)
npm run test:ui

# Abrir el reporte visual HTML de Playwright
npx playwright show-report
```
