import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth-service';
import { MENU } from '../../core/config/menu';
@Component({ selector: 'app-inicio', imports: [RouterLink], template: `
  <section class="page"><h2>PharmaSoft</h2><div class="card"><h3>Gestión de la botica</h3>
    <p>Administre el catálogo y los clientes, registre ventas y consulte sus comprobantes.</p>
    <div class="filtros">@for (item of menu(); track item.ruta) { <a class="btn" [routerLink]="item.ruta">{{ item.icono }} {{ item.etiqueta }}</a> }</div>
  </div></section>` })
export class Inicio { private readonly auth = inject(AuthService); protected readonly menu = computed(() => MENU.filter(i => i.ruta !== '/inicio' && (!i.permiso || this.auth.tienePermiso(i.permiso)))); }
