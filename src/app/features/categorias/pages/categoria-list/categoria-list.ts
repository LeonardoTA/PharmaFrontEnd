import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Categoria } from '../../models/categoria.model';
import { CategoriaService } from '../../services/categoria-service';
import { mensajeError } from '../../../../core/utils/http-error';
@Component({ selector: 'app-categoria-list', imports: [RouterLink], templateUrl: './categoria-list.html' })
export class CategoriaList implements OnInit {
  private readonly servicio = inject(CategoriaService);
  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  ngOnInit() { this.cargar(); }
  cargar() { this.cargando.set(true); this.error.set(null); this.servicio.listar().subscribe({
    next: r => { this.categorias.set(r); this.cargando.set(false); },
    error: (e: HttpErrorResponse) => { this.error.set(mensajeError(e)); this.cargando.set(false); },
  }); }
  eliminar(c: Categoria) { if (!confirm(`¿Eliminar la categoría "${c.nombre}"?`)) return;
    this.servicio.eliminar(c.id).subscribe({ next: () => this.cargar(), error: (e: HttpErrorResponse) => this.error.set(mensajeError(e)) }); }
}
