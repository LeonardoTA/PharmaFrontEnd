import { SiPermiso } from '../../../../shared/directives/si-permiso';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente-service';
import { PaginaResponse } from '../../../../core/models/pagina-response';
import { mensajeError } from '../../../../core/utils/http-error';
import { coincide } from '../../../../core/utils/texto';
@Component({ selector: 'app-cliente-list', imports: [SiPermiso, RouterLink], templateUrl: './cliente-list.html' })
export class ClienteList implements OnInit {
  private readonly servicio = inject(ClienteService);
  protected readonly pagina = signal(0);
  protected readonly tamanio = signal(10);
  protected readonly ordenarPor = signal('apellidos');
  protected readonly direccion = signal<'asc' | 'desc'>('asc');
  protected readonly busqueda = signal('');
  protected readonly resultado = signal<PaginaResponse<Cliente> | null>(null);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly clientes = computed(() => (this.resultado()?.contenido ?? []).filter(c => coincide(this.busqueda(), c.dni, c.nombres, c.apellidos)));
  ngOnInit() { this.cargar(); }
  cargar() { this.cargando.set(true); this.error.set(null);
    this.servicio.listar(this.pagina(), this.tamanio(), this.ordenarPor(), this.direccion()).subscribe({
      next: r => { this.resultado.set(r); this.cargando.set(false); },
      error: (e: HttpErrorResponse) => { this.error.set(mensajeError(e)); this.cargando.set(false); },
    }); }
  irA(pagina: number) { this.pagina.set(pagina); this.cargar(); }
  cambiarTamanio(valor: string) { this.tamanio.set(Number(valor)); this.irA(0); }
  ordenar(campo: string) { if (campo === this.ordenarPor()) this.direccion.update(d => d === 'asc' ? 'desc' : 'asc'); else { this.ordenarPor.set(campo); this.direccion.set('asc'); } this.irA(0); }
  darDeBaja(c: Cliente) { if (!confirm(`¿Dar de baja a ${c.apellidos}, ${c.nombres}?`)) return;
    this.servicio.eliminar(c.id).subscribe({ next: () => this.cargar(), error: (e: HttpErrorResponse) => this.error.set(mensajeError(e)) }); }
}
