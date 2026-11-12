import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, linkedSignal, numberAttribute, signal } from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { SiPermiso } from '../../../../shared/directives/si-permiso';
import { Pagina } from '../../../../core/models/pagina';
import { Paginador } from '../../../../shared/components/paginador/paginador';
import { mensajeError } from '../../../../core/utils/http-error';
import { CategoriaService } from '../../../categorias/services/categoria-service';
import { Categoria } from '../../../categorias/models/categoria.model';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto-service';
@Component({
  selector: 'app-producto-list', imports: [SiPermiso, RouterLink, CurrencyPipe, Paginador],
  templateUrl: './producto-list.html', styleUrl: './producto-list.css',
})
export class ProductoList {
  private readonly productoService = inject(ProductoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly router = inject(Router);
  readonly pagina = input(0, { transform: (v: unknown) => numberAttribute(v, 0) });
  readonly tamanio = input(20, { transform: (v: unknown) => numberAttribute(v, 20) });
  readonly orden = input('nombre', { transform: (v: string | undefined) => v || 'nombre' });
  readonly dir = input('asc' as 'asc' | 'desc', { transform: (v: 'asc' | 'desc' | undefined) => v || 'asc' });
  readonly categoriaId = input<string>();
  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly errorAccion = signal<string | null>(null);
  protected readonly productos = rxResource({
    params: () => ({ pagina: this.pagina(), tamanio: this.tamanio(), ordenarPor: this.orden(), direccion: this.dir(), categoriaId: Number(this.categoriaId()) || undefined }),
    stream: ({ params }) => this.productoService.listar(params, params.categoriaId),
  });
  protected readonly pag = linkedSignal<Pagina<Producto> | undefined, Pagina<Producto> | undefined>({
    source: () => this.productos.hasValue() ? this.productos.value() : undefined,
    computation: (nueva, previa) => nueva ?? previa?.value,
  });
  constructor() {
    this.categoriaService.listar().pipe(takeUntilDestroyed()).subscribe({
      next: datos => this.categorias.set(datos), error: err => this.errorAccion.set(mensajeError(err)),
    });
  }
  protected error(): string | null {
    return this.errorAccion() ?? (this.productos.error() ? mensajeError(this.productos.error() as HttpErrorResponse) : null);
  }
  protected irAPagina(pagina: number): void { this.navegar({ pagina }); }
  protected cambiarTamanio(tamanio: number): void { this.navegar({ tamanio, pagina: 0 }); }
  protected ordenarPor(campo: string): void {
    const dir = this.orden() === campo && this.dir() === 'asc' ? 'desc' : 'asc';
    this.navegar({ orden: campo, dir, pagina: 0 });
  }
  protected filtrarPorCategoria(valor: string): void { this.navegar({ categoriaId: valor || null, pagina: 0 }); }
  private navegar(cambios: Record<string, string | number | null>): void {
    this.router.navigate([], { queryParams: cambios, queryParamsHandling: 'merge' });
  }
  protected darDeBaja(producto: Producto): void {
    if (!confirm(`¿Dar de baja el producto "${producto.nombre}"?`)) return;
    this.productoService.darDeBaja(producto.id).subscribe({
      next: () => this.productos.reload(), error: err => this.errorAccion.set(mensajeError(err)),
    });
  }
}
