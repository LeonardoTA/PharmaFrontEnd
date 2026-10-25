import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth-service';
@Component({
  selector: 'app-aviso-sesion',
  template: `@if (auth.porVencer() && !auth.avisoOculto()) {
    <section class="aviso-sesion" role="status" aria-live="polite">
      <span>⚠ Su sesión vence en <strong>{{ cuenta() }}</strong>.</span>
      <button type="button" class="btn" (click)="auth.cerrarSesion()">Cerrar sesión ahora</button>
      <button type="button" class="cerrar" aria-label="Ocultar aviso de sesión" (click)="auth.avisoOculto.set(true)">×</button>
    </section>
  }`,
  styles: `.aviso-sesion { position: sticky; top: 0; z-index: 20; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; padding: 12px 16px; margin-bottom: 18px; border: 1px solid #e9ab27; border-radius: 8px; background: #fff6dc; color: #7a5200; box-shadow: 0 2px 5px #12315a18; }
    .cerrar { margin-left: auto; border: 0; background: transparent; color: inherit; font-size: 24px; cursor: pointer; }`,
})
export class AvisoSesion {
  protected readonly auth = inject(AuthService);
  protected readonly cuenta = computed(() => {
    const s = this.auth.segundosRestantes();
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  });
}
