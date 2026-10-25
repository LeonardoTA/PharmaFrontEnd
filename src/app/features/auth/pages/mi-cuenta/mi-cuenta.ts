import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../core/auth/auth-service';
import { PerfilUsuario, Permiso } from '../../../../core/auth/auth.model';
import { mensajeError } from '../../../../core/utils/http-error';
@Component({
  selector: 'app-mi-cuenta',
  template: `<section class="page">
    <header class="page-header"><h2>Mi cuenta</h2><button type="button" class="btn" [disabled]="cargando()" (click)="cargar()">Actualizar datos</button></header>
    @if (cargando()) { <p role="status">Cargando su cuenta…</p> }
    @if (error()) { <div class="alerta" role="alert">{{ error() }}</div> }
    @if (perfil(); as p) {
      @if (permisosCambiaron()) { <div class="aviso-cambio" role="status">Sus permisos cambiaron. Cierre sesión y vuelva a ingresar para actualizarlos.</div> }
      <article class="card"><h3>{{ p.nombreCompleto }}</h3><p>Usuario: <strong>{{ p.username }}</strong></p>
        <p>Roles: @for (rol of p.roles; track rol) { <span class="badge">{{ rol }}</span> }</p>
        <h3>Permisos actuales del servidor</h3>
        <div class="modulos">@for (grupo of grupos; track grupo.nombre) {
          <section><h4>{{ grupo.nombre }}</h4><ul>@for (permiso of grupo.permisos; track permiso) {
            <li><span [class.permitido]="p.permisos.includes(permiso)" [attr.aria-label]="p.permisos.includes(permiso) ? 'Permitido' : 'No permitido'">{{ p.permisos.includes(permiso) ? '✔' : '✘' }}</span> {{ permiso }}</li>
          }</ul></section>
        }</div>
      </article>
    }
  </section>`,
  styles: `.modulos { display: grid; grid-template-columns: repeat(auto-fit,minmax(240px,1fr)); gap: 12px 24px; } h3 { margin-top: 0; } h4 { margin: 12px 0; color: #12315a; } ul { list-style: none; padding: 0; } li { font-size: 13px; margin: 9px 0; overflow-wrap: anywhere; } li span { color: #b42318; } li span.permitido { color: #166534; } .badge { margin-right: 5px; } .aviso-cambio { padding: 12px 16px; margin-bottom: 16px; border-radius: 8px; background: #fff6dc; color: #7a5200; }`,
})
export class MiCuenta implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly perfil = signal<PerfilUsuario | null>(null);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly grupos: { nombre: string; permisos: Permiso[] }[] = [
    { nombre: 'Catálogo', permisos: ['CATALOGO_LEER', 'CATALOGO_ESCRIBIR'] },
    { nombre: 'Clientes', permisos: ['CLIENTES_LEER', 'CLIENTES_ESCRIBIR'] },
    { nombre: 'Ventas', permisos: ['VENTAS_LEER', 'VENTAS_REGISTRAR'] },
    { nombre: 'Reportes', permisos: ['REPORTES_VER'] },
    { nombre: 'Usuarios', permisos: ['USUARIOS_ADMINISTRAR'] },
  ];
  protected readonly permisosCambiaron = computed(() => {
    const perfil = this.perfil();
    if (!perfil) return false;
    const local = new Set(this.auth.sesion()?.permisos ?? []);
    const servidor = new Set(perfil.permisos);
    return local.size !== servidor.size || [...local].some(p => !servidor.has(p));
  });
  ngOnInit(): void { this.cargar(); }
  protected cargar(): void {
    this.cargando.set(true); this.error.set(null); this.perfil.set(null);
    this.auth.obtenerPerfil().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: perfil => { this.perfil.set(perfil); this.cargando.set(false); },
      error: (e: HttpErrorResponse) => { this.error.set(mensajeError(e)); this.cargando.set(false); },
    });
  }
}
