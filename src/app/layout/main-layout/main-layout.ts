import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MENU } from '../../core/config/menu';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-main-layout', imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html', styleUrl: './main-layout.css',
})
export class MainLayout {
  protected readonly menu = MENU;
  protected readonly mostrarMenu = signal(true);
  protected readonly swaggerUrl = 'http://localhost:8081/swagger-ui/index.html';
}
