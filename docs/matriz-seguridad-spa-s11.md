# Matriz de pruebas de la SPA segura - S11 Autónoma

**Estudiante:** James Christopher Tequen Oncoy  
**Curso:** Lenguaje de Programación 2  
**Docente:** Benjamin David Reyna Barreto  
**Ejecución:** 25/10/2026 - America/Lima

24 casos finales aprobados: los 16 base, cuatro propios de grupos distintos y B-01 a B-04. L-03, I-02 y M-03 fallaron inicialmente y fueron corregidos; sus fichas están en el informe. Las capturas mantienen la URL real y ocultan el JWT completo.

| ID | Grupo | Usuario | Pasos | Resultado esperado | Resultado obtenido | Estado | Evidencia |
|---|---|---|---|---|---|---|---|
| L-01 | Login | Sin sesión | Enviar vacío y después solo username. | Validación sin POST. | Ambos campos obligatorios; con username solo falta contraseña. No se envió POST. | Pasa | [L-01.png](evidencias-seguridad-spa-s11/L-01.png) |
| L-02 | Login | noexiste, admin, inactivo | Enviar tres credenciales rechazadas. | Mismo mensaje; borra clave y conserva username. | Tres HTTP 401 con idéntico mensaje genérico y campos según lo esperado. | Pasa | [L-02.png](evidencias-seguridad-spa-s11/L-02.png) |
| L-03 | Login | vendedor | Doble clic rápido en Ingresar con datos válidos. | Un POST; botón bloqueado mientras envía. | Se observó 1 POST y se inició sesión. | Pasa | [L-03.png](evidencias-seguridad-spa-s11/L-03.png)<br>[Hallazgo inicial](evidencias-seguridad-spa-s11/L-03_inicial.png)<br>[Registro del hallazgo](evidencias-seguridad-spa-s11/hallazgo-L03.json) |
| L-04 | Login | vendedor | Abrir login con returnUrl externo e ingresar. | Navega a /inicio. | Se mantiene localhost:4200 y abre /inicio. | Pasa | [L-04.png](evidencias-seguridad-spa-s11/L-04.png) |
| L-05 | Login | Sin sesión | Activar y desactivar Mostrar contraseña. | Alterna tipo sin cambiar el valor. | Tipos text/password y valor conservado, comprobados tras la actualización de la vista. | Pasa | [L-05.png](evidencias-seguridad-spa-s11/L-05.png) |
| S-01 | Sesión | vendedor | Login, F5, cerrar todo el navegador y abrirlo. | F5 conserva sesión; navegador nuevo exige login. | F5 conservó vendedor; el navegador nuevo muestra login. | Pasa | [S-01.png](evidencias-seguridad-spa-s11/S-01.png) |
| S-02 | Sesión | vendedor | Poner expiraEn en el pasado y F5. | Descarta la sesión guardada. | Login y clave de sesión eliminada. | Pasa | [S-02.png](evidencias-seguridad-spa-s11/S-02.png) |
| S-03 | Sesión | vendedor | Guardar texto no JSON en la sesión y F5. | Login sin romper la SPA. | Login correcto; no hubo excepción de JavaScript sin manejar. | Pasa | [S-03.png](evidencias-seguridad-spa-s11/S-03.png) |
| S-04 | Sesión | vendedor en dos pestañas | Autenticar dos pestañas; salir en una y navegar en la otra. | Registrar independencia por pestaña. | La segunda conserva su sesión y GET /auth/me responde 200; la primera queda en login. | Pasa | [S-04.png](evidencias-seguridad-spa-s11/S-04.png) |
| S-05 | Sesión | vendedor | Reducir el vencimiento local para activar el aviso; pulsar Cerrar sesión ahora y revisar el servicio. | Intervalo limpio y contador cero. | Cerrar sesión ahora elimina sesión; intervalo undefined y segundosRestantes=0 verificados después de 1,3 s. No se alargó el JWT. | Pasa | [S-05.png](evidencias-seguridad-spa-s11/S-05.png) |
| I-01 | Interceptor | vendedor | Revisar login, GET productos y recurso de 127.0.0.1 en otro puerto/origen. | Bearer solo a la API. | Productos lleva Bearer; login y servidor del recurso de otro origen no reciben Authorization. Imagen HTTP 200. | Pasa | [I-01.png](evidencias-seguridad-spa-s11/I-01.png) |
| I-02 | Interceptor | vendedor | Detener API y abrir Productos. | Error de conexión sin cerrar sesión. | Mensaje de conexión; continúa vendedor autenticado, sin redirección. | Pasa | [I-02.png](evidencias-seguridad-spa-s11/I-02.png)<br>[Hallazgo inicial](evidencias-seguridad-spa-s11/I-02_inicial.png)<br>[Registro del hallazgo](evidencias-seguridad-spa-s11/hallazgo-I02.json) |
| I-03 | Interceptor | vendedor | Alterar JWT guardado y abrir Ventas recargando. | 401, login con aviso y returnUrl=/ventas. | API 401; login con Su sesión expiró y retorno a Ventas. | Pasa | [I-03.png](evidencias-seguridad-spa-s11/I-03.png) |
| G-01 | Guards | Sin sesión | Abrir tres URL privadas sin sesión. | Login recuerda cada URL. | returnUrl correcto en /productos/1/editar, /ventas/nueva, /inicio | Pasa | [G-01.png](evidencias-seguridad-spa-s11/G-01.png) |
| G-02 | Guards | vendedor y almacen | Abrir las tres rutas de escritura sin permiso. | Acceso denegado sin código numérico visual. | Las tres rutas terminan en Acceso denegado; conservan sesión. | Pasa | [G-02.png](evidencias-seguridad-spa-s11/G-02.png) |
| G-03 | Guards | cuatro usuarios activos | Abrir Mi cuenta con cada rol, verificar nombre y cinco módulos, después sin sesión. | Todo autenticado accede sin permiso adicional; anónimo no. | GET /auth/me 200 en los cuatro roles; nombre completo y cinco módulos visibles. Sin sesión exige login con returnUrl=/mi-cuenta. | Pasa | [G-03.png](evidencias-seguridad-spa-s11/G-03.png) |
| M-01 | Menú y acciones | cuatro usuarios activos | Comparar menú y acciones de Productos con los cuatro roles. | Permisos exactos; supervisor une roles. | Admin/supervisor ven ventas y edición; vendedor ve ventas sin edición; almacén edita sin ventas. | Pasa | [M-01_admin.png](evidencias-seguridad-spa-s11/M-01_admin.png)<br>[M-01_vendedor.png](evidencias-seguridad-spa-s11/M-01_vendedor.png)<br>[M-01_almacen.png](evidencias-seguridad-spa-s11/M-01_almacen.png)<br>[M-01_supervisor.png](evidencias-seguridad-spa-s11/M-01_supervisor.png) |
| M-02 | Menú y acciones | admin → almacen | Cambiar de usuario mediante logout/login sin F5. | computed actualiza menú. | Desaparece Ventas y el encabezado muestra ALMACENERO sin recarga. | Pasa | [M-02.png](evidencias-seguridad-spa-s11/M-02.png) |
| M-03 | Menú y acciones | vendedor; admin cambia y restaura roles | Ver carga, perfil, cambio real de permisos y error sin backend. | Carga/error y comparación servidor/sesión. | Estados correctos, cinco módulos con ✔/✘ y aviso de permisos distintos. Roles originales restaurados. | Pasa | [M-03_carga.png](evidencias-seguridad-spa-s11/M-03_carga.png)<br>[M-03_permisos.png](evidencias-seguridad-spa-s11/M-03_permisos.png)<br>[M-03_error.png](evidencias-seguridad-spa-s11/M-03_error.png)<br>[Hallazgo del nombre](evidencias-seguridad-spa-s11/M-03_nombre_inicial.png)<br>[Registro del hallazgo](evidencias-seguridad-spa-s11/hallazgo-M03.json) |
| E-01 | 401 / 403 | vendedor | Forzar darDeBaja desde la consola del componente. | 403 del servidor; mensaje y sesión vigente. | DELETE responde 403; mensaje sin número visible y continúa vendedor. El producto no se modificó. | Pasa | [E-01.png](evidencias-seguridad-spa-s11/E-01.png) |
| B-01 | Aviso de expiración | vendedor | Emitir token real de tres minutos y esperar hasta que queden dos. | Aviso al quedar ≤120 s. | Aviso 02:00 tras 58 s; no apareció al iniciar. | Pasa | [B-01.png](evidencias-seguridad-spa-s11/B-01.png) |
| B-02 | Aviso de expiración | vendedor | Observar el contador varios segundos. | mm:ss disminuye cada segundo. | Avanzó de 02:00 a 01:51 sin cambiar expiraEn ni renovar JWT. | Pasa | [B-02.png](evidencias-seguridad-spa-s11/B-02.png) |
| B-03 | Aviso de expiración | vendedor | Pulsar × y recargar durante la misma sesión. | Oculta aviso hasta la siguiente sesión, sin cerrarla. | Aviso oculto también tras F5; Mi cuenta y la sesión siguen activos. | Pasa | [B-03.png](evidencias-seguridad-spa-s11/B-03.png) |
| B-04 | Aviso de expiración | vendedor | Esperar el vencimiento real del JWT de tres minutos. | Login al llegar a cero, sesión y temporizadores limpios. | Expiración real tras 179 s; elimina sesión y avisa con returnUrl=/mi-cuenta. | Pasa | [B-04.png](evidencias-seguridad-spa-s11/B-04.png) |

