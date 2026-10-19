import { test, expect } from '@playwright/test';

test.describe('Rick and Morty BFF - Pruebas E2E', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Navegar al BFF local servido por Spring Boot y esperar la carga inicial de /api/personajes
    const initialResponsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/personajes') && res.status() === 200
    );

    await page.goto('http://localhost:8080');
    await initialResponsePromise;
  });

  test('1. Carga inicial: debe renderizar el grid con las tarjetas de personajes por defecto', async ({ page }) => {
    const grid = page.locator('#charactersGrid');
    await expect(grid).toBeVisible();

    const cards = grid.locator('article');
    // La página 1 de la API devuelve 20 personajes por defecto
    await expect(cards).toHaveCount(20);

    // Verificar que la primera tarjeta contiene imagen, nombre y especie
    const firstCard = cards.first();
    await expect(firstCard.locator('img')).toBeVisible();
    await expect(firstCard.locator('h2')).toContainText('Rick Sanchez');
    await expect(firstCard.locator('p').first()).toContainText('Human');
  });

  test('2. Validación estricta del Debounce (4000ms): no debe disparar petición antes de 4s y debe actualizar tras 4s', async ({ page }) => {
    const searchInput = page.locator('#searchInput');
    const cards = page.locator('#charactersGrid article');

    // Estado inicial antes de escribir
    await expect(cards.first().locator('h2')).toContainText('Rick Sanchez');

    // Escuchar si se dispara alguna petición a /api/personajes?name=Morty
    let searchRequestFired = false;
    page.on('request', (request) => {
      if (request.url().includes('/api/personajes') && request.url().includes('name=Morty')) {
        searchRequestFired = true;
      }
    });

    // Preparar la promesa que esperará la respuesta del backend tras el debounce
    const searchResponsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/personajes?name=Morty') && res.status() === 200,
      { timeout: 10000 }
    );

    // Simular escritura en el buscador
    await searchInput.fill('Morty');

    // Verificar indicador visual de debounce activo (opcional en nuestra UI)
    await expect(page.locator('#debounceStatus')).toBeVisible();

    // Esperar 2500ms (< 4000ms): la petición NO debe haberse disparado aún y la UI sigue igual
    await page.waitForTimeout(2500);
    expect(searchRequestFired).toBe(false);
    await expect(cards.first().locator('h2')).toContainText('Rick Sanchez');

    // Esperar el tiempo restante para completar los >= 4000ms y recibir la respuesta del BFF
    await page.waitForTimeout(1600);
    await searchResponsePromise;

    // Confirmar que la petición se ejecutó tras los 4 segundos y las tarjetas cambiaron
    expect(searchRequestFired).toBe(true);
    await expect(cards.first().locator('h2')).toContainText('Morty');
  });

  test('3. Interacción del Modal (Multi-Endpoints): debe abrir el modal y mostrar dimensión y primer episodio desde endpoints locales', async ({ page }) => {
    const firstCard = page.locator('#charactersGrid article').first();
    const modal = page.locator('#detailModal');

    // El modal debe estar oculto inicialmente
    await expect(modal).toBeHidden();

    // Interceptar las llamadas a los endpoints locales de ubicación y episodio del BFF
    const locationResponsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/ubicaciones/') && res.status() === 200
    );
    const episodeResponsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/episodios/') && res.status() === 200
    );

    // Hacer clic en la primera tarjeta (Rick Sanchez)
    await firstCard.click();

    // Validar que el modal se vuelve visible
    await expect(modal).toBeVisible();

    // Esperar a que ambos endpoints locales respondan
    await Promise.all([locationResponsePromise, episodeResponsePromise]);

    // Validar que el modal muestra los datos cargados desde /api/ubicaciones/{id} y /api/episodios/{id}
    const modalName = page.locator('#modalName');
    const modalDimension = page.locator('#modalDimension');
    const modalEpisode = page.locator('#modalEpisode');

    await expect(modalName).toHaveText('Rick Sanchez');
    await expect(modalDimension).not.toHaveText('Consultando BFF...');
    await expect(modalDimension).toContainText('Dimension C-137');
    await expect(modalEpisode).not.toHaveText('Consultando BFF...');
    await expect(modalEpisode).toContainText('Pilot');
  });

});

