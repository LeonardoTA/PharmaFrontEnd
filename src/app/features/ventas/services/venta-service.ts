import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaginaResponse } from '../../../core/models/pagina-response';
import { FiltroVentas, Venta, VentaRequest } from '../models/venta.model';

@Injectable({ providedIn: 'root' })
export class VentaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/ventas`;

  registrar(dto: VentaRequest): Observable<Venta> {
    return this.http.post<VentaApi>(this.url, dto).pipe(map(normalizarVenta));
  }

  obtener(id: number): Observable<Venta> {
    return this.http.get<VentaApi>(`${this.url}/${id}`).pipe(map(normalizarVenta));
  }

  /** Solo se envían los filtros que tienen valor. */
  buscar(filtro: FiltroVentas, pagina: number, tamanio: number, ordenarPor = environment.fechaVenta, direccion: 'asc' | 'desc' = 'desc'):
Observable<PaginaResponse<Venta>> {
    let params = new HttpParams()
      .set('pagina', pagina)
      .set('tamanio', tamanio)
      .set('ordenarPor', ordenarPor)
      .set('direccion', direccion);
    if (filtro.clienteId) params = params.set('clienteId', filtro.clienteId);
    if (filtro.estado) params = params.set('estado', filtro.estado);
    if (filtro.desde) params = params.set('desde', filtro.desde);
    if (filtro.hasta) params = params.set('hasta', filtro.hasta);
    return this.http.get<PaginaResponse<VentaApi>>(`${this.url}/buscar`, { params }).pipe(
      map(r => ({ ...r, contenido: r.contenido.map(normalizarVenta) })));

  }
}

/** El DTO local usa fechaRegistro; la guía usa fecha. */
type VentaApi = Omit<Venta, 'fecha'> & { fecha?: string; fechaRegistro?: string };
function normalizarVenta(v: VentaApi): Venta { return { ...v, fecha: v.fecha ?? v.fechaRegistro ?? '' }; }
