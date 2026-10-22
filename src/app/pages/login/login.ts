import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  errorMessage = signal('');
  isLoading = signal(false);

  login(): void {
    if (!this.username || !this.password) {
      this.errorMessage.set('Por favor, complete todos los campos.');
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/productos']);
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error(error);
        this.errorMessage.set('Usuario o contraseña incorrectos.');
      }
    });
  }
}