**Casos propios:** L-05 (Login), S-05 (Sesión), G-03 (Guards) y M-03 (Menú y acciones). B-01 a B-04 son adicionales.

## Precondiciones y repetición

- Oracle local y API en localhost:8081; iniciar Angular con `npm start` en localhost:4200. Las claves JWT se reciben desde el entorno y no se publican.
- Usar las cinco cuentas de clase. Los filtros de Productos muestran Vitaminas y Vitamina C 500 mg, datos naturales ya existentes. No se agregaron scripts de base de datos.
- I-02 detiene la API y la vuelve a iniciar con la misma clave. I-03 recarga con el token alterado para que AuthService lo lea del almacenamiento.
- E-01 invoca desde la consola la acción ya existente; el servidor deniega el DELETE, por lo que no cambia el producto.
- M-03 retrasa la petición real para observar Cargando, cambia temporalmente los roles con la API administrativa y restaura VENDEDOR; detiene la API para comprobar el estado de error y la vuelve a iniciar.
- B-01 a B-04 usan `JWT_EXPIRACION_MINUTOS=3` y esperas reales. Se restaura a 60 al terminar. S-05 reduce únicamente el vencimiento local para comprobar el botón y la limpieza del intervalo; no alarga el JWT ni sustituye las pruebas B.
- S-04 autentica cada pestaña por separado: cerrar una no invalida la otra. No se añadió sincronización entre pestañas porque la actividad pide observar y explicar el comportamiento.

