import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '../models/error-response';

export function mensajeError(err: HttpErrorResponse): string {
  // Problemas de conexión o backend inactivo
  if (err.status === 0) {
    return 'No fue posible conectarse con el servidor. Por favor, verifica tu conexión o que el servicio esté activo.';
  }

  const cuerpo = (typeof err.error === 'object' ? err.error : null) as ErrorResponse | null;

  // Si el backend envió un mensaje claro y comprensible, lo usamos directamente
  if (cuerpo?.message && cuerpo.message.trim().length > 0) {
    return cuerpo.message;
  }

  // Mensajes amigables y descriptivos para el usuario sin códigos numéricos técnicos
  switch (err.status) {
    case 400:
      return 'Los datos ingresados no son válidos. Por favor, revisa los campos del formulario.';
    case 401:
    case 403:
      return 'No cuentas con los permisos necesarios para realizar esta acción.';
    case 404:
      return 'El registro solicitado no existe o fue retirado recientemente.';
    case 409:
      return 'No se pudo completar la operación debido a un conflicto (es posible que ya exista un registro idéntico o que tenga productos asociados).';
    case 500:
    case 502:
    case 503:
      return 'Ocurrió un inconveniente en el servidor al procesar la solicitud. Por favor, intenta de nuevo en unos momentos.';
    default:
      return 'Ocurrió un problema inesperado al realizar la acción. Inténtalo nuevamente.';
  }
}

export function erroresDeValidacion(err: HttpErrorResponse): Record<string, string> {
  const cuerpo = (typeof err.error === 'object' ? err.error : null) as ErrorResponse | null;
  return cuerpo?.validationErrors ?? {};
}
