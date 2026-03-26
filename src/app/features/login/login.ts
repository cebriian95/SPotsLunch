import { Component, inject } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme';
import { LucideAngularModule, Sun, Moon } from 'lucide-angular';

@Component({
  selector: 'app-login',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  
  auth=inject(Auth);
  router=inject(Router);
  themeService=inject(ThemeService);

  password: string = '';
  errorMessage: string = '';

  readonly Sun = Sun;
  readonly Moon = Moon;

  onLogin() {
    if (this.auth.checkPassword(this.password)) {
      this.router.navigate(['/board']);
    } else {
      this.errorMessage = 'Contraseña incorrecta. Inténtalo de nuevo.';
    }
  }


}
