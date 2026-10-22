import { Component, inject, input, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoriaService } from '../../services/categoria-service';
import { mensajeError } from '../../../../core/utils/http-error';
@Component({ selector: 'app-categoria-form', imports: [ReactiveFormsModule, RouterLink], templateUrl: './categoria-form.html' })
export class CategoriaForm implements OnInit {
  readonly id = input<string>();
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly servicio = inject(CategoriaService);
  private readonly router = inject(Router);
  protected readonly error = signal<string | null>(null);
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly form = this.fb.group({ nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]], descripcion: ['', Validators.maxLength(200)], estado: [true] });
  ngOnInit() { if (!this.id()) return; this.cargando.set(true); this.servicio.obtener(Number(this.id())).subscribe({
    next: c => { this.form.setValue({ nombre: c.nombre, descripcion: c.descripcion ?? '', estado: c.estado }); this.cargando.set(false); },
    error: (e: HttpErrorResponse) => { this.error.set(mensajeError(e)); this.cargando.set(false); },
  }); }
  guardar() { if (this.guardando() || this.cargando()) return; if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue(); const dto = { ...v, nombre: v.nombre.trim(), descripcion: v.descripcion.trim() || null };
    this.guardando.set(true); this.error.set(null);
    (this.id() ? this.servicio.actualizar(Number(this.id()), dto) : this.servicio.crear(dto)).subscribe({
      next: () => this.router.navigate(['/categorias']), error: (e: HttpErrorResponse) => { this.error.set(mensajeError(e)); this.guardando.set(false); },
    }); }
}
