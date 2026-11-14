import { expect, test } from '@playwright/test';
import { iniciarSesion, vigilarErrores } from './apoyo';
let errores: string[] = [];
test.beforeEach(async ({ page }) => { errores = vigilarErrores(page); });
test.afterEach(() => expect(errores).toEqual([]));

test('E2E-09: venta sin productos no llega a confirmación ni envía POST', async ({ page }) => {
  await iniciarSesion(page, 'vendedor', '/ventas/nueva');
  await page.getByTestId('buscar-cliente').fill('Mamani');
  await page.getByTestId('opcion-cliente').first().click();
  let envios = 0;
  page.on('request', r => { if(r.method()==='POST' && r.url().endsWith('/ventas')) envios++; });
  await page.getByRole('button', { name: 'Revisar venta', exact: true }).click();
  await expect(page.getByText('Agregue al menos un producto y una cantidad entera mayor que cero en cada línea.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirmar venta', exact: true })).toHaveCount(0);
  expect(envios).toBe(0);
});

test('E2E-10: cliente nuevo aparece inmediatamente y permite registrar venta', async ({ page }) => {
  await iniciarSesion(page, 'admin', '/clientes/nuevo');
  const dni=String(60000000 + Math.floor(Math.random()*9999999));
  await page.getByLabel('DNI', { exact: true }).fill(dni);
  await page.getByLabel('Nombres', { exact: true }).fill('Elena');
  await page.getByLabel('Apellidos', { exact: true }).fill('Torres Salas');
  await page.getByLabel('Correo', { exact: true }).fill(`elena.torres${dni}@example.test`);
  await page.getByLabel('Teléfono (opcional)', { exact: true }).fill('951234567');
  await page.getByRole('button', { name: 'Guardar', exact: true }).click();
  await expect(page).toHaveURL(/\/clientes$/);
  await page.goto('/ventas/nueva');
  await page.getByTestId('buscar-cliente').fill(dni);
  await page.getByTestId('opcion-cliente').filter({ hasText:'Elena' }).click();
  await page.getByTestId('buscar-producto').fill('Paracetamol 500 mg');
  await page.getByTestId('opcion-producto').filter({ has: page.getByText('Paracetamol 500 mg', { exact:true }) }).click();
  await page.getByRole('button', { name:'Revisar venta', exact:true }).click();
  await page.getByRole('checkbox', { name:'Imprimir el comprobante al registrar' }).uncheck();
  const registro=page.waitForResponse(r=>r.url().endsWith('/ventas')&&r.request().method()==='POST');
  await page.getByRole('button', { name:'Confirmar venta', exact:true }).click();
  expect((await registro).status()).toBe(201);
  await expect(page.getByText('Venta registrada correctamente.',{exact:true})).toBeVisible();
});

test('E2E-11: cambiar filtro en página tres de Ventas vuelve al inicio y F5 conserva', async ({page})=>{
  await iniciarSesion(page,'admin','/ventas?pagina=2&tamanio=20');
  await expect(page.getByTestId('pagina-actual')).toContainText('Página 3 de');
  await page.getByLabel('Desde',{exact:true}).fill('2026-11-01');
  await page.getByLabel('Hasta',{exact:true}).fill('2026-11-30');
  await page.getByRole('button',{name:'Buscar',exact:true}).click();
  await expect(page).toHaveURL(/pagina=0/);
  await expect(page.getByTestId('pagina-actual')).toContainText('Página 1 de');
  await page.reload();
  await expect(page.getByLabel('Desde',{exact:true})).toHaveValue('2026-11-01');
});

test('E2E-12: admin consulta ventas auditadas y conserva filtros y página en URL',async({page})=>{
  await iniciarSesion(page,'admin','/auditoria');
  await expect(page.getByRole('link',{name:/Auditoría/})).toBeVisible();
  await page.getByLabel('Usuario',{exact:true}).fill('vendedor');
  await page.getByLabel('Acción',{exact:true}).selectOption('VENTA_REGISTRADA');
  await page.getByLabel('Desde',{exact:true}).fill('2026-11-01');
  await page.getByLabel('Hasta',{exact:true}).fill('2026-11-30');
  await page.getByRole('button',{name:'Buscar',exact:true}).click();
  await expect(page).toHaveURL(/accion=VENTA_REGISTRADA/);
  await expect(page.getByTestId('tabla-auditoria').locator('tbody tr').first()).toContainText('VENTA_REGISTRADA');
  await page.reload();
  await expect(page.getByLabel('Usuario',{exact:true})).toHaveValue('vendedor');
  await expect(page.getByLabel('Acción',{exact:true})).toHaveValue('VENTA_REGISTRADA');
  const filas=page.getByTestId('tabla-auditoria').locator('tbody tr');
  for(const fila of await filas.all()) await expect(fila).toContainText('vendedor');
});

test('E2E-13: vendedor no ve Auditoría y la ruta directa muestra acceso denegado',async({page})=>{
  await iniciarSesion(page,'vendedor');
  await expect(page.getByRole('link',{name:/Auditoría/})).toHaveCount(0);
  await page.goto('/auditoria');
  await expect(page.getByRole('heading',{name:/Acceso denegado/})).toBeVisible();
});
