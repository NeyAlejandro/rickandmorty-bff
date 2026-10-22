import { test, expect } from '@playwright/test';

test.describe('Rick and Morty Monorepo BFF (API Composition) - Pruebas E2E', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Navegar al BFF local en http://localhost:8080 y esperar la respuesta consolidada de /api/personaje/buscar
    const initialResponsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/personaje/buscar') && res.status() === 200
    );

    await page.goto('http://localhost:8080');
    await initialResponsePromise;
  });

  test('1. Carga inicial: debe renderizar el grid con las 20 tarjetas consolidadas (personaje + dimensión + 1er episodio)', async ({ page }) => {
    const grid = page.locator('#charactersGrid');
    await expect(grid).toBeVisible();

    const cards = grid.locator('article.character-card');
    await expect(cards).toHaveCount(20);

    // Verificar que la primera tarjeta muestra en un solo paso los datos anidados del backend
    const firstCard = cards.first();
    await expect(firstCard.locator('img')).toBeVisible();
    await expect(firstCard.locator('h2')).toContainText('Rick Sanchez');
    await expect(firstCard).toContainText('Human');
    await expect(firstCard).toContainText('Citadel of Ricks');
    await expect(firstCard).toContainText('Pilot');
  });

  test('2. Validación estricta del Debounce (4000ms): no debe disparar petición antes de 4s y debe actualizar las tarjetas tras 4s', async ({ page }) => {
    const searchInput = page.locator('#searchInput');
    const cards = page.locator('#charactersGrid article.character-card');

    // Estado inicial antes de escribir
    await expect(cards.first().locator('h2')).toContainText('Rick Sanchez');

    // Escuchar si se dispara alguna petición a /api/personaje/buscar?nombre=Morty
    let searchRequestFired = false;
    page.on('request', (request) => {
      if (request.url().includes('/api/personaje/buscar') && request.url().includes('nombre=Morty')) {
        searchRequestFired = true;
      }
    });

    const searchResponsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/personaje/buscar?nombre=Morty') && res.status() === 200,
      { timeout: 15000 }
    );

    // Simular escritura en el buscador
    await searchInput.fill('Morty');

    // Verificar que el estado visual del debounce está activo
    await expect(page.locator('#debounceStatus')).toBeVisible();

    // Esperar 2500ms (< 4000ms): la petición NO debe haberse disparado aún y el DOM no ha cambiado
    await page.waitForTimeout(2500);
    expect(searchRequestFired).toBe(false);
    await expect(cards.first().locator('h2')).toContainText('Rick Sanchez');

    // Esperar el tiempo restante para completar >= 4000ms y recibir la respuesta consolidada del backend
    await page.waitForTimeout(1600);
    await searchResponsePromise;

    // Validar que la petición se disparó tras los 4s y las tarjetas se actualizaron con "Morty"
    expect(searchRequestFired).toBe(true);
    await expect(cards.first().locator('h2')).toContainText('Morty');
  });

  test('3. Interacción del Modal (DOM con Template Literals): debe crear el modal al hacer clic en una tarjeta y mostrar los datos consolidados', async ({ page }) => {
    const firstCard = page.locator('#charactersGrid article.character-card').first();
    const modal = page.locator('#detailModal');

    // Inicialmente el modal no existe en el DOM
    await expect(modal).toHaveCount(0);

    // Hacer clic en la primera tarjeta (Rick Sanchez)
    await firstCard.click();

    // Validar que el modal se inyectó en #modalContainer y está visible
    await expect(modal).toBeVisible();
    await expect(page.locator('#modalName')).toHaveText('Rick Sanchez');
    await expect(page.locator('#modalSpecies')).toHaveText('Human');
    await expect(page.locator('#modalDimension')).not.toBeEmpty();
    await expect(page.locator('#modalEpisode')).toHaveText('Pilot');

    // Validar cierre del modal
    await page.locator('#closeModalBtn').click();
    await expect(modal).toHaveCount(0);
  });

});
