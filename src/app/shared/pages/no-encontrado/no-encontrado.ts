import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-no-encontrado',
  imports: [RouterLink],
  template: `
    <section class="card">
      <h2>Página no encontrada</h2>
      <p style="color: #64748b; margin: 12px 0 20px;">
        La dirección a la que intentas acceder no existe o fue movida.
      </p>
      <a routerLink="/inicio" class="btn btn-primary">Volver al inicio</a>
    </section>
  `,
})
export class NoEncontrado {}
