# Actividad autónoma S14 - PharmaSoft

Estudiante: James Christopher Tequen Oncoy. Curso: Lenguaje de Programación 2. Docente: Benjamin David Reyna Barreto.

- [Informe único y evidencias](Tequen_LP2_S14_Autonoma.pdf).
- [Índice completo del backend](https://github.com/LeonardoTA/PharmaBackend/blob/v1.0-demo/docs/README.md).
- [Video de respaldo](https://github.com/LeonardoTA/PharmaBackend/blob/v1.0-demo/docs/evidencias/s14-estabilizacion/demostracion-respaldo.webm).
- [Resultados y colección Postman](https://github.com/LeonardoTA/PharmaBackend/blob/v1.0-demo/docs/resultados-pruebas.md).

Se añade /auditoria con permisoGuard y USUARIOS_ADMINISTRAR, menú por permisos, tabla, filtros en URL y el paginador compartido. Cinco casos nuevos en e2e/autonoma.spec.ts complementan los siete de la práctica. Código probado: 0783621; 36/36 ejecuciones en tres repeticiones, sin retries ni waitForTimeout. La compilación Angular de producción pasó (379,81 kB iniciales). La etiqueta v1.0-demo identifica el commit final con documentación.

Arranque: backend dev con API en 8081, Oracle en 1522 y Redis en 6379; npm ci, npx playwright install chromium y npm start. Suite: npx playwright test --repeat-each=3. Datos de esta base de desarrollo en el índice del backend; las ventas consumen stock y requieren preparación antes de repetirlas.

Pendiente personal: realizar y registrar dos ensayos orales y tres recorridos manuales; revisar la defensa con palabras propias. Los recorridos automatizados y el video técnico sin narración no se atribuyen como ensayos personales realizados.

Se preserva la entrega de la práctica anterior en docs/entrega-s14.md y su PDF.
