import { HttpErrorResponse } from '@angular/common/http';

export function erroresDeValidacion(error: HttpErrorResponse): Record<string, string> {
  return error.error?.validationErrors ?? {};
}

export function mensajeError(error: HttpErrorResponse): string {
  if (error.status === 0 || [502, 503, 504].includes(error.status)) {
    return 'No se pudo conectar con PharmaBackend. Compruebe que está ejecutándose en el puerto 8081.';
  }
  const validaciones = Object.values(erroresDeValidacion(error));
  const base = [error.error?.message ?? error.error?.mensaje ?? 'No se pudo completar la operación.', ...validaciones].join(' ');
  const requestId = error.error?.requestId || error.headers?.get('X-Request-Id');
  return requestId ? `${base} (Código de seguimiento: ${requestId})` : base;
}
