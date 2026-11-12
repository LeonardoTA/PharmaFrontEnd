import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

interface ProductoMasVendido {
  productoId: number;
  productoNombre: string;
  categoriaNombre: string;
  cantidadVendida: number;
  montoTotal: number;
}

@Component({
  selector: 'app-mas-vendidos',
  imports: [CurrencyPipe],
  templateUrl: './mas-vendidos.html',
})
export class MasVendidos {
  private readonly http = inject(HttpClient);
  private readonly url =
    `${environment.apiUrl}/reportes/productos-mas-vendidos`;
  protected readonly filas = toSignal(
    this.http.get<any[]>(this.url).pipe(
      map(data => (data || []).map(d => ({
        productoId: d.productoId ?? d.id,
        productoNombre: d.productoNombre ?? d.nombre,
        categoriaNombre: d.categoriaNombre ?? d.categoria,
        cantidadVendida: d.cantidadVendida ?? d.cantidad,
        montoTotal: d.montoTotal ?? d.total,
      }))),
      catchError(() => of([] as ProductoMasVendido[]))
    ),
    { initialValue: [] as ProductoMasVendido[] },
  );
}
