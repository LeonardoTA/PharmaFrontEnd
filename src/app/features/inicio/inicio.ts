import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth-service';
import { MENU } from '../../core/config/menu';
import { MasVendidos } from './mas-vendidos';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, MasVendidos],
  templateUrl: './inicio.html',
})
export class Inicio {
  protected readonly auth = inject(AuthService);
  protected readonly menu = computed(() =>
    MENU.filter(i => i.ruta !== '/inicio' && (!i.permiso || this.auth.tienePermiso(i.permiso)))
  );
}
