import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { cargarTodas } from '../../../core/utils/paginacion';
import { environment } from '../../../../environments/environment';
import { ConsultaPagina, Pagina } from '../../../core/models/pagina';
import { Producto, ProductoRequest } from
'../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/productos`;

  listar(c: ConsultaPagina, categoriaId?: number): Observable<Pagina<Producto>> {
    let params = new HttpParams()
      .set('pagina', c.pagina).set('tamanio', c.tamanio)
      .set('ordenarPor', c.ordenarPor).set('direccion', c.direccion);
    if (categoriaId) params = params.set('categoriaId', categoriaId);
    return this.http.get<Pagina<Producto>>(this.url, { params });
  }
  listarTodos(): Observable<Producto[]> {
    return cargarTodas(pagina => this.listar({ pagina, tamanio: 100, ordenarPor: 'nombre', direccion: 'asc' }));
  }

  obtener(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/${id}`);
  }

  crear(dto: ProductoRequest): Observable<Producto> {
    return this.http.post<Producto>(this.url, dto);
  }

  actualizar(id: number, dto: ProductoRequest): Observable<Producto> {
    return this.http.put<Producto>(`${this.url}/${id}`, dto);
  }

  /** Baja lógica: el backend marca estado = false. */
  darDeBaja(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
