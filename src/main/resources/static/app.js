const searchInput = document.getElementById('searchInput');
const debounceIndicator = document.getElementById('debounceIndicator');
const debounceStatus = document.getElementById('debounceStatus');
const charactersGrid = document.getElementById('charactersGrid');
const modalContainer = document.getElementById('modalContainer');

const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:8080' : '';

/**
 * Función Debounce con delay estricto de 4000ms (4 segundos)
 */
function debounce(callback, delay = 4000) {
    let timerId;
    return function (...args) {
        clearTimeout(timerId);
        debounceIndicator.classList.remove('hidden');
        debounceStatus.classList.remove('hidden');

        timerId = setTimeout(() => {
            debounceIndicator.classList.add('hidden');
            debounceStatus.classList.add('hidden');
            callback.apply(this, args);
        }, delay);
    };
}

/**
 * Realiza el fetch al único endpoint compuesto del backend:
 * GET /api/personaje/buscar?nombre=X
 */
async function buscarPersonajes(nombre = '') {
    const query = nombre ? nombre.trim() : '';

    charactersGrid.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-20">
            <div class="w-14 h-14 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mb-4"></div>
            <p class="text-emerald-300 font-medium">Consolidando personajes, dimensiones y episodios en el BFF...</p>
        </div>
    `;

    try {
        const response = await fetch(`${API_BASE}/api/personaje/buscar?nombre=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        const personajes = Array.isArray(data) ? data : (data ? [data] : []);
        renderizarTarjetasConsolidadas(personajes);
    } catch (error) {
        console.error('Error al consultar /api/personaje/buscar:', error);
        renderizarTarjetasConsolidadas([]);
    }
}

/**
 * Crea todas las tarjetas en el grid 100% mediante manipulación del DOM usando innerHTML y Template Literals
 * mostrando todos los datos consolidados devueltos por el backend en un solo paso.
 */
function renderizarTarjetasConsolidadas(personajes) {
    if (!Array.isArray(personajes) || personajes.length === 0) {
        charactersGrid.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <div class="text-5xl mb-3">🛸</div>
                <h2 class="text-xl font-bold text-slate-200">No se encontraron personajes en esta dimensión</h2>
                <p class="text-slate-400 text-sm mt-1">Intenta buscar otro nombre (ej. Rick, Morty, Summer, Beth).</p>
            </div>
        `;
        return;
    }

    charactersGrid.innerHTML = personajes.map((personaje, index) => `
        <article
            data-index="${index}"
            class="character-card w-full group bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 rounded-2xl overflow-hidden shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer flex flex-col"
        >
            <div class="relative h-60 overflow-hidden bg-slate-950">
                <img
                    src="${personaje.image}"
                    alt="${personaje.name}"
                    loading="lazy"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-85"></div>
                <span class="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-sm">
                    ${personaje.species}
                </span>
            </div>

            <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                    <h2 class="text-xl font-extrabold text-white group-hover:text-emerald-400 transition-colors truncate">
                        ${personaje.name}
                    </h2>
                    <p class="text-xs text-slate-400 mt-1 truncate">
                        Ubicación: <span class="text-slate-200 font-medium">${personaje.locationName}</span>
                    </p>
                </div>

                <!-- Datos anidados devueltos en un solo paso por el endpoint compuesto -->
                <div class="space-y-2 pt-3 border-t border-slate-800 text-sm">
                    <div class="flex items-center justify-between gap-2 bg-slate-950/70 px-3 py-2 rounded-lg border border-slate-800/80">
                        <span class="text-xs uppercase tracking-wider text-cyan-400 font-semibold shrink-0">Dimensión</span>
                        <span class="text-slate-100 font-medium text-right truncate">${personaje.dimension}</span>
                    </div>
                    <div class="flex items-center justify-between gap-2 bg-slate-950/70 px-3 py-2 rounded-lg border border-slate-800/80">
                        <span class="text-xs uppercase tracking-wider text-emerald-400 font-semibold shrink-0">1er Episodio</span>
                        <span class="text-slate-100 font-medium text-right truncate">${personaje.firstEpisodeName}</span>
                    </div>
                </div>

                <div class="pt-1 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                    <span>Ver modal de detalle</span>
                    <span class="group-hover:translate-x-1 transition-transform">→</span>
                </div>
            </div>
        </article>
    `).join('');

    const cards = charactersGrid.querySelectorAll('.character-card');
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            const idx = Number(card.getAttribute('data-index'));
            mostrarModalConsolidado(personajes[idx]);
        });
    });
}

/**
 * Crea y muestra el modal 100% mediante manipulación del DOM con innerHTML y Template Literals
 * usando directamente el objeto JSON consolidado que ya devolvió el backend.
 */
function mostrarModalConsolidado(personaje) {
    modalContainer.innerHTML = `
        <div
            id="detailModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
        >
            <div class="relative w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl shadow-emerald-500/10 overflow-hidden">
                <button
                    id="closeModalBtn"
                    type="button"
                    aria-label="Cerrar modal"
                    class="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-slate-950/80 text-slate-300 hover:text-white hover:bg-emerald-500/20 border border-slate-700 flex items-center justify-center transition-colors"
                >
                    ✕
                </button>

                <div class="relative h-64 w-full bg-slate-950">
                    <img
                        src="${personaje.image}"
                        alt="${personaje.name}"
                        class="w-full h-full object-cover"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent"></div>
                    <div class="absolute bottom-4 left-5 right-5">
                        <span id="modalSpecies" class="inline-block px-3 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-1">
                            ${personaje.species}
                        </span>
                        <h3 id="modalName" class="text-2xl font-extrabold text-white drop-shadow">
                            ${personaje.name}
                        </h3>
                    </div>
                </div>

                <div class="p-6 space-y-4">
                    <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                        <p class="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1">Dimensión (Location API)</p>
                        <p id="modalDimension" class="text-base font-bold text-slate-100">${personaje.dimension}</p>
                        <p class="text-xs text-slate-400 mt-0.5">Ubicación: ${personaje.locationName}</p>
                    </div>

                    <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                        <p class="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-1">Primer Episodio (Episode API)</p>
                        <p id="modalEpisode" class="text-base font-bold text-slate-100">${personaje.firstEpisodeName}</p>
                        <p class="text-xs text-slate-400 mt-0.5">Código: ${personaje.firstEpisodeCode}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    const detailModal = document.getElementById('detailModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    closeModalBtn.addEventListener('click', cerrarModal);
    detailModal.addEventListener('click', (event) => {
        if (event.target === detailModal) {
            cerrarModal();
        }
    });
}

function cerrarModal() {
    modalContainer.innerHTML = '';
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        cerrarModal();
    }
});

// Configurar el buscador con Debounce estricto de 4000ms
const ejecutarBusquedaConDebounce = debounce((valor) => {
    buscarPersonajes(valor);
}, 4000);

searchInput.addEventListener('input', (event) => {
    ejecutarBusquedaConDebounce(event.target.value);
});

// Carga inicial de todos los personajes consolidados al abrir la página
document.addEventListener('DOMContentLoaded', () => {
    buscarPersonajes('');
});
