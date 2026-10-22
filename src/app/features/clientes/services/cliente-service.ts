import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { adaptarPagina, cargarTodas } from '../../../core/utils/paginacion';
import { environment } from '../../../../environments/environment';
import { PaginaResponse } from '../../../core/models/pagina-response';
import { Cliente, ClienteRequest } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/clientes`;

  listar(pagina = 0, tamanio = 20, ordenarPor = 'apellidos',
         direccion: 'asc' | 'desc' = 'asc'): Observable<PaginaResponse<Cliente>> {
    const params = new HttpParams()
      .set('pagina', pagina)
      .set('tamanio', tamanio)
      .set('ordenarPor', ordenarPor)
      .set('direccion', direccion);
    return this.http.get<Cliente[] | PaginaResponse<Cliente>>(this.url, { params }).pipe(
      map(r => adaptarPagina(r, pagina, tamanio, ordenarPor as keyof Cliente, direccion)));
  }

  listarTodos(): Observable<Cliente[]> {
    return cargarTodas(pagina => this.listar(pagina, 100, "apellidos", 'asc'));
  }

  crear(dto: ClienteRequest): Observable<Cliente> { return this.http.post<Cliente>(this.url, dto); }
  actualizar(id: number, dto: ClienteRequest): Observable<Cliente> { return this.http.put<Cliente>(`${this.url}/${id}`, dto); }
  eliminar(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  obtener(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.url}/${id}`);
  }
}
