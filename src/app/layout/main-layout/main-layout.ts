import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/auth/auth-service';
import { MENU } from '../../core/config/menu';
import { AvisoSesion } from '../../shared/components/aviso-sesion/aviso-sesion';
@Component({
  selector: 'app-main-layout', imports: [RouterOutlet, RouterLink, RouterLinkActive, DatePipe, AvisoSesion],
  templateUrl: './main-layout.html', styleUrl: './main-layout.css',
})
export class MainLayout {
  protected readonly auth = inject(AuthService);
  protected readonly menu = computed(() => MENU.filter(item => !item.permiso || this.auth.tienePermiso(item.permiso)));
  salir(): void { this.auth.cerrarSesion(); }
  protected readonly mostrarMenu = signal(true);
  protected readonly swaggerUrl = 'http://localhost:8081/swagger-ui/index.html';
}
