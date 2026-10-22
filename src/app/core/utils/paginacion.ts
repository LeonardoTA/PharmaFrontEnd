import { Observable, expand, map, reduce, EMPTY } from 'rxjs';
import { PaginaResponse } from '../models/pagina-response';

/** Compatibilidad con el backend local (listas) y el contrato paginado de las guías. */
export function adaptarPagina<T>(respuesta: T[] | PaginaResponse<T>, pagina: number,
  tamanio: number, ordenarPor?: keyof T, direccion: 'asc' | 'desc' = 'asc'): PaginaResponse<T> {
  if (!Array.isArray(respuesta)) return respuesta;
  const lista = [...respuesta];
  if (ordenarPor) lista.sort((a, b) => {
    const x = a[ordenarPor], y = b[ordenarPor];
    const comparacion = typeof x === 'number' && typeof y === 'number'
      ? x - y : String(x ?? '').localeCompare(String(y ?? ''), 'es', { numeric: true });
    return direccion === 'asc' ? comparacion : -comparacion;
  });
  const totalPaginas = Math.ceil(lista.length / tamanio);
  return { contenido: lista.slice(pagina * tamanio, (pagina + 1) * tamanio), pagina, tamanio,
    totalElementos: lista.length, totalPaginas, ultima: pagina >= totalPaginas - 1 };
}
/** Los buscadores de ventas necesitan todo el catálogo, incluyendo las páginas posteriores a la 100. */
export function cargarTodas<T>(listar: (pagina: number) => Observable<PaginaResponse<T>>): Observable<T[]> {
  return listar(0).pipe(
    expand(p => p.ultima ? EMPTY : listar(p.pagina + 1)),
    map(p => p.contenido),
    reduce((todos, contenido) => todos.concat(contenido), [] as T[]),
  );
}
