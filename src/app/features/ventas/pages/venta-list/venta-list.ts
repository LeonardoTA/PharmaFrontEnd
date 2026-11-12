import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Paginador } from '../../../../shared/components/paginador/paginador';
import { SiPermiso } from '../../../../shared/directives/si-permiso';
import { Component, computed, inject, input, linkedSignal, numberAttribute, effect, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PaginaResponse } from '../../../../core/models/pagina-response';
import { mensajeError } from '../../../../core/utils/http-error';
import { Cliente } from '../../../clientes/models/cliente.model';
import { ClienteService } from '../../../clientes/services/cliente-service';
import { EstadoVenta, FiltroVentas, Venta } from '../../models/venta.model';
import { VentaService } from '../../services/venta-service';

@Component({
  selector: 'app-venta-list',
  imports: [SiPermiso, ReactiveFormsModule, RouterLink, CurrencyPipe, DatePipe, Paginador],
  templateUrl: './venta-list.html',
  styleUrl: './venta-list.css',
})
export class VentaList {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly ventaService = inject(VentaService);
  private readonly clienteService = inject(ClienteService);

  protected readonly clientes = signal<Cliente[]>([]);
  private readonly router = inject(Router);
  readonly pagina = input(0, { transform: (v: unknown) => numberAttribute(v, 0) });
  readonly tamanio = input(20, { transform: (v: unknown) => numberAttribute(v, 20) });
  readonly clienteId = input<string>();
  readonly estado = input<EstadoVenta>();
  readonly desde = input<string>();
  readonly hasta = input<string>();
  readonly orden = input('fechaRegistro', { transform: (v: string | undefined) => v || 'fechaRegistro' });
  readonly dir = input('desc' as 'asc' | 'desc', { transform: (v: 'asc' | 'desc' | undefined) => v || 'desc' });
  protected readonly errorAccion = signal<string | null>(null);

  protected readonly filtros = this.fb.group({
    clienteId: this.fb.control<number | null>(null),
    estado: this.fb.control<EstadoVenta | null>(null),
    desde: this.fb.control<string | null>(null),
    hasta: this.fb.control<string | null>(null),
  });

  protected readonly filtrosAplicados = computed<FiltroVentas>(() => ({ clienteId: Number(this.clienteId()) || null, estado: this.estado() || null, desde: this.desde() || null, hasta: this.hasta() || null }));
  protected readonly ventas = rxResource({
    params: () => ({ filtro: this.filtrosAplicados(), pagina: this.pagina(), tamanio: this.tamanio(), orden: this.orden(), dir: this.dir() }),
    stream: ({ params: p }) => this.ventaService.buscar(p.filtro, p.pagina, p.tamanio, p.orden, p.dir),
  });
  protected readonly resultado = linkedSignal<PaginaResponse<Venta> | undefined, PaginaResponse<Venta> | undefined>({
    source: () => this.ventas.hasValue() ? this.ventas.value() : undefined,
    computation: (nueva, previa) => nueva ?? previa?.value,
  });
  protected error(): string | null {
    return this.errorAccion() ?? (this.ventas.error() ? mensajeError(this.ventas.error() as HttpErrorResponse) : null);
  }
  protected readonly ahora = signal(new Date());

  /** Suma de los totales de la página mostrada (solo ventas REGISTRADAS). */
  protected readonly totalPagina = computed(() =>
    (this.resultado()?.contenido ?? [])
      .filter(v => v.estado === 'REGISTRADA')
      .reduce((suma, v) => suma + v.total, 0));

  /** Texto con los filtros aplicados, para el encabezado impreso. */
  protected resumenFiltros(): string {
    const f = this.filtrosAplicados();
    const cliente = this.clientes().find(c => c.id === f.clienteId);
    const partes = [
      cliente ? `cliente ${cliente.apellidos}, ${cliente.nombres}` : '',
      f.estado ? `estado ${f.estado}` : '',
      f.desde ? `desde ${f.desde}` : '',
      f.hasta ? `hasta ${f.hasta}` : '',
    ].filter(Boolean);
    return partes.length ? partes.join(' · ') : 'ninguno (todas las ventas)';
  }

  imprimirConsulta(): void {
    this.ahora.set(new Date());
    setTimeout(() => window.print());
  }

  constructor() {
    this.clienteService.listarTodos().pipe(takeUntilDestroyed()).subscribe({
      next: clientes => this.clientes.set(clientes), error: err => this.errorAccion.set(mensajeError(err)),
    });
    effect(() => this.filtros.reset(this.filtrosAplicados(), { emitEvent: false }));
  }
  buscar(): void {
    const filtro = this.filtros.getRawValue();
    if (filtro.desde && filtro.hasta && filtro.desde > filtro.hasta) {
      this.errorAccion.set('La fecha desde no puede ser posterior a la fecha hasta.'); return;
    }
    this.errorAccion.set(null);
    this.navegar({ ...filtro, pagina: 0 });
  }
  limpiar(): void { this.filtros.reset(); this.buscar(); }
  irA(pagina: number): void { this.navegar({ pagina }); }
  cambiarTamanio(tamanio: number): void { this.navegar({ tamanio, pagina: 0 }); }
  ordenarPor(orden: string): void {
    this.navegar({ orden, dir: this.orden() === orden && this.dir() === 'asc' ? 'desc' : 'asc', pagina: 0 });
  }
  private navegar(cambios: Record<string, string | number | null>): void {
    this.router.navigate([], { queryParams: cambios, queryParamsHandling: 'merge' });
  }
}
