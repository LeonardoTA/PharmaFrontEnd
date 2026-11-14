import { Component, effect, inject, input, linkedSignal, numberAttribute } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Paginador } from '../../shared/components/paginador/paginador';
import { Pagina } from '../../core/models/pagina';
import { mensajeError } from '../../core/utils/http-error';
import { environment } from '../../../environments/environment';
interface Evento { id: number; fecha: string; usuario: string; accion: string; entidad: string; entidadId: number | null; detalle: string | null; requestId: string | null; }
@Component({ selector: 'app-auditoria', imports: [DatePipe, ReactiveFormsModule, Paginador], templateUrl: './auditoria.html' })
export class Auditoria {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);
  readonly usuario = input<string>(); readonly accion = input<string>();
  readonly desde = input<string>(); readonly hasta = input<string>();
  readonly pagina = input(0, { transform: (v: unknown) => numberAttribute(v, 0) });
  readonly tamanio = input(20, { transform: (v: unknown) => numberAttribute(v, 20) });
  protected readonly acciones = ['VENTA_REGISTRADA','PRECIO_MODIFICADO','PRODUCTO_ELIMINADO','LOGIN_EXITOSO','LOGIN_FALLIDO','CLIENTE_REGISTRADO','CATEGORIA_ELIMINADA'];
  protected readonly filtros = this.fb.group({ usuario: '', accion: '', desde: '', hasta: '' });
  protected errorFiltro = '';
  protected readonly eventos = rxResource({ params: () => ({ usuario: this.usuario(), accion: this.accion(), desde: this.desde(), hasta: this.hasta(), pagina: this.pagina(), tamanio: this.tamanio() }), stream: ({ params: c }) => {
    let params = new HttpParams().set('pagina', c.pagina).set('tamanio', c.tamanio);
    for (const key of ['usuario','accion','desde','hasta'] as const) if(c[key]) params = params.set(key, c[key]!);
    return this.http.get<Pagina<Evento>>(`${environment.apiUrl}/auditoria`, { params });
  } });
  protected readonly pag = linkedSignal<Pagina<Evento> | undefined, Pagina<Evento> | undefined>({ source: () => this.eventos.hasValue() ? this.eventos.value() : undefined, computation: (n, p) => n ?? p?.value });
  constructor() { effect(() => this.filtros.reset({ usuario: this.usuario() || '', accion: this.accion() || '', desde: this.desde() || '', hasta: this.hasta() || '' }, { emitEvent: false })); }
  protected error(): string { return this.errorFiltro || (this.eventos.error() ? mensajeError(this.eventos.error() as HttpErrorResponse) : ''); }
  protected buscar(): void { const f = this.filtros.getRawValue(); if(f.desde && f.hasta && f.desde > f.hasta) { this.errorFiltro='La fecha desde no puede ser posterior a la fecha hasta.'; return; } this.errorFiltro=''; this.navegar({ ...f, usuario: f.usuario.trim() || null, accion: f.accion || null, desde: f.desde || null, hasta: f.hasta || null, pagina: 0 }); }
  protected limpiar(): void { this.filtros.reset(); this.buscar(); }
  protected ir(pagina: number): void { this.navegar({ pagina }); }
  protected cambiarTamanio(tamanio: number): void { this.navegar({ tamanio, pagina: 0 }); }
  private navegar(queryParams: Record<string, string | number | null>): void { this.router.navigate([], { queryParams, queryParamsHandling: 'merge' }); }
}
