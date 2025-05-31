import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="welcome-container">
      <div class="welcome-content">
        <div class="logo-container">
          <span class="logo-text">RawWebUI</span>
          <div class="logo-dot"></div>
        </div>
        <h1 class="welcome-title">Welcome to RawWebUI</h1>
        <p class="welcome-subtitle">Your Modern Web Dashboard Solution</p>
        <div class="features">
          <div class="feature-item">
            <mat-icon>speed</mat-icon>
            <span>Lightning Fast</span>
          </div>
          <div class="feature-item">
            <mat-icon>brush</mat-icon>
            <span>Modern Design</span>
          </div>
          <div class="feature-item">
            <mat-icon>security</mat-icon>
            <span>Secure & Reliable</span>
          </div>
        </div>
        <button mat-raised-button color="primary" class="dashboard-btn" routerLink="/dashboard">
          <mat-icon>dashboard</mat-icon>
          Go to Dashboard
        </button>
      </div>
      <div class="decoration-circles">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>
    </div>
  `,
  styles: [`
    .welcome-container {
      min-height: 100vh;
      width: 100vw;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      position: relative;
      overflow: hidden;
      padding: 2rem;
    }

    .welcome-content {
      text-align: center;
      color: white;
      z-index: 1;
      padding: 2rem;
      max-width: 800px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2rem;
    }

    .logo-text {
      font-size: 3.5rem;
      font-weight: 700;
      background: linear-gradient(45deg, #4A57C6, #00D4FF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 2px;
    }

    .logo-dot {
      width: 12px;
      height: 12px;
      background: #00D4FF;
      border-radius: 50%;
      margin-left: 8px;
      animation: pulse 2s infinite;
    }

    .welcome-title {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      background: linear-gradient(45deg, #fff, #e0e0e0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .welcome-subtitle {
      font-size: 1.2rem;
      color: #a2a3b7;
      margin-bottom: 3rem;
    }

    .features {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 1.5rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      transition: transform 0.3s ease;
    }

    .feature-item:hover {
      transform: translateY(-5px);
    }

    .feature-item mat-icon {
      color: #4A57C6;
    }

    .dashboard-btn {
      padding: 0.8rem 2rem;
      font-size: 1.1rem;
      border-radius: 30px;
      background: linear-gradient(45deg, #4A57C6, #00D4FF);
      border: none;
      color: white;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0 auto;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .dashboard-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(74, 87, 198, 0.4);
    }

    .decoration-circles {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .circle {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(45deg, #4A57C6, #00D4FF);
      opacity: 0.1;
    }

    .circle-1 {
      width: 300px;
      height: 300px;
      top: -100px;
      right: -100px;
    }

    .circle-2 {
      width: 200px;
      height: 200px;
      bottom: -50px;
      left: -50px;
    }

    .circle-3 {
      width: 150px;
      height: 150px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.2);
        opacity: 0.7;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .features {
        flex-direction: column;
        align-items: center;
      }

      .welcome-title {
        font-size: 2rem;
      }

      .logo-text {
        font-size: 2.5rem;
      }

      .welcome-content {
        padding: 1rem;
      }
    }
  `]
})
export class DashboardComponent {}
