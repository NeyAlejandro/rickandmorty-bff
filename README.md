# 🛸 Rick and Morty BFF (API Composition)

Full-Stack application built using the **Backend-For-Frontend (BFF)** and **API Composition (Nested Endpoints)** patterns with **Java 17**, **Spring Boot (`RestTemplate`)**, and **Vanilla JS + Tailwind CSS**, including automated **End-to-End (E2E)** tests powered by **Playwright**.

---

## 🏗️ Project Architecture (API Composition)

The static frontend is served directly by Spring Boot at `http://localhost:8080` and consumes a single consolidated local endpoint (`/api/personaje/buscar?nombre=X`). Internally, the backend chains three HTTP GET requests using `RestTemplate` against the public Rick and Morty API (`rickandmortyapi.com`) and returns the consolidated JSON payload in a single step:

```text
[ Browser (index.html + app.js + Tailwind CSS) ]
                       │
                       ▼  GET /api/personaje/buscar?nombre=X
[ Backend-For-Frontend (Spring Boot :8080 - RestTemplate) ]
   ├── 1. GET https://rickandmortyapi.com/api/character/?name=X
   ├── 2. GET location.url  -> Extracts the origin/location dimension
   └── 3. GET episode[0]    -> Extracts the first episode name
```

---

## 📂 Project Structure

```text
rickandmorty/
├── src/main/
│   ├── java/com/proyecto/rickandmorty/
│   │   ├── controller/
│   │   │   └── RickAndMortyController.java      # Consolidated endpoint: GET /api/personaje/buscar?nombre=X
│   │   ├── model/
│   │   │   ├── PersonajeConsolidadoDTO.java     # Consolidated DTO (character + dimension + 1st episode)
│   │   │   ├── CharacterDTO.java                # External API character DTO
│   │   │   ├── CharacterResponseDTO.java        # Paginated response wrapper DTO
│   │   │   ├── LocationDTO.java                 # External API location DTO
│   │   │   └── EpisodeDTO.java                  # External API episode DTO
│   │   ├── service/
│   │   │   └── RickAndMortyService.java         # Service chaining 3 HTTP calls via RestTemplate
│   │   └── RickandmortyApplication.java         # Spring Boot main application class
│   └── resources/
│       ├── static/
│       │   ├── index.html                       # Dark-themed UI using Tailwind CSS (CDN)
│       │   └── app.js                           # Strict 4000ms debounce + 100% DOM-rendered cards & modal
│       └── application.properties
├── tests/
│   └── rickandmorty.spec.js                     # Automated E2E test suite with Playwright
├── playwright.config.js                         # Playwright configuration targeting http://localhost:8080
├── package.json                                 # E2E test runner scripts
└── pom.xml                                      # Maven configuration (Spring Web + Java 17)
```

---

## 🚀 Backend API Endpoint

| Method | Local Route | Query Param | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/personaje/buscar` | `nombre` *(optional)* | Chains the character, location (`location.url`), and first episode (`episode[0]`) requests and returns the consolidated JSON response. |

---

## ✨ Key Features

- **Dark Thematic UI**: Built with **Tailwind CSS** utility classes via CDN.
- **Strict 4000ms Debounce Search**: Includes a `debounce` function with a strict 4-second delay before firing the `fetch` request to the local backend.
- **100% Vanilla JS DOM Manipulation**: Both the character cards and the detail modal are dynamically rendered using `innerHTML` and JavaScript *Template Literals*, displaying all nested data returned by the backend in a single step.

---

## 🛠️ Running the Application

From the project root directory, start the Spring Boot server:

```powershell
.\mvnw.cmd spring-boot:run
```

Once started, open your browser at:
👉 **`http://localhost:8080`**

---

## 🧪 Running E2E Tests (Playwright)

The `tests/rickandmorty.spec.js` suite validates three critical flows:
1. **Initial Load**: Verifies that the 20 consolidated character cards render with nested data on startup.
2. **Strict Debounce Validation (4000ms)**: Verifies that typing `"Morty"` does not trigger any network request before 4 seconds and updates the UI once the 4000ms window completes.
3. **Modal Interaction**: Clicks a character card and verifies that the modal is dynamically injected into the DOM displaying the consolidated dimension and first episode details.

```powershell
# Run all E2E tests in headless mode
npm test

# Run tests with the browser window visible
npm run test:headed

# Open Playwright interactive UI mode
npm run test:ui

# Open the visual HTML report with screenshots and traces
npx playwright show-report
```