## Cotejo de evaluación

| Criterio | Comprobación | Estado |
|---|---|---|
| 1 | 16 base + cuatro propios de grupos distintos + cuatro B | Cumple |
| 2 | Ocho columnas con pasos, esperado, obtenido y estado | Cumple |
| 3 | S-01 a S-04 e I-01 a I-03 con capturas de ventana | Cumple |
| 4 | G-02, M-01 y E-01 cubren roles y distinguen sesión/permisos | Cumple |
| 5 | Cada caso enlaza su captura por ID con JWT oculto | Cumple |
| 6 | B-01/B-02: aviso a ≤120 s y formato mm:ss | Cumple |
| 7 | B-03 oculta incluso tras F5; S-05 cierra y limpia el intervalo | Cumple |
| 8 | G-03/M-03: ruta privada, carga, error y datos de /auth/me por módulo | Cumple |
| 9 | M-03 registra un cambio real de permisos y el aviso de diferencia | Cumple |
| 10 | Fichas de L-03, I-02 y M-03: severidad, causa, corrección y repetición | Cumple |
| 11 | C3: cuatro respuestas con referencias al código y casos | Cumple |
| 12 | Rama, documentos y PR hacia develop; cambios propios del 25/10/2026 | Parcial: días distintos pendientes |

## Entrega

Informe y evidencias en un solo PDF: `docs/informes11.pdf`. Rama `feature/seguridad-spa-pruebas-Tequen`. PR: https://github.com/LeonardoTA/PharmaFrontEnd/pull/4. Los commits propios de esta actividad conservan su fecha real del 25/10/2026; el requisito de días distintos no se registra como cumplido.
