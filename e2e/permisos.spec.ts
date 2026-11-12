import { vigilarErrores } from './apoyo';
import { expect, test } from '@playwright/test';
import { iniciarSesion } from './apoyo';
test('el almacenero no ve Ventas y la URL directa es denegada', async ({
  page,
}) => {
  await iniciarSesion(page, 'almacen');
  await expect(page.getByRole('link', { name: 'Ventas' })).toHaveCount(0);
  await page.goto('/ventas');
  await expect(
    page.getByRole('heading', { name: /Acceso denegado/ }),
  ).toBeVisible();
});
test('el vendedor ve Productos sin botones de edición', async ({ page }) => {
  await iniciarSesion(page, 'vendedor', '/productos');
  await expect(page.getByTestId('tabla-productos')).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Nuevo producto/ }),
  ).toHaveCount(0);
});


test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === testInfo.expectedStatus && testInfo.repeatEachIndex === 0) {
    await page.screenshot({ path: `docs/evidencias-s14/${testInfo.title.replace(/[^a-zA-Z0-9]+/g, '-').slice(0,90)}.png`, fullPage: true });
  }
});

let erroresPagina: string[] = [];
test.beforeEach(async ({ page }) => { erroresPagina = vigilarErrores(page); });
test.afterEach(() => { expect(erroresPagina).toEqual([]); });
