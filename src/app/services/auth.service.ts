import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apiService: ApiService) {}

  // Login user
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/login', credentials);
  }

  // Register user
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/register', userData);
  }

  // Logout user
  logout(): Observable<any> {
    return this.apiService.post('/logout', {});
  }

  // Get current user profile
  getProfile(): Observable<any> {
    return this.apiService.get('/profile');
  }

  // Set authentication token after successful login
  setToken(token: string) {
    this.apiService.setAuthToken(token);
    localStorage.setItem('auth_token', token);
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Clear token on logout
  clearToken() {
    this.apiService.clearAuthToken();
    localStorage.removeItem('auth_token');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }
}
