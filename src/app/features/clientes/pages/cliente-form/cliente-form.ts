import { Component, inject, input, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ClienteService } from '../../services/cliente-service';
import { ClienteRequest } from '../../models/cliente.model';
import { mensajeError, erroresDeValidacion } from '../../../../core/utils/http-error';
@Component({ selector: 'app-cliente-form', imports: [ReactiveFormsModule, RouterLink], templateUrl: './cliente-form.html' })
export class ClienteForm implements OnInit {
  readonly id = input<string>();
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly servicio = inject(ClienteService);
  private readonly router = inject(Router);
  protected readonly error = signal<string | null>(null);
  protected readonly erroresServidor = signal<Record<string, string>>({});
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly form = this.fb.group({
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    telefono: ['', [Validators.pattern(/^\d{9}$/)]],
    direccion: ['', [Validators.maxLength(250)]], estado: [true],
  });
  ngOnInit() { if (!this.id()) return; this.cargando.set(true); this.servicio.obtener(Number(this.id())).subscribe({
    next: c => { this.form.setValue({ dni: c.dni, nombres: c.nombres, apellidos: c.apellidos, email: c.email, telefono: c.telefono ?? '', direccion: c.direccion ?? '', estado: c.estado }); this.cargando.set(false); },
    error: (e: HttpErrorResponse) => { this.error.set(mensajeError(e)); this.cargando.set(false); },
  }); }
  guardar() { if (this.guardando() || this.cargando()) return; if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue(); const dto: ClienteRequest = { ...v, dni: v.dni.trim(), nombres: v.nombres.trim(), apellidos: v.apellidos.trim(), email: v.email.trim(), telefono: v.telefono.trim() || null, direccion: v.direccion.trim() || null };
    this.guardando.set(true); this.error.set(null); this.erroresServidor.set({});
    (this.id() ? this.servicio.actualizar(Number(this.id()), dto) : this.servicio.crear(dto)).subscribe({
      next: () => this.router.navigate(['/clientes']), error: (e: HttpErrorResponse) => { this.error.set(mensajeError(e)); this.erroresServidor.set(erroresDeValidacion(e)); this.guardando.set(false); },
    }); }
}
