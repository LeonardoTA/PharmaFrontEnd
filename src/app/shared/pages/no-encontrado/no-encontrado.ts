import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-no-encontrado', imports: [RouterLink], template: `<section class="page card"><h2>Página no encontrada</h2><a class="btn" routerLink="/inicio">Volver al inicio</a></section>` })
export class NoEncontrado {}
