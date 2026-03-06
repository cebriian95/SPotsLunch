import { Component, inject } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  
  auth=inject(Auth);
  router=inject(Router);

  password: string = '';
  errorMessage: string = '';

  onLogin() {
    if (this.auth.checkPassword(this.password)) {
      this.router.navigate(['/board']);
    } else {
      this.errorMessage = 'Contraseña incorrecta. Inténtalo de nuevo.';
    }
  }


}
