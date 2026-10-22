import { HttpErrorResponse } from '@angular/common/http';
export function erroresDeValidacion(error: HttpErrorResponse): Record<string, string> {
  return error.error?.validationErrors ?? {};
}
export function mensajeError(error: HttpErrorResponse): string {
  if (error.status === 0) return 'No se pudo conectar con PharmaBackend. Compruebe que está ejecutándose en el puerto 8081.';
  const validaciones = Object.values(erroresDeValidacion(error));
  return [error.error?.message ?? error.error?.mensaje ?? 'No se pudo completar la operación.', ...validaciones].join(' ');
}
