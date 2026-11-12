import { vigilarErrores } from './apoyo';
import { expect, test } from '@playwright/test';
import { iniciarSesion } from './apoyo';
test('flujo principal: el vendedor registra una venta y el stock baja', async ({
  page,
}) => {
  await iniciarSesion(page, 'vendedor', '/ventas/nueva');
  // Cliente
  await page.getByTestId('buscar-cliente').fill('Mamani');
  await page.getByTestId('opcion-cliente').first().click();
  // Producto: se lee el stock antes de vender
  const nombreProducto = process.env['E2E_PRODUCTO'] || 'Paracetamol 500 mg';
  await page.getByTestId('buscar-producto').fill(nombreProducto);
  const opcion = page.getByTestId('opcion-producto').filter({ has: page.getByText(nombreProducto, { exact: true }) });
  const stockAntes = Number(await opcion.getAttribute('data-stock'));
  await opcion.click();
  await page.getByTestId('cantidad').last().fill('2');
  await expect(page.getByTestId('total-venta')).not.toHaveText('S/ 0.00');
  await page.getByRole('button', { name: 'Revisar venta', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Imprimir el comprobante al registrar' }).uncheck();
  const registro = page.waitForResponse(
    (r) =>
      r.url().endsWith('/api/v1/ventas') && r.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'Confirmar venta', exact: true }).click();
  expect((await registro).status()).toBe(201);
  await expect(page.getByText('Venta registrada correctamente.', { exact: true })).toBeVisible();
  // Integración con Productos: el stock refleja la venta (caché invalidada)
  await page.getByRole('link', { name: /Productos/ }).click();
  const fila = page
    .getByTestId('tabla-productos')
    .locator('tbody tr').filter({ has: page.getByRole('cell', { name: nombreProducto, exact: true }) });
  await expect(fila.locator('td').nth(3)).toHaveText(String(stockAntes - 2));
});


test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === testInfo.expectedStatus && testInfo.repeatEachIndex === 0) {
    await page.screenshot({ path: `docs/evidencias-s14/${testInfo.title.replace(/[^a-zA-Z0-9]+/g, '-').slice(0,90)}.png`, fullPage: true });
  }
});

let erroresPagina: string[] = [];
test.beforeEach(async ({ page }) => { erroresPagina = vigilarErrores(page); });
test.afterEach(() => { expect(erroresPagina).toEqual([]); });
