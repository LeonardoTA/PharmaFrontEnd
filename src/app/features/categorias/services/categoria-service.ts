import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaginaResponse } from '../../../core/models/pagina-response';
import { Categoria, CategoriaRequest } from '../models/categoria.model';
@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/categorias`;
  listar() { return this.http.get<Categoria[] | PaginaResponse<Categoria>>(this.url).pipe(map(r => Array.isArray(r) ? r : r.contenido)); }
  obtener(id: number) { return this.http.get<Categoria>(`${this.url}/${id}`); }
  crear(dto: CategoriaRequest) { return this.http.post<Categoria>(this.url, dto); }
  actualizar(id: number, dto: CategoriaRequest) { return this.http.put<Categoria>(`${this.url}/${id}`, dto); }
  eliminar(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}
